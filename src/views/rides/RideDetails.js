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
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowLeft,
  cilUser,
  cilLocationPin,
  cilClock,
} from "@coreui/icons";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rideData = location.state?.ride;
    if (rideData) {
      setRide(rideData);
      setLoading(false);
    } else {
      navigate(-1);
    }
  }, [id, location.state, navigate]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "dispute":
        return <CBadge className="high">Dispute</CBadge>;
      case "cancelled":
        return <CBadge className="high">Cancelled</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  if (loading) {
    return (
      <CRow>
        <CCol className="text-center">
          <CSpinner />
          <p className="mt-2">Loading ride details...</p>
        </CCol>
      </CRow>
    );
  }

  if (!ride) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>
            Ride data not found. Please go back to the rides list and try again.
          </p>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow className="rideDetailsPage">
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
          <h4 className="heading m-0">Ride Details</h4>
        </div>
      </CCol>

      {/* Ride Information */}
      <CCol lg={8}>
        <CCard className="mb-3 ride-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilLocationPin} />
            </span>
            <span>Ride Information</span>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <strong>Ride ID:</strong> {ride._id}
            </div>
            <div className="mb-3">
              <strong>Status:</strong> {getStatusBadge(ride.status)}
            </div>
            <div className="mb-3">
              <strong>Ride Type:</strong> {ride.rideType}
            </div>
            <div className="mb-3">
              <strong>Pickup Location:</strong>{" "}
              {ride.pickUpLocation?.address || "N/A"}
            </div>
            <div className="mb-3">
              <strong>Dropoff Location:</strong>{" "}
              {ride.dropOffLocation?.address || "N/A"}
            </div>
            <div className="mb-3">
              <strong>Distance:</strong> {ride.distance || 0} km
            </div>
            <div className="mb-3">
              <strong>Fare:</strong> ${ride.fare?.toFixed(2) || "0.00"}
            </div>
            <div className="mb-3">
              <strong>Split Fare:</strong> ${ride.splitFare || 0}
            </div>
            <div className="mb-3">
              <strong>Start Time:</strong> {ride.startTime || "N/A"}
            </div>
            <div className="mb-3">
              <strong>End Time:</strong> {ride.endTime || "N/A"}
            </div>
            <div className="mb-3">
              <strong>Created At:</strong> {formatDate(ride.createdAt)}
            </div>
            <div className="mb-3">
              <strong>Updated At:</strong> {formatDate(ride.updatedAt)}
            </div>
          </CCardBody>
        </CCard>

        {/* User Information */}
        {ride.userId && (
          <CCard className="mb-3 ride-card">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>User Information</span>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <strong>Name:</strong> {ride.userId.fullName || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {ride.userId.email || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {ride.userId.phoneNumber || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Role:</strong> {ride.userId.role}
              </div>
              <div className="mb-3">
                <strong>Total Rides:</strong> {ride.userId.totalRides || 0}
              </div>
            </CCardBody>
          </CCard>
        )}

        {/* Driver Information */}
        {ride.driverId && (
          <CCard className="mb-3 ride-card">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Driver Information</span>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <strong>Name:</strong> {ride.driverId.fullName || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {ride.driverId.email || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {ride.driverId.phoneNumber || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Role:</strong> {ride.driverId.role}
              </div>
              <div className="mb-3">
                <strong>Driving License:</strong>{" "}
                {ride.driverId.drivingLicense || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Total Rides:</strong> {ride.driverId.totalRides || 0}
              </div>
            </CCardBody>
          </CCard>
        )}
      </CCol>

      <CCol lg={4}>
        {/* Ride Status */}
        <CCard className="ride-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilClock} />
            </span>
            <span>Ride Status</span>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <strong>Completed:</strong> {ride.isCompleted ? "Yes" : "No"}
            </div>
            <div className="mb-3">
              <strong>Cancelled:</strong> {ride.isCancelled ? "Yes" : "No"}
            </div>
            <div className="mb-3">
              <strong>Payment:</strong> {ride.isPayment ? "Yes" : "No"}
            </div>
            <div className="mb-3">
              <strong>Disputed:</strong> {ride.isDisputed ? "Yes" : "No"}
            </div>
            <div className="mb-3">
              <strong>Review:</strong> {ride.isReview ? "Yes" : "No"}
            </div>
          </CCardBody>
        </CCard>

        {/* Split Members */}
        {ride.splitMembers && ride.splitMembers.length > 0 && (
          <CCard className="ride-card mb-3">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Split Members</span>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                {ride.splitMembers.map((member, index) => (
                  <CListGroupItem key={index}>
                    <div className="d-flex justify-content-between">
                      <span>
                        {member.name || member.email || `Member ${index + 1}`}
                      </span>
                      <span>${member.amount || 0}</span>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        )}
        {/* Vendor Information */}
        {ride.vendorId && (
          <CCard className="mb-3 ride-card">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Vendor Information</span>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <strong>Business Name:</strong>{" "}
                {ride.vendorId.businessName || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {ride.vendorId.email || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {ride.vendorId.phoneNumber || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Role:</strong> {ride.vendorId.role}
              </div>
              <div className="mb-3">
                <strong>Business License:</strong>{" "}
                {ride.vendorId.businessLicense || "N/A"}
              </div>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  );
};

export default RideDetails;
