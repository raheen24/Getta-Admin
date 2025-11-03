import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CButton, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilArrowLeft,
  cilLocationPin,
  cilBriefcase,
  cilNotes,
  cilWarning,
} from '@coreui/icons'
import { apiHelper } from '../../services'
import { toast } from 'react-toastify'
import chat4 from "src/assets/images/chat4.png";

const ReportDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const [report, setReport] = useState(location.state?.report)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleActivateDeactivate = async () => {
    const action = report.reportedUser?.isActive ? 'deactivate' : 'activate'
    const requestbody = {
      reportId: report._id,
      action,
      userId: report.reportedUser._id,
    }
    try {
      setLoading(true)
      const { response, error } = await apiHelper('POST', `/admin/reports/resolve`, {}, requestbody)

      if (response?.data?.status === 1) {
        toast.success(`User ${action}ed successfully.`)
        setReport((prev) => ({
          ...prev,
          status: 'Resolved',
          reportedUser: {
            ...prev.reportedUser,
            isActive: action === 'activate',
          },
        }))
      } else {
        toast.error(response?.data?.message || error || 'Failed to update.')
      }
    } catch (err) {
      console.error('Catch Error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!report) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>Report data not found. Please go back to the reports list and try again.</p>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow className="reportDetailsPage">
      <CCol xs={12} className="d-flex flex-column flex-sm-row justify-content-between gap-2 align-items-start align-items-sm-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <CButton color="link" onClick={() => navigate(-1)} className="backbtn p-0">
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <h4 className="heading">Report Details</h4>
        </div>
        <CBadge
          className={
            report.status === 'Approved'
              ? 'success'
              : report.status === 'Rejected'
                ? 'high'
                : 'pending'
          }
        >
          {report.status || 'Pending'}
        </CBadge>
      </CCol>

      {/* Report Information */}
      <CCol lg={12}>
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilWarning} />
            </span>
            <span>Report Information</span>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <p>
                  <strong>Report ID:</strong> {report._id}
                </p>
                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
              </CCol>
              <CCol md={6}>
                <p>
                  <CIcon icon={cilCalendar} className="me-2 text-muted" />
                  <strong>Reported Date:</strong> {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong> {new Date(report.updatedAt).toLocaleDateString()}
                </p>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Reporter Information */}
      <CCol lg={6}>
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>Reporter (Who Reported)</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center mb-3">
              {report.userId?.profilePicture && (
                <img
                  src={report.userId.profilePicture || chat4}
                  alt="Reporter"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' , border: "1px solid #ddd"}}
                />
              )}
              <div>
                <p className="name mb-1">
                  {report.userId?.firstName || 'N/A'} {report.userId?.lastName || 'N/A'}
                </p>
                <p className="text-muted mb-0">{report.userId?.role || 'N/A'}</p>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {report.userId?.emailAddress || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />
              {report.userId?.phoneNumber || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilLocationPin} className="me-2 text-muted" />
              {report.userId?.location?.name || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" />
              Joined:{' '}
              {report.userId?.createdAt
                ? new Date(report.userId.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Reported User Information */}
      <CCol lg={6}>
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>Reported User (Who Was Reported)</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center mb-3">
              {report.reportedUser?.profilePicture && (
                <img
                  src={report.reportedUser.profilePicture || chat4}
                  alt="Reported User"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover', border: "1px solid #ddd" }}
                />
              )}
              <div>
                <p className="name mb-1">
                  {report.reportedUser?.firstName || 'N/A'} {report.reportedUser?.lastName || 'N/A'}
                </p>
                <p className="text-muted mb-0">{report.reportedUser?.role || 'N/A'}</p>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {report.reportedUser?.emailAddress || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />
              {report.reportedUser?.phoneNumber || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilLocationPin} className="me-2 text-muted" />
              {report.reportedUser?.location?.name || 'N/A'}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" />
              Joined:{' '}
              {report.reportedUser?.createdAt
                ? new Date(report.reportedUser.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
            <div className="mt-3">
              <p className="d-flex align-items-center gap-2">
                <strong>Status:</strong>
                <CBadge className={report.reportedUser?.isActive ? 'medium' : 'high'}>
                  {report.reportedUser?.isActive ? 'Active' : 'Inactive'}
                </CBadge>
              </p>
              <p className="d-flex align-items-center gap-2">
                <strong>Verified:</strong>
                <CBadge className={report.reportedUser?.isVerified ? 'medium' : 'pending'} ms-2>
                  {report.reportedUser?.isVerified ? 'Verified' : 'Unverified'}
                </CBadge>
              </p>
              <div className="mt-3">
                <CButton
                  size="sm"
                  onClick={handleActivateDeactivate}
                  disabled={loading}
                  className={report.reportedUser?.isActive ? 'medium' : 'high'}
                >
                  {loading ? (
                    <CSpinner size="sm" />
                  ) : report.reportedUser?.isActive ? (
                    'Deactivate'
                  ) : (
                    'Activate'
                  )}
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Additional Details */}
      {report.reportedUser && (
        <CCol lg={12}>
          <CCard className="user-card">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilNotes} />
              </span>
              <span>Reported User Details</span>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <p>
                    <strong>Age:</strong> {report.reportedUser.age || 'N/A'}
                  </p>
                  <p>
                    <strong>Gender:</strong> {report.reportedUser.gender || 'N/A'}
                  </p>
                  <p>
                    <strong>Relationship:</strong> {report.reportedUser.relationship || 'N/A'}
                  </p>
                </CCol>
                <CCol md={4}>
                  <p>
                    <strong>Interests:</strong> {report.reportedUser.interests?.join(', ') || 'N/A'}
                  </p>
                  <p>
                    <strong>Hobbies:</strong> {report.reportedUser.hobbies?.join(', ') || 'N/A'}
                  </p>
                  <p>
                    <strong>Professions:</strong>{' '}
                    {report.reportedUser.professions?.join(', ') || 'N/A'}
                  </p>
                </CCol>
                <CCol md={4}>
                  <p>
                    <strong>Total Friends:</strong> {report.reportedUser.totalFriends || 0}
                  </p>
                  <p>
                    <strong>Total Likes:</strong> {report.reportedUser.myTotalLikes || 0}
                  </p>
                  <p>
                    <strong>Total Reels:</strong> {report.reportedUser.totalReels || 0}
                  </p>
                </CCol>
              </CRow>
              {report.reportedUser.about && (
                <div className="mt-3">
                  <strong>About:</strong>
                  <p className="mt-2">{report.reportedUser.about}</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </CRow>
  )
}
export default ReportDetails
