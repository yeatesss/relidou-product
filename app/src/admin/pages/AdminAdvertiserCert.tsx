import { useState, useEffect } from 'react'
import {
  FileText,
  CheckCircle,
  X,
  AlertCircle,
  Eye,
  Download,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { advertiserCertifications } from '../data/mockData'

// 广告主认证类型
type AdvertiserCertification = {
  id: string
  userId: string
  companyName: string
  businessLicense: string
  creditCode: string
  legalPerson: string
  registeredAddress: string
  validUntil: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectReason?: string
}

export default function AdminAdvertiserCert() {
  const [isVisible, setIsVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedCert, setSelectedCert] = useState<AdvertiserCertification | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredCerts = advertiserCertifications.filter(cert => {
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus
    const matchesSearch =
      searchQuery === '' ||
      cert.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.creditCode.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待审核'
      case 'approved':
        return '已通过'
      case 'rejected':
        return '已驳回'
      default:
        return status
    }
  }

  const handleApprove = (certId: string) => {
    if (confirm('确认通过该广告主的认证申请？')) {
      alert('认证已通过！')
      // TODO: 调用API更新状态
    }
  }

  const handleReject = (certId: string) => {
    const reason = prompt('请输入驳回原因：')
    if (reason) {
      alert(`认证已驳回！原因：${reason}`)
      // TODO: 调用API更新状态
    }
  }

  const viewDetail = (cert: AdvertiserCertification) => {
    setSelectedCert(cert)
    setShowDetailModal(true)
  }

  return (
    <div className={`space-y-6 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">广告主认证管理</h1>
          <p className="text-slate-500 mt-1">
            管理平台所有广告主的企业认证申请，共 {advertiserCertifications.length} 条记录
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">总认证数</p>
          <p className="text-2xl font-bold text-slate-800">{advertiserCertifications.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">
            {advertiserCertifications.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">已通过</p>
          <p className="text-2xl font-bold text-green-600">
            {advertiserCertifications.filter(c => c.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">已驳回</p>
          <p className="text-2xl font-bold text-red-600">
            {advertiserCertifications.filter(c => c.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索公司名称、统一社会信用代码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              待审核
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              已通过
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              已驳回
            </button>
          </div>
        </div>
      </div>

      {/* Certification List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">公司名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">统一社会信用代码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">法人代表</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">注册地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">有效期至</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">提交时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800">{cert.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{cert.creditCode}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cert.legalPerson}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{cert.registeredAddress}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cert.validUntil}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cert.submittedAt}</td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(cert.status)}>{getStatusText(cert.status)}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-xs"
                        onClick={() => viewDetail(cert)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        查看
                      </Button>
                      {cert.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#1dbf73] hover:bg-[#19a463] text-xs"
                            onClick={() => handleApprove(cert.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            通过
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => handleReject(cert.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            驳回
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">认证详情</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">企业信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">公司名称</p>
                    <p className="text-sm font-medium text-slate-800">{selectedCert.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">统一社会信用代码</p>
                    <p className="text-sm font-mono text-slate-800">{selectedCert.creditCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">法人代表</p>
                    <p className="text-sm text-slate-800">{selectedCert.legalPerson}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">注册地址</p>
                    <p className="text-sm text-slate-800">{selectedCert.registeredAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">营业执照有效期</p>
                    <p className="text-sm text-slate-800">{selectedCert.validUntil}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">提交时间</p>
                    <p className="text-sm text-slate-800">{selectedCert.submittedAt}</p>
                  </div>
                </div>
              </div>

              {/* Business License */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">营业执照</h3>
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <img
                    src={selectedCert.businessLicense}
                    alt="营业执照"
                    className="max-w-full h-auto rounded"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 border-slate-200"
                    onClick={() => window.open(selectedCert.businessLicense, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载图片
                  </Button>
                </div>
              </div>

              {/* Reject Reason (if rejected) */}
              {selectedCert.status === 'rejected' && selectedCert.rejectReason && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">驳回原因</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{selectedCert.rejectReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Audit Info (if approved or rejected) */}
              {(selectedCert.status === 'approved' || selectedCert.status === 'rejected') && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">审核信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">审核时间</p>
                      <p className="text-sm text-slate-800">{selectedCert.reviewedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">审核人</p>
                      <p className="text-sm text-slate-800">{selectedCert.reviewedBy}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedCert.status === 'pending' && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowDetailModal(false)}
                >
                  取消
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleReject(selectedCert.id)
                    setShowDetailModal(false)
                  }}
                >
                  驳回
                </Button>
                <Button
                  className="flex-1 bg-[#1dbf73] hover:bg-[#19a463]"
                  onClick={() => {
                    handleApprove(selectedCert.id)
                    setShowDetailModal(false)
                  }}
                >
                  通过
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
