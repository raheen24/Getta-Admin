import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
  CBadge,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilArrowLeft,
  cilLocationPin,
  cilBriefcase,
  cilNotes,
  cilChatBubble,
  cilImage,
} from "@coreui/icons";
import chat4 from "src/assets/images/chat4.png";

import { apiHelper } from "src/services";
import { toast } from "react-toastify";

const DisputeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);

  useEffect(() => {
    fetchDisputeDetails();
  }, [id]);

  const fetchDisputeDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { response, error } = await apiHelper(
        "GET",
        `admin/get-disputes?page=1&limit=100`
      );

      if (response?.data?.status === 1) {
        const disputeData = response.data.data.disputes.find((d) => d._id === id);
        if (disputeData) {
          setDispute(disputeData);
        } else {
          toast.error("Dispute not found.");
          navigate(-1);
        }
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch dispute details."
        );
        navigate(-1);
      }
    } catch (err) {
      console.error("Fetch dispute details error:", err);
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unsolved":
        return <CBadge className="high">Unsolved</CBadge>;
      case "resolved":
        return <CBadge className="medium">Resolved</CBadge>;
      case "under review":
        return <CBadge className="pending">Under Review</CBadge>;
      case "closed":
        return <CBadge className="low">Closed</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  if (loading) {
    return (
      <CRow>
        <CCol className="text-center">
          <CSpinner />
          <p className="mt-2">Loading dispute details...</p>
        </CCol>
      </CRow>
    );
  }

  if (!dispute) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>
            Dispute data not found. Please go back to the disputes list and try again.
          </p>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow className="disputeDetailsPage">
      <CCol
        xs={12}
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <div className="d-flex align-items-center gap-2">
          <CButton
            color="link"
            onClick={() => navigate(-1)}
            className="backbtn p-0"
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <h4 className="heading m-0">Dispute Details</h4>
        </div>
      </CCol>

      {/* Dispute Info */}
      <CCol lg={8}>
        <CCard className="mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilChatBubble} />
            </span>
            <span>Dispute Information</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Dispute ID:</strong> {dispute._id}
            </p>
            <p>
              <strong>Reason:</strong> {dispute.reason}
            </p>
            <p>
              <strong>Type:</strong> {dispute.type}
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge(dispute.status)}
            </p>
            <p>
              <strong>Resolved:</strong> {dispute.isResolved ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(dispute.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(dispute.updatedAt).toLocaleString()}
            </p>
          </CCardBody>
        </CCard>

        {/* Attachments */}
        {dispute.attachments && dispute.attachments.length > 0 && (
          <CCard className="mb-3">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilImage} />
              </span>
              <span>Attachments</span>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {dispute.attachments.map((attachment, index) => (
                  <CCol key={index} md={3} className="mb-3">
                    <img
                      src={attachment}
                      alt={`Attachment ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(attachment, "_blank")}
                    />
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        )}

        {/* Ride Information */}
        {dispute.rideId && (
          <CCard className="mb-3">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilLocationPin} />
              </span>
              <span>Ride Information</span>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Ride ID:</strong> {dispute.rideId._id}
              </p>
              <p>
                <strong>Ride Type:</strong> {dispute.rideId.rideType}
              </p>
              {/* <p>
                <strong>Status:</strong> {dispute.rideId.status}
              </p> */}
              <p>
                <strong>Fare:</strong> ${dispute.rideId.fare}
              </p>
              <p>
                <strong>Distance:</strong> {dispute.rideId.distance} miles
              </p>
              <p>
                <strong>Pickup Location:</strong>{" "}
                {dispute.rideId.pickUpLocation?.address || "N/A"}
              </p>
              <p>
                <strong>Dropoff Location:</strong>{" "}
                {dispute.rideId.dropOffLocation?.address || "N/A"}
              </p>
              <p>
                <strong>Scheduled Date:</strong> {dispute.rideId.scheduledDate}
              </p>
              <p>
                <strong>Scheduled Time:</strong> {dispute.rideId.scheduledTime}
              </p>
            </CCardBody>
          </CCard>
        )}
      </CCol>

      <CCol lg={4}>
        {/* User Information */}
        <CCard className="mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>User Information</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center gap-3 mb-2">
              <img
                src={dispute.userId?.image || chat4}
                alt="User Avatar"
                style={{
                  width: "45px",
                  border: "1px solid #ddd",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <strong className="name">{dispute.userId?.fullName || "N/A"}</strong>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {dispute.userId?.email || "N/A"}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
              {dispute.userId?.phoneNumber || "N/A"}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
              {dispute.userId?.createdAt
                ? new Date(dispute.userId.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {dispute.userId?.bio || "N/A"}
            </p>
            <p>
              <strong>Total Rides:</strong> {dispute.userId?.totalRides || 0}
            </p>
          </CCardBody>
        </CCard>

        {/* Driver Information */}
        <CCard className="mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>Driver Information</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center gap-3 mb-2">
              <img
                src={chat4}
                alt="Driver Avatar"
                style={{
                  width: "45px",
                  border: "1px solid #ddd",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <strong className="name">{dispute.driverId?.fullName || "N/A"}</strong>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {dispute.driverId?.email || "N/A"}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
              {dispute.driverId?.phoneNumber || "N/A"}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
              {dispute.driverId?.createdAt
                ? new Date(dispute.driverId.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {dispute.driverId?.bio || "N/A"}
            </p>
            <p>
              <strong>License:</strong> {dispute.driverId?.drivingLicense || "N/A"}
            </p>
          </CCardBody>
        </CCard>

        {/* Vendor Information */}
        {dispute.vendorId && (
          <CCard className="mb-3">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilBriefcase} />
              </span>
              <span>Vendor Information</span>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Business Name:</strong> {dispute.vendorId.businessName || "N/A"}
              </p>
              <p>
                <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
                {dispute.vendorId.email || "N/A"}
              </p>
              <p>
                <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
                {dispute.vendorId.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Business License:</strong>{" "}
                {dispute.vendorId.businessLicense || "N/A"}
              </p>
            </CCardBody>
          </CCard>
        )}

        {/* Chat IDs */}
        <CCard className="mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilChatBubble} />
            </span>
            <span>Chat Information</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>User Chat ID:</strong> {dispute.userChatId || "N/A"}
            </p>
            {dispute.vendorChatId && (
              <p>
                <strong>Vendor Chat ID:</strong> {dispute.vendorChatId}
              </p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DisputeDetails;