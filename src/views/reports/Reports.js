import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CButton,
  CInputGroup,
  CFormInput,
  CPagination,
  CPaginationItem,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch } from '@coreui/icons'
import { apiHelper } from '../../services'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Reports = () => {
  const navigate = useNavigate()

  const [reports, setReports] = useState([
    {
      _id: 1,
      reportedUser: { firstName: "John", lastName: "Doe", isActive: true },
      userId: { firstName: "Jane", lastName: "Smith" },
      reason: "Late arrival",
      createdAt: "2023-10-01T10:00:00Z",
      status: "Pending",
    },
    {
      _id: 2,
      reportedUser: { firstName: "Mike", lastName: "Johnson", isActive: false },
      userId: { firstName: "Sarah", lastName: "Wilson" },
      reason: "Vehicle condition",
      createdAt: "2023-10-02T14:30:00Z",
      status: "Approved",
    },
    {
      _id: 3,
      reportedUser: { firstName: "Alex", lastName: "Davis", isActive: true },
      userId: { firstName: "Tom", lastName: "Brown" },
      reason: "Driver behavior",
      createdAt: "2023-10-03T09:15:00Z",
      status: "Rejected",
    },
    {
      _id: 4,
      reportedUser: { firstName: "Lisa", lastName: "Green", isActive: true },
      userId: { firstName: "David", lastName: "White" },
      reason: "Wrong route",
      createdAt: "2023-10-04T16:45:00Z",
      status: "Pending",
    },
    {
      _id: 5,
      reportedUser: { firstName: "Chris", lastName: "Taylor", isActive: false },
      userId: { firstName: "Emma", lastName: "Brown" },
      reason: "Billing error",
      createdAt: "2023-10-05T11:20:00Z",
      status: "Approved",
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReports = async (page = 1, search = '', isInitial = false) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setTableLoading(true)
    }
    // Simulate API call delay
    setTimeout(() => {
      const filteredReports = reports.filter(report =>
        report.reportedUser.firstName.toLowerCase().includes(search.toLowerCase()) ||
        report.reportedUser.lastName.toLowerCase().includes(search.toLowerCase()) ||
        report.reason.toLowerCase().includes(search.toLowerCase()) ||
        report.status.toLowerCase().includes(search.toLowerCase())
      )
      setReports(filteredReports)
      setTotalPages(Math.ceil(filteredReports.length / 10))
      if (isInitial) {
        setLoading(false)
      } else {
        setTableLoading(false)
      }
    }, 500)
  }

  useEffect(() => {
    fetchReports(1, '', true)
  }, [])

  useEffect(() => {
    if (currentPage !== 1 || searchTerm) {
      const delayDebounce = setTimeout(() => {
        fetchReports(currentPage, searchTerm)
      }, 500)
      return () => clearTimeout(delayDebounce)
    }
  }, [currentPage, searchTerm])

  const handleRowClick = (report) => {
    navigate(`/reports/${report._id}`, { state: { report } })
  }
  // ✅ Accept handler

  const handleAccept = async (reportId) => {
    setActionLoading((prev) => ({ ...prev, [reportId]: 'approve' }))
    // Simulate API call
    setTimeout(() => {
      setReports(prevReports =>
        prevReports.map(report =>
          report._id === reportId ? { ...report, status: 'Approved' } : report
        )
      )
      toast.success('Report approved successfully!')
      setActionLoading((prev) => ({ ...prev, [reportId]: null }))
    }, 1000)
  }

  const handleReject = async (reportId) => {
    setActionLoading((prev) => ({ ...prev, [reportId]: 'reject' }))
    // Simulate API call
    setTimeout(() => {
      setReports(prevReports =>
        prevReports.map(report =>
          report._id === reportId ? { ...report, status: 'Rejected' } : report
        )
      )
      toast.success('Report rejected successfully!')
      setActionLoading((prev) => ({ ...prev, [reportId]: null }))
    }, 1000)
  }

  if (loading) {
    return (
      <div className="reportsPage">
        <h4 className="heading mb-3">Reports</h4>
        <div className="text-center">
          <CSpinner />
        </div>
      </div>
    )
  }
  return (
    <CRow>
      <h4 className="heading mb-3">Reports</h4>
      <CCol xs={12}>
        <CRow className="mb-3">
          <CCol md={6}>
            <CInputGroup className="searchfield">
              <CFormInput
                placeholder="Search reports by name, reason, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CButton type="button" color="secondary" variant="outline">
                <CIcon icon={cilSearch} />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
      </CCol>
      <CCol xs={12}>
        <CTable hover responsive className="customTables">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Reported User</CTableHeaderCell>
              <CTableHeaderCell>Reported By</CTableHeaderCell>
              <CTableHeaderCell>Reason</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>User Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tableLoading ? (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center">
                  <CSpinner size="sm" />
                </CTableDataCell>
              </CTableRow>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <CTableRow
                  key={report._id}
                  onClick={() => handleRowClick(report)}
                  style={{ cursor: 'pointer' }}
                >
                  <CTableDataCell>
                    {report.reportedUser?.firstName || 'N/A'} {report.reportedUser?.lastName}
                  </CTableDataCell>
                  <CTableDataCell>
                    {report.userId?.firstName} {report.userId?.lastName}
                  </CTableDataCell>
                  <CTableDataCell>{report.reason}</CTableDataCell>
                  <CTableDataCell>{new Date(report.createdAt).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>
                    {report.reportedUser?.isActive ? 'Active' : 'Inactive'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {report.status === 'Pending' ? (
                      <>
                        <CButton
                          size="sm"
                          className="medium me-2"
                          onClick={() => handleAccept(report._id)}
                          disabled={actionLoading[report._id] === 'approve'}
                        >
                          {actionLoading[report._id] === 'approve' ? (
                            <CSpinner size="sm" />
                          ) : (
                            <CIcon icon={cilCheck} />
                          )}
                        </CButton>
                        <CButton
                          size="sm"
                          className="high"
                          onClick={() => handleReject(report._id)}
                          disabled={actionLoading[report._id] === 'reject'}
                        >
                          {actionLoading[report._id] === 'reject' ? (
                            <CSpinner size="sm" />
                          ) : (
                            <CIcon icon={cilX} />
                          )}
                        </CButton>
                      </>
                    ) : report.status === 'Approved' ? (
                      <span className="badge medium">Approved</span>
                    ) : report.status === 'Rejected' ? (
                      <span className="badge high">Rejected</span>
                    ) : (
                      <span className="badge">--</span>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center">
                  {searchTerm ? 'No reports match your search' : 'No reports found'}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Backend Pagination */}
        {totalPages > 1 && (
          <CPagination align="center" className="mt-3">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        )}
      </CCol>
    </CRow>
  )
}

export default Reports
