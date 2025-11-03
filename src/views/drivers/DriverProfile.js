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
const DriverProfile = () => {
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
  const [driver, setDriver] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [ridesSearchTerm, setRidesSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [totalEarning, setTotalEarning] = useState(0);
  const ridesFetchedRef = useRef(false);

  const fetchDriverDetails = async () => {
    if (!id) return;

    try {
      setFetchLoading(true);
      const { response, error } = await apiHelper(
        "GET",
        `admin/get-driver-by-id/${id}`,
        {},
        null
      );

      if (response?.data?.status === 1) {
        setDriver(response.data.data);
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch driver details."
        );
        navigate(-1);
      }
    } catch (err) {
      console.error("Fetch driver details error:", err);
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchDriverEarning = async () => {
    if (!id) return;

    try {
      const { response, error } = await apiHelper(
        "GET",
        `admin/driver-earning/${id}`,
        {},
        null
      );

      if (response?.data?.status === 1) {
        setTotalEarning(response.data.data.totalEarning || 0);
      } else {
        console.error(
          "Failed to fetch driver earning:",
          response?.data?.message || error
        );
        setTotalEarning(0);
      }
    } catch (err) {
      console.error("Fetch driver earning error:", err);
      setTotalEarning(0);
    }
  };

  const fetchDriverRides = async (page = 1, search = "") => {
    if (!id || ridesFetchedRef.current) return;

    ridesFetchedRef.current = true;

    try {
      setRidesLoading(true);
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append("q", search);
      }

      const endpoint = `admin/get-driver-rides/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const { response, error } = await apiHelper("GET", endpoint, {}, null);

      if (response?.data?.status === 1) {
        setRides(response.data.data.rides || []);
        const pagination = response.data.data.pagination;
        if (pagination) {
          setTotalPages(pagination.pages || 1);
        }
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch driver rides."
        );
        setRides([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch driver rides error:", err);
      toast.error("Something went wrong. Please try again.");
      setRides([]);
      setTotalPages(1);
    } finally {
      setRidesLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
    fetchDriverEarning();
  }, [id]);

  useEffect(() => {
    if (driver && currentPage !== 1) {
      ridesFetchedRef.current = false;
      fetchDriverRides(currentPage, ridesSearchTerm);
    }
  }, [driver, currentPage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (driver) {
        ridesFetchedRef.current = false;
        fetchDriverRides(1, ridesSearchTerm);
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [ridesSearchTerm, driver]);

  const getRideStatusBadge = (status) => {
    const customClasses = {
      accepted: "medium",
      pending: "pending",
      cancelled: "high",
    };

    // Default to CoreUI colors if not in custom classes
    const defaultColors = {
      completed: "success",
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
        toast.error(error || "Failed to toggle driver status.");
        return;
      }
      if (response?.data?.status === 1 && response?.data?.data) {
        setDriver((prev) => ({
          ...prev,
          isBlocked: response.data.data.isBlocked,
        }));
        toast.success(
          response.data.message || "Driver status updated successfully."
        );
      } else {
        toast.error(
          response?.data?.message || "Failed to toggle driver status."
        );
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
          <p className="mt-2">Loading driver details...</p>
        </CCol>
      </CRow>
    );
  }

  if (!driver) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>
            Driver data not found. Please go back to the drivers list and try
            again.
          </p>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow className="driverDetailsPage">
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
          <h4 className="heading m-0">Driver Details</h4>
        </div>

        {/* <CButton color="primary">Edit Driver</CButton> */}
      </CCol>

      {/* Personal Info */}
      <CCol lg={8}>
        <CCard className="mb-3 driver-card">
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
                  src={driver.image || chat4}
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
                {driver.image && (
                  <button
                    onClick={() =>
                      handleDownload(
                        driver.image,
                        `driver-avatar-${driver.fullName}.jpg`
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
                <strong className="name">{driver.fullName || "N/A"}</strong>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {driver.email || "N/A"}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
              {driver.phoneNumber || "N/A"}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
              {new Date(driver.createdAt).toLocaleDateString()}
            </p>
            <p>
              <CIcon icon={cilLocationPin} className="me-2 text-muted" />
              {driver.location?.address || "N/A"}
            </p>
          </CCardBody>
        </CCard>

        {/* Professional Info */}
        <CCard className="mb-3 driver-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilBriefcase} />
            </span>
            <span>Driver Details</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Role:</strong> {driver.role}
            </p>
            <p>
              <strong>Bio:</strong> {driver.bio || "N/A"}
            </p>
            <p>
              <strong>Total Rides:</strong> {driver.totalRides || 0}
            </p>
            <p>
              <strong>Earning:</strong> ${driver.earning || 0}
            </p>
            <p>
              <strong>Points:</strong> {driver.points || 0}
            </p>
            <p>
              <strong>Driving License:</strong> {driver.drivingLicense || "N/A"}
            </p>
            <p>
              <strong>Driver Vendor:</strong> {driver.driverVendor || "N/A"}
            </p>
          </CCardBody>
        </CCard>
        {/* Stripe Account */}
        <CCard className="driver-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilNotes} />
            </span>
            <span>Stripe Account</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Stripe Account ID:</strong>
              {driver.stripeAccountId || "N/A"}
            </p>
            <p>
              <strong>Country Code:</strong> {driver.countryCode || "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {driver.language || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {driver.username || "N/A"}
            </p>
          </CCardBody>
        </CCard>
        <CCard className="mb-3 driver-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilCloudUpload} />
            </span>
            <span>Bank Details</span>
          </CCardHeader>
          <CCardBody>
            {driver.bankDetails?.length > 0 ? (
              driver.bankDetails.map((bank, idx) => (
                <div key={idx} className="mb-2">
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
                    <strong>Stripe Bank Account ID:</strong>
                    {bank.stripeBankAccountId}
                  </p>
                  <p>
                    <strong>Default:</strong> {bank.isDefault ? "Yes" : "No"}
                  </p>
                </div>
              ))
            ) : (
              <p>No bank details available</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={4}>
        <CCard className="driver-card mb-3 ">
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
              className={driver.isBlocked ? "medium" : "high"}
            >
              {loading ? (
                <CSpinner size="sm" />
              ) : driver.isBlocked ? (
                "Unblock"
              ) : (
                "Block"
              )}
            </CButton>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Active:</strong> {driver.isActive ? "Yes" : "No"}
            </p>
            <p>
              <strong>Verified:</strong> {driver.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Blocked:</strong> {driver.isBlocked ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>Deleted:</strong> {driver.isDeleted ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Notification:</strong>
              {driver.isNotification ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>2FA Enabled:</strong>{" "}
              {driver.is2FactorEnabled ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Ride:</strong> {driver.isRide ? "Yes" : "No"}
            </p>
            <p>
              <strong>Payment:</strong> {driver.isPayment ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>Location:</strong> {driver.isLocation ? "Yes" : "No"}
            </p> */}
            {/* <p>
              <strong>Completed:</strong> {driver.isCompleted ? "Yes" : "No"}
            </p>
            <p>
              <strong>Accepted:</strong> {driver.isAccepted ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Reported:</strong> {driver.isReported ? "Yes" : "No"}
            </p>
          </CCardBody>
        </CCard>
        <CCard className="driver-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilNotes} />
            </span>
            <span>Total Earning</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Total Earning:</strong> ${totalEarning}
            </p>
          </CCardBody>
        </CCard>
        <CCard className="driver-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilStar} />
            </span>
            <span>Charges</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Per Mile Charge:</strong> ${driver.charges?.perMile || 0}
            </p>
            <p>
              <strong>Per Minute Charge:</strong> $
              {driver.charges?.perMinute || 0}
            </p>
            <p>
              <strong>Service Charge:</strong> ${driver.charges?.service || 0}
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Driver Rides Table */}
      <CCol xs={12} className="mt-4">
        <CCard className="driver-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilCarAlt} />
            </span>
            <span>Driver Rides</span>
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
                      pages.push('...');
                    }

                    // Show pages around current page
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 3) {
                      pages.push('...');
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
                      disabled={page === '...'}
                      onClick={() => page !== '...' && setCurrentPage(page)}
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
export default DriverProfile;
