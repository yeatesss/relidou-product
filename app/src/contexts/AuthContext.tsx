import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  phone: string
  role: 'advertiser' | 'creator'
}

interface AuthContextType {
  user: User | null
  login: (phone: string, role: 'advertiser' | 'creator') => void
  authenticate: (phone: string, code: string, role: 'advertiser' | 'creator') => Promise<{ isNewUser: boolean; user: User }>
  logout: () => void
  isAuthenticated: boolean
  isCreatorProfileComplete: () => boolean
  isAdvertiserCertified: () => boolean
  getAdvertiserCertificationStatus: () => 'not_submitted' | 'pending' | 'approved' | 'rejected'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // 使用初始化函数，在组件首次渲染时立即从 localStorage 读取
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      localStorage.removeItem('user')
      return null
    }
  })

  // 移除 useEffect，因为已经使用初始化函数处理了

  const login = (phone: string, role: 'advertiser' | 'creator') => {
    const userData: User = { phone, role }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 统一的认证方法：自动判断登录或注册
  const authenticate = async (phone: string, code: string, role: 'advertiser' | 'creator') => {
    // 模拟验证码验证
    if (code !== '123456') {
      throw new Error('验证码错误')
    }

    // 检查用户是否已存在（从 localStorage 模拟数据库）
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = existingUsers.find((u: any) => u.phone === phone && u.role === role)

    let isNewUser = false

    if (!existingUser) {
      // 用户不存在，自动注册
      isNewUser = true
      const newUser = { phone, role, createdAt: new Date().toISOString() }
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))
    }

    // 登录/注册成功，创建用户会话
    const userData: User = { phone, role }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))

    return { isNewUser, user: userData }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // 检查创作者个人信息是否完整
  const isCreatorProfileComplete = () => {
    if (!user || user.role !== 'creator') {
      return true // 非创作者不需要检查
    }

    const creatorProfile = localStorage.getItem('creatorProfile')
    if (!creatorProfile) {
      return false
    }

    try {
      const profile = JSON.parse(creatorProfile)
      // 检查必填字段
      return !!(profile.realName && profile.idCard && profile.phone && profile.city)
    } catch {
      return false
    }
  }

  // 检查广告主是否已认证
  const isAdvertiserCertified = () => {
    if (!user || user.role !== 'advertiser') {
      return true // 非广告主不需要检查
    }

    const certification = localStorage.getItem('advertiserCertification')
    if (!certification) {
      return false
    }

    try {
      const cert = JSON.parse(certification)
      // 只有审核通过才能使用
      return cert.status === 'approved'
    } catch {
      return false
    }
  }

  // 获取广告主认证状态
  const getAdvertiserCertificationStatus = (): 'not_submitted' | 'pending' | 'approved' | 'rejected' => {
    if (!user || user.role !== 'advertiser') {
      return 'approved' // 非广告主默认通过
    }

    const certification = localStorage.getItem('advertiserCertification')
    if (!certification) {
      return 'not_submitted'
    }

    try {
      const cert = JSON.parse(certification)
      return cert.status || 'not_submitted'
    } catch {
      return 'not_submitted'
    }
  }

  const value = {
    user,
    login,
    authenticate,
    logout,
    isAuthenticated: !!user,
    isCreatorProfileComplete,
    isAdvertiserCertified,
    getAdvertiserCertificationStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
