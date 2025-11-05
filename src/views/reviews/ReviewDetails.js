import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  cilUser,
  cilCalendar,
  cilCommentBubble,
  cilArrowLeft,
} from "@coreui/icons";
import { apiHelper } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewDetails = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewDetails();
  }, [id]);

  const fetchReviewDetails = async () => {
    setLoading(true);
    const { error, response } = await apiHelper(
      "GET",
      `admin/get-reviews?page=1&limit=100`
    );
    setLoading(false);
    if (error) {
      console.error("Error fetching review details:", error);
      return;
    }
    // Find the specific review by id
    const reviewData = response.data.data.reviews.find((r) => r._id === id);
    setReview(reviewData);
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={i < rating ? "text-warning" : "text-secondary"}
            size="sm"
          />
        ))}
        <span className="ms-2 fw-bold">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <CSpinner size="lg" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center">
        <h4>Review not found</h4>
      </div>
    );
  }

  return (
    <div className="reviewDetailsPage">
      <div className="d-flex align-items-center gap-2 mb-3">
        <CButton
          color="link"
          onClick={() => navigate(-1)}
          className="backbtn p-0"
        >
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        <h4 className="heading m-0">Reviews Management</h4>
      </div>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilCommentBubble} />
              </span>
              Review Information
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6}>
                  <p>
                    <strong>Review ID:</strong> {review._id}
                  </p>
                  <p className="d_flex">
                    <strong>Rating:</strong> {renderStars(review.rating)}
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </CCol>
                <CCol md={6}>
                  <p>
                    <strong>Ride ID:</strong> {review.rideId._id}
                  </p>
                  <p>
                    <strong>Fare:</strong> ${review.rideId.fare}
                  </p>
                  <p>
                    <strong>Distance:</strong> {review.rideId.distance} miles
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <CBadge className="medium">{review.rideId.status}</CBadge>
                  </p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>User Information</span>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={
                      review.userId.image || "https://via.placeholder.com/50"
                    }
                    alt="User Avatar"
                    style={{
                      width: "45px",
                      border: "1px solid #ddd",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <strong className="name">{review.userId.fullName}</strong>
                </div>
              </div>
              <p>
                <CIcon icon={cilUser} className="me-2 text-muted" />
                {review.userId.email}
              </p>
              <p>
                <CIcon icon={cilUser} className="me-2 text-muted" />{" "}
                {review.userId.phoneNumber}
              </p>
              <p>
                <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
                {new Date(review.userId.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Bio:</strong> {review.userId.bio || "N/A"}
              </p>
              <p>
                <strong>Total Rides:</strong> {review.userId.totalRides || 0}
              </p>
              <p>
                <strong>Earning:</strong> ${review.userId.earning || 0}
              </p>
              <p>
                <strong>Points:</strong> {review.userId.points || 0}
              </p>
              <p>
                <strong>SSN:</strong>{" "}
                {review.userId.ssn
                  ? `***-**-${review.userId.ssn.toString().slice(-4)}`
                  : "N/A"}
              </p>
            </CCardBody>
          </CCard>
          <CCard className="mb-4">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Account Status</span>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Active:</strong>{" "}
                {review.driverId.isActive ? "Yes" : "No"}
              </p>
              <p>
                <strong>Verified:</strong>{" "}
                {review.driverId.isVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Blocked:</strong>{" "}
                {review.driverId.isBlocked ? "Yes" : "No"}
              </p>
              <p>
                <strong>Notification:</strong>{" "}
                {review.driverId.isNotification ? "Yes" : "No"}
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Driver Information</span>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Driver Avatar"
                    style={{
                      width: "45px",
                      border: "1px solid #ddd",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <strong className="name">{review.driverId.fullName}</strong>
                </div>
              </div>
              <p>
                <CIcon icon={cilUser} className="me-2 text-muted" />
                {review.driverId.email}
              </p>
              <p>
                <CIcon icon={cilUser} className="me-2 text-muted" />{" "}
                {review.driverId.phoneNumber}
              </p>
              <p>
                <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
                {new Date(review.driverId.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Bio:</strong> {review.driverId.bio || "N/A"}
              </p>
              <p>
                <strong>Total Rides:</strong> {review.driverId.totalRides || 0}
              </p>
              <p>
                <strong>Earning:</strong> ${review.driverId.earning || 0}
              </p>
              <p>
                <strong>License:</strong> {review.driverId.drivingLicense}
              </p>
              <p>
                <strong>Driver Vendor:</strong>{" "}
                {review.driverId.driverVendor || "N/A"}
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ReviewDetails;
