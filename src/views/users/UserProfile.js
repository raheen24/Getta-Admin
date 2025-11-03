import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CBadge,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilClock,
  cilArrowLeft,
  cilLocationPin,
  cilBriefcase,
  cilCloudUpload,
  cilNotes,
  cilStar,
  cilSearch,
  cilCarAlt,
} from "@coreui/icons";
import { cilFindInPage, cilCloudDownload } from "@coreui/icons";
import chat4 from "src/assets/images/chat4.png";

import { apiHelper } from "src/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      let extension = "";
      if (url.includes(".")) {
        extension = url.split(".").pop().split(/\#|\?/)[0];
      } else if (blob.type) {
        extension = blob.type.split("/")[1];
      }
      const finalName = fileName.endsWith(`.${extension}`)
        ? fileName
        : `${fileName}.${extension}`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = finalName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "N/A";
    if (timeStr.includes("T")) {
      const time = timeStr.split("T")[1].split(".")[0];
      return time.split(":").slice(0, 2).join(":");
    } else {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [ridesSearchTerm, setRidesSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ridesLoading, setRidesLoading] = useState(false);
  const ridesFetchedRef = useRef(false);

  const fetchUserDetails = async () => {
    if (!id) return;

    try {
      setFetchLoading(true);
      const { response, error } = await apiHelper(
        "GET",
        `admin/get-customer-by-id/${id}`,
        {},
        null
      );

      if (response?.data?.status === 1) {
        setUser(response.data.data);
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch user details."
        );
        navigate(-1);
      }
    } catch (err) {
      console.error("Fetch user details error:", err);
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchUserRides = async (page = 1, search = "") => {
    if (!id || ridesFetchedRef.current) return;

    ridesFetchedRef.current = true;

    try {
      setRidesLoading(true);
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append("q", search);
      }

      const endpoint = `admin/get-customer-rides/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const { response, error } = await apiHelper("GET", endpoint, {}, null);

      if (response?.data?.status === 1) {
        setRides(response.data.data.rides || []);
        const pagination = response.data.data.pagination;
        if (pagination) {
          setTotalPages(pagination.pages || 1);
        }
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch user rides."
        );
        setRides([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch user rides error:", err);
      toast.error("Something went wrong. Please try again.");
      setRides([]);
      setTotalPages(1);
    } finally {
      setRidesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    if (user && currentPage !== 1) {
      ridesFetchedRef.current = false;
      fetchUserRides(currentPage, ridesSearchTerm);
    }
  }, [user, currentPage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (user) {
        ridesFetchedRef.current = false;
        fetchUserRides(1, ridesSearchTerm);
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [ridesSearchTerm, user]);

  const getRideStatusBadge = (status) => {
    const customClasses = {
      accepted: "low",
      pending: "pending",
      cancelled: "high",
      completed: "medium",
    };

    const defaultColors = {
      ongoing: "info",
    };

    const appliedClass =
      customClasses[status] || defaultColors[status] || "secondary";

    return <CBadge className={appliedClass}>{status}</CBadge>;
  };
  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const { response, error } = await apiHelper(
        "PATCH",
        `admin/toggle-user/${id}`
      );

      if (error) {
        toast.error(error || "Failed to toggle user status.");
        return;
      }
      if (response?.data?.status === 1 && response?.data?.data) {
        setUser((prev) => ({
          ...prev,
          isBlocked: response.data.data.isBlocked,
        }));
        toast.success(
          response.data.message || "User status updated successfully."
        );
      } else {
        toast.error(response?.data?.message || "Failed to toggle user status.");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (fetchLoading) {
    return (
      <CRow>
        <CCol className="text-center">
          <CSpinner />
          <p className="mt-2">Loading user details...</p>
        </CCol>
      </CRow>
    );
  }

  if (!user) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>
            User data not found. Please go back to the users list and try again.
          </p>
        </CCol>
      </CRow>
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
            onClick={() => navigate(-1)}
            className="backbtn p-0"
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <h4 className="heading m-0">User Details</h4>
        </div>

        {/* <CButton color="primary">Edit User</CButton> */}
      </CCol>

      {/* Personal Info */}
      <CCol lg={8}>
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>Personal Information</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={user.profilePicture || chat4}
                  alt="User Avatar"
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
                {user.avatar && (
                  <button
                    onClick={() =>
                      handleDownload(
                        user.avatar,
                        `user-avatar-${user.firstName}-${user.lastName}.jpg`
                      )
                    }
                    className="icon-action"
                    title="Download Avatar"
                  >
                    <CIcon icon={cilCloudDownload} />
                  </button>
                )}
              </div>

              <div>
                <strong className="name">{user.fullName || "N/A"}</strong>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {user.email || "N/A"}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
              {user.phoneNumber || "N/A"}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <CIcon icon={cilLocationPin} className="me-2 text-muted" />
              {user.location?.address || "N/A"}
            </p>
          </CCardBody>
        </CCard>

        {/* Professional Info */}
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilBriefcase} />
            </span>
            <span>User Details</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio || "N/A"}
            </p>
            <p>
              <strong>Total Rides:</strong> {user.totalRides || 0}
            </p>
            <p>
              <strong>Earning:</strong> ${user.earning || 0}
            </p>
            <p>
              <strong>Points:</strong> {user.points || 0}
            </p>
            <p>
              <strong>SSN:</strong>{" "}
              {user.ssn ? `***-**-${user.ssn.toString().slice(-4)}` : "N/A"}
            </p>
          </CCardBody>
        </CCard>
        {/* Stripe Account */}
        <CCard className="user-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilNotes} />
            </span>
            <span>Stripe Account</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Stripe Account ID:</strong>{" "}
              {user.stripeAccountId || "N/A"}
            </p>
            <p>
              <strong>Country Code:</strong> {user.countryCode || "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {user.language || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {user.username || "N/A"}
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={4}>
        <CCard className="user-card mb-3 ">
          <CCardHeader className="section-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Account Status</span>
            </div>
            <CButton
              size="sm"
              onClick={handleStatusToggle}
              disabled={loading}
              className={user.isBlocked ? "medium" : "high"}
            >
              {loading ? (
                <CSpinner size="sm" />
              ) : user.isBlocked ? (
                "Unblock"
              ) : (
                "Block"
              )}
            </CButton>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Active:</strong> {user.isActive ? "Yes" : "No"}
            </p>
            <p>
              <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>Deleted:</strong> {user.isDeleted ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Notification:</strong>{" "}
              {user.isNotification ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>2FA Enabled:</strong>{" "}
              {user.is2FactorEnabled ? "Yes" : "No"}
            </p> */}
          </CCardBody>
        </CCard>
        <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilCloudUpload} />
            </span>
            <span>Bank Details</span>
          </CCardHeader>
          <CCardBody>
            {user.bankDetails?.length > 0 ? (
              user.bankDetails.map((bank, idx) => (
                <div key={idx} className="mb-2">
                  {/* <CListGroupItem> */}
                  <p>
                    <strong>Bank Name:</strong> {bank.bankName}
                  </p>
                  <p>
                    <strong>Account Holder:</strong> {bank.accountHolderName}
                  </p>
                  <p>
                    <strong>Account Number:</strong> ****
                    {bank.accountNumber?.slice(-4)}
                  </p>
                  <p>
                    <strong>Routing Number:</strong> {bank.routingNumber}
                  </p>
                  <p>
                    <strong>Default:</strong> {bank.isDefault ? "Yes" : "No"}
                  </p>
                  {/* </CListGroupItem> */}
                </div>
              ))
            ) : (
              <p>No bank details available</p>
            )}
          </CCardBody>
        </CCard>

        <CCard className="user-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilStar} />
            </span>
            <span>Charges & Vendors</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Per Mile Charge:</strong> ${user.charges?.perMile || 0}
            </p>
            <p>
              <strong>Per Minute Charge:</strong> $
              {user.charges?.perMinute || 0}
            </p>
            <p>
              <strong>Service Charge:</strong> ${user.charges?.service || 0}
            </p>
            <p>
              <strong>Primary Vendor:</strong> {user.primaryVendor || "N/A"}
            </p>
            <p>
              <strong>Secondary Vendor:</strong> {user.secondaryVendor || "N/A"}
            </p>
          </CCardBody>
        </CCard>
        {/* <CCard className="mb-3 user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilClock} />
            </span>
            <span>Additional Info</span>
          </CCardHeader>
          <CCardBody>
            <p><strong>Is Ride:</strong> {user.isRide ? "Yes" : "No"}</p>
            <p><strong>Is Payment:</strong> {user.isPayment ? "Yes" : "No"}</p>
            <p><strong>Is Location:</strong> {user.isLocation ? "Yes" : "No"}</p>
            <p><strong>Is Completed:</strong> {user.isCompleted ? "Yes" : "No"}</p>
            <p><strong>Is Accepted:</strong> {user.isAccepted ? "Yes" : "No"}</p>
            <p><strong>Is Reported:</strong> {user.isReported ? "Yes" : "No"}</p>
            <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
          </CCardBody>
        </CCard> */}
      </CCol>

      {/* User Rides Table */}
      <CCol xs={12} className="mt-4">
        <CCard className="user-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilCarAlt} />
            </span>
            <span>User Rides</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
              <CInputGroup className="searchfield">
                <CFormInput
                  placeholder="Search rides..."
                  value={ridesSearchTerm}
                  onChange={(e) => setRidesSearchTerm(e.target.value)}
                />
                <CButton type="button" color="secondary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </div>

            <CTable hover responsive className="customTables">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Pickup Location</CTableHeaderCell>
                  <CTableHeaderCell>Dropoff Location</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Fare</CTableHeaderCell>
                  <CTableHeaderCell>Distance</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ridesLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      <CSpinner size="sm" />
                    </CTableDataCell>
                  </CTableRow>
                ) : rides.length > 0 ? (
                  rides.map((ride) => (
                    <CTableRow key={ride._id}>
                      <CTableDataCell>
                        {ride.pickUpLocation?.address || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {ride.dropOffLocation?.address || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getRideStatusBadge(ride.status)}
                      </CTableDataCell>
                      <CTableDataCell>${ride.fare || 0}</CTableDataCell>
                      <CTableDataCell>{ride.distance || 0} km</CTableDataCell>
                      <CTableDataCell>
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      No rides found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {totalPages > 1 && (
              <CPagination align="center" className="mt-3">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                {(() => {
                  const pages = [];

                  if (totalPages <= 7) {
                    // Show all pages if total is 7 or less
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Show first page
                    pages.push(1);

                    if (currentPage > 4) {
                      pages.push("...");
                    }

                    // Show pages around current page
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 3) {
                      pages.push("...");
                    }

                    // Show last page
                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === currentPage}
                      disabled={page === "..."}
                      onClick={() => page !== "..." && setCurrentPage(page)}
                    >
                      {page}
                    </CPaginationItem>
                  ));
                })()}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default UserProfile;
