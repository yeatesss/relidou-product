import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'
import { AuthProvider } from './contexts/AuthContext'

// Frontend Pages
import Home from './pages/Home'
import BrowseOrders from './pages/BrowseOrders'
import OrderDetail from './pages/OrderDetail'
import Creators from './pages/Creators'
import CreatorProfile from './pages/CreatorProfile'
import PostOrder from './pages/PostOrder'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import Messages from './pages/Messages'
import HowItWorks from './pages/HowItWorks'
import ClientWorkspace from './pages/ClientWorkspace'
import CreatorWorkspace from './pages/CreatorWorkspace'
import VideoReview from './pages/VideoReview'

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/components/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminOrders from './admin/pages/AdminOrders'
import AdminUsers from './admin/pages/AdminUsers'
import AdminCreators from './admin/pages/AdminCreators'
import AdminReviews from './admin/pages/AdminReviews'
import AdminContent from './admin/pages/AdminContent'
import AdminSettings from './admin/pages/AdminSettings'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="creators" element={<AdminCreators />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Video Review - 全屏页面，不需要Navbar和Footer */}
        <Route path="/video-review" element={<VideoReview />} />

        {/* Post Order - 全屏页面，不需要Footer */}
        <Route path="/post-order" element={<PostOrder />} />

        {/* Frontend Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-white">
              <Navbar scrolled={scrolled} />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/orders" element={<BrowseOrders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/creators" element={<Creators />} />
                  <Route path="/creators/:id" element={<CreatorProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/client-workspace" element={<ClientWorkspace />} />
                  <Route path="/creator-workspace" element={<CreatorWorkspace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
)
}

export default App
