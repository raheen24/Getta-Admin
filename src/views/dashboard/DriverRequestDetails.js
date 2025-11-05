import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCheck,
  cilX,
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilArrowLeft,
  cilLocationPin,
  cilBriefcase,
  cilNotes,
  cilStar,
} from "@coreui/icons";
import { toast } from "react-toastify";
import chat4 from "src/assets/images/chat4.png";

const DriverRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    const requestData = location.state?.request;
    if (requestData) {
      setRequest(requestData);
    } else {
        toast.error("Request details not found.");
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <CBadge className="pending">Pending</CBadge>;
      case "approved":
        return <CBadge className="medium">Approved</CBadge>;
      case "rejected":
        return <CBadge className="high">Rejected</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

//   const handleApprove = async () => {
//     setApproveLoading(true);
//     setTimeout(() => {
//       toast.success("Request accepted successfully.");
//       setApproveLoading(false);
//       navigate("/dashboard");
//     }, 1000);
//   };

//   const handleReject = async () => {
//     setRejectLoading(true);
//     setTimeout(() => {
//       toast.success("Request rejected successfully.");
//       setRejectLoading(false);
//       navigate("/dashboard");
//     }, 1000);
//   };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner />
      </div>
    );
  }

  return (
    <CRow className="userDetailsPage">
      <CCol
        xs={12}
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <div className="d-flex align-items-center gap-2">
          <CButton
            color="link"
            onClick={() => navigate("/dashboard")}
            className="backbtn p-0"
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <h4 className="heading m-0">Driver Request Details</h4>
        </div>
      </CCol>

      {request ? (
        <>
          {/* Driver Info */}
          <CCol lg={8}>
            <CCard className="mb-3 user-card">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilUser} />
                </span>
                <span>Driver Information</span>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    src={request.driverId?.image || chat4}
                    alt="Driver Avatar"
                    style={{
                      width: "45px",
                      border: "1px solid #ddd",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = chat4;
                    }}
                  />

                  <div>
                    <strong className="name">{request.driverId?.fullName || "N/A"}</strong>
                  </div>
                </div>
                <p>
                  <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
                  {request.driverId?.email || "N/A"}
                </p>
                <p>
                  <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
                  {request.driverId?.phoneNumber || "N/A"}
                </p>
                <p>
                  <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
                  {new Date(request.driverId?.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <CIcon icon={cilLocationPin} className="me-2 text-muted" />
                  {request.driverId?.location?.address || "N/A"}
                </p>
              </CCardBody>
            </CCard>

            {/* Driver Details */}
            <CCard className="mb-3 user-card">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilBriefcase} />
                </span>
                <span>Driver Details</span>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Role:</strong> {request.driverId?.role || "N/A"}
                </p>
                <p>
                  <strong>Bio:</strong> {request.driverId?.bio || "N/A"}
                </p>
                <p>
                  <strong>Total Rides:</strong> {request.driverId?.totalRides || 0}
                </p>
                <p>
                  <strong>Earning:</strong> ${request.driverId?.earning || 0}
                </p>
                <p>
                  <strong>Points:</strong> {request.driverId?.points || 0}
                </p>
                <p>
                  <strong>Driving License:</strong> {request.driverId?.drivingLicense || "N/A"}
                </p>
              </CCardBody>
            </CCard>

            {/* Vendor Info */}
            <CCard className="mb-3 user-card">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilStar} />
                </span>
                <span>Vendor Information</span>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    src={request.vendorId?.image || chat4}
                    alt="Vendor Avatar"
                    style={{
                      width: "45px",
                      border: "1px solid #ddd",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = chat4;
                    }}
                  />

                  <div>
                    <strong className="name">{request.vendorId?.businessName || "N/A"}</strong>
                  </div>
                </div>
                <p>
                  <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
                  {request.vendorId?.email || "N/A"}
                </p>
                <p>
                  <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
                  {request.vendorId?.phoneNumber || "N/A"}
                </p>
                <p>
                  <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
                  {new Date(request.vendorId?.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <CIcon icon={cilLocationPin} className="me-2 text-muted" />
                  {request.vendorId?.location?.address || "N/A"}
                </p>
              </CCardBody>
            </CCard>

            {/* Vendor Details */}
            <CCard className="user-card mb-3">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilNotes} />
                </span>
                <span>Vendor Details</span>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Role:</strong> {request.vendorId?.role || "N/A"}
                </p>
                <p>
                  <strong>Business License:</strong> {request.vendorId?.businessLicense || "N/A"}
                </p>
                <p>
                  <strong>Tax ID:</strong> {request.vendorId?.taxIdentificationNumber || "N/A"}
                </p>
                <p>
                  <strong>Per Mile Charge:</strong> ${request.vendorId?.charges?.perMile || 0}
                </p>
                <p>
                  <strong>Per Minute Charge:</strong> ${request.vendorId?.charges?.perMinute || 0}
                </p>
                <p>
                  <strong>Service Charge:</strong> ${request.vendorId?.charges?.service || 0}
                </p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={4}>
            <CCard className="user-card mb-3">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilUser} />
                </span>
                <span>Request Status</span>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Status:</strong> {getStatusBadge(request.status)}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(request.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong> {new Date(request.updatedAt).toLocaleString()}
                </p>
              </CCardBody>
            </CCard>

            {/* <CCard className="user-card mb-3">
              <CCardHeader className="section-header">
                <span className="icon-badge">
                  <CIcon icon={cilCheck} />
                </span>
                <span>Actions</span>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex flex-column gap-2">
                  <CButton
                    className="medium w-100"
                    onClick={handleApprove}
                    disabled={approveLoading}
                  >
                    {approveLoading ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        <CIcon icon={cilCheck} className="me-2" />
                        Accept Request
                      </>
                    )}
                  </CButton>
                  <CButton
                    className="high w-100"
                    onClick={handleReject}
                    disabled={rejectLoading}
                  >
                    {rejectLoading ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        <CIcon icon={cilX} className="me-2" />
                        Reject Request
                      </>
                    )}
                  </CButton>
                </div>
              </CCardBody>
            </CCard> */}
          </CCol>
        </>
      ) : (
        <CCol className="text-center">
          <p>Request details not found.</p>
          <CButton onClick={() => navigate("/dashboard")}>Back to Dashboard</CButton>
        </CCol>
      )}
    </CRow>
  );
};

export default DriverRequestDetails;