import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
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
  cilCloudUpload,
  cilNotes,
  cilStar,
} from "@coreui/icons";
import chat4 from "src/assets/images/chat4.png";
import { apiHelper } from "src/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const VendorProfile = () => {
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
  const [vendor, setVendor] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [totalEarning, setTotalEarning] = useState(0);

  const fetchVendorDetails = async () => {
    if (!id) return;

    try {
      setFetchLoading(true);
      const { response, error } = await apiHelper(
        "GET",
        `admin/get-business-by-id/${id}`,
        {},
        null
      );

      if (response?.data?.status === 1) {
        setVendor(response.data.data);
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch vendor details."
        );
        navigate(-1);
      }
    } catch (err) {
      console.error("Fetch vendor details error:", err);
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchVendorEarning = async () => {
    if (!id) return;

    try {
      const { response, error } = await apiHelper(
        "GET",
        `admin/vendor-earning/${id}`,
        {},
        null
      );

      if (response?.data?.status === 1) {
        setTotalEarning(response.data.data.totalEarning || 0);
      } else {
        console.error(
          "Failed to fetch vendor earning:",
          response?.data?.message || error
        );
        setTotalEarning(0);
      }
    } catch (err) {
      console.error("Fetch vendor earning error:", err);
      setTotalEarning(0);
    }
  };

  

  useEffect(() => {
    fetchVendorDetails();
    fetchVendorEarning();
  }, [id]);

  
  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const { response, error } = await apiHelper("PATCH", `admin/toggle-user/${id}`);

      if (error) {
        toast.error(error || "Failed to toggle vendor status.");
        return;
      }
      if (response?.data?.status === 1 && response?.data?.data) {
        setVendor(prev => ({ ...prev, isBlocked: response.data.data.isBlocked }));
        toast.success(response.data.message || "Vendor status updated successfully.");
      } else {
        toast.error(response?.data?.message || "Failed to toggle vendor status.");
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
          <p className="mt-2">Loading vendor details...</p>
        </CCol>
      </CRow>
    );
  }

  if (!vendor) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>
            Vendor data not found. Please go back to the vendors list and try
            again.
          </p>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow className="vendorDetailsPage">
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
          <h4 className="heading m-0">Vendor Details</h4>
        </div>

        {/* <CButton color="primary">Edit Vendor</CButton> */}
      </CCol>

      {/* Personal Info */}
      <CCol lg={8}>
        <CCard className="mb-3 vendor-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilUser} />
            </span>
            <span>Business Information</span>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={chat4}
                  alt="Vendor Avatar"
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
                <strong className="name">{vendor.businessName || "N/A"}</strong>
              </div>
            </div>
            <p>
              <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted" />
              {vendor.email || "N/A"}
            </p>
            <p>
              <CIcon icon={cilPhone} className="me-2 text-muted" />{" "}
              {vendor.phoneNumber || "N/A"}
            </p>
            <p>
              <CIcon icon={cilCalendar} className="me-2 text-muted" /> Joined:
              {new Date(vendor.createdAt).toLocaleDateString()}
            </p>
            <p>
              <CIcon icon={cilLocationPin} className="me-2 text-muted" />
              {vendor.location?.address || "N/A"}
            </p>
          </CCardBody>
        </CCard>

        {/* Professional Info */}
        <CCard className="mb-3 vendor-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilBriefcase} />
            </span>
            <span>Vendor Details</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Role:</strong> {vendor.role}
            </p>
            <p>
              <strong>Bio:</strong> {vendor.bio || "N/A"}
            </p>
            <p>
              <strong>Total Rides:</strong> {vendor.totalRides || 0}
            </p>
            <p>
              <strong>Earning:</strong> ${vendor.earning || 0}
            </p>
            <p>
              <strong>Points:</strong> {vendor.points || 0}
            </p>
            <p>
              <strong>Business License:</strong>{" "}
              {vendor.businessLicense || "N/A"}
            </p>
            <p>
              <strong>Tax Identification Number:</strong>{" "}
              {vendor.taxIdentificationNumber || "N/A"}
            </p>
          </CCardBody>
        </CCard>
        <CCard className="mb-3 vendor-card">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilCloudUpload} />
            </span>
            <span>Bank Details</span>
          </CCardHeader>
          <CCardBody>
            {vendor.bankDetails?.length > 0 ? (
              vendor.bankDetails.map((bank, idx) => (
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
                    <strong>Stripe Bank Account ID:</strong>{" "}
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
        {/* Stripe Account */}
        <CCard className="vendor-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilNotes} />
            </span>
            <span>Stripe Account</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Stripe Account ID:</strong>{" "}
              {vendor.stripeAccountId || "N/A"}
            </p>
            <p>
              <strong>Stripe Customer ID:</strong>{" "}
              {vendor.stripeCustomerId || "N/A"}
            </p>
            <p>
              <strong>Country Code:</strong> {vendor.countryCode || "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {vendor.language || "N/A"}
            </p>
           
            <p>
              <strong>Username:</strong> {vendor.username || "N/A"}
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={4}>
        <CCard className="vendor-card mb-3 ">
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
              className={vendor.isBlocked ? "medium" : "high"}
            >
              {loading ? (
                <CSpinner size="sm" />
              ) : vendor.isBlocked ? (
                "Unblock"
              ) : (
                "Block"
              )}
            </CButton>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Active:</strong> {vendor.isActive ? "Yes" : "No"}
            </p>
            <p>
              <strong>Verified:</strong> {vendor.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Blocked:</strong> {vendor.isBlocked ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>Deleted:</strong> {vendor.isDeleted ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Notification:</strong>{" "}
              {vendor.isNotification ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>2FA Enabled:</strong>{" "}
              {vendor.is2FactorEnabled ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Ride:</strong> {vendor.isRide ? "Yes" : "No"}
            </p>
            <p>
              <strong>Payment:</strong> {vendor.isPayment ? "Yes" : "No"}
            </p>
            {/* <p>
              <strong>Location:</strong> {vendor.isLocation ? "Yes" : "No"}
            </p>
            <p>
              <strong>Completed:</strong> {vendor.isCompleted ? "Yes" : "No"}
            </p>
            <p>
              <strong>Accepted:</strong> {vendor.isAccepted ? "Yes" : "No"}
            </p> */}
            <p>
              <strong>Reported:</strong> {vendor.isReported ? "Yes" : "No"}
            </p>
          </CCardBody>
        </CCard>
        <CCard className="vendor-card mb-3">
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
        <CCard className="vendor-card mb-3">
          <CCardHeader className="section-header">
            <span className="icon-badge">
              <CIcon icon={cilStar} />
            </span>
            <span>Charges</span>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Per Mile Charge:</strong> ${vendor.charges?.perMile || 0}
            </p>
            <p>
              <strong>Per Minute Charge:</strong> $
              {vendor.charges?.perMinute || 0}
            </p>
            <p>
              <strong>Service Charge:</strong> ${vendor.charges?.service || 0}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default VendorProfile;
