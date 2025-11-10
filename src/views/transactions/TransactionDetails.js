import React from "react";
import { useLocation } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CRow,
  CBadge,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMoney, cilUser, cilTruck , cilArrowLeft } from "@coreui/icons";
const TransactionDetails = () => {
  const location = useLocation();
  const { payment, vendor, driver } = location.state || {};

  if (!payment) {
    return (
      <div className="transactionDetailsPage">
        <h4 className="heading mb-3">Transaction Details</h4>
        <p>No transaction data available.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "pending":
        return <CBadge className="pending">Pending</CBadge>;
      case "failed":
        return <CBadge className="high">Failed</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  return (
    <div className="transactionDetailsPage">
      <div className="d-flex align-items-center gap-2 mb-3">
        <CButton
          color="link"
          onClick={() => navigate(-1)}
          className="backbtn p-0"
        >
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        <h4 className="heading">Transaction Details</h4>
      </div>
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilMoney} />
              </span>
              <span>Payment Details</span>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Transaction ID:</strong> {payment._id}
              </p>
              <p>
                <strong>Ride ID:</strong> {payment.rideId}
              </p>
              <p>
                <strong>Amount:</strong> ${payment.amount?.toFixed(2)}
              </p>
              <p>
                <strong>Ride Type:</strong> {payment.rideType}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(payment.status)}
              </p>
              <p>
                <strong>Is Vendor Paid:</strong>{" "}
                {payment.isVendorPaid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Is Driver Paid:</strong>{" "}
                {payment.isDriverPaid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {new Date(payment.paymentDate).toLocaleString()}
              </p>
              <p>
                <strong>Driver Paid Date:</strong>{" "}
                {payment.driverPaidDate
                  ? new Date(payment.driverPaidDate).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Stripe Charge ID:</strong> {payment.stripeChargeId}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(payment.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(payment.updatedAt).toLocaleString()}
              </p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilUser} />
              </span>
              <span>Vendor Information</span>
            </CCardHeader>

            <CCardBody>
              <p>
                <strong>Name:</strong> {vendor.businessName || vendor.fullName}
              </p>
              <p>
                <strong>Email:</strong> {vendor.email}
              </p>
              <p>
                <strong>Phone:</strong> {vendor.phoneNumber}
              </p>
              <p>
                <strong>Business License:</strong> {vendor.businessLicense}
              </p>
              <p>
                <strong>Tax ID:</strong> {vendor.taxIdentificationNumber}
              </p>
              <p>
                <strong>Stripe Account ID:</strong> {vendor.stripeAccountId}
              </p>
            </CCardBody>
          </CCard>
          <CCard>
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilTruck} />
              </span>
              <span>Driver Information</span>
            </CCardHeader>
            <CCardBody>
              <p>
                <strong>Name:</strong> {driver.fullName}
              </p>
              <p>
                <strong>Email:</strong> {driver.email}
              </p>
              <p>
                <strong>Phone:</strong> {driver.phoneNumber}
              </p>
              <p>
                <strong>Driving License:</strong> {driver.drivingLicense}
              </p>
              <p>
                <strong>Stripe Account ID:</strong> {driver.stripeAccountId}
              </p>
              <p>
                <strong>Bank Details:</strong>
              </p>
              <ul>
                {driver.bankDetails?.map((bank, index) => (
                  <li key={index}>
                    {bank.bankName} - {bank.accountHolderName} - ****
                    {bank.accountNumber?.slice(-4)}
                  </li>
                ))}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default TransactionDetails;
