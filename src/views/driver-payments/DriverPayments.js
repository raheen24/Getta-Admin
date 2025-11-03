import React from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CInputGroup,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCheck, cilX } from "@coreui/icons";

const DriverPayments = () => {
  // Placeholder data
  const payments = [
    {
      _id: 1,
      driverName: "John Doe",
      amount: 150.00,
      status: "Pending",
      date: "2023-10-01",
      description: "Ride payment",
    },
    {
      _id: 2,
      driverName: "Jane Smith",
      amount: 200.50,
      status: "Approved",
      date: "2023-09-30",
      description: "Weekly earnings",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <CBadge className="medium">Pending</CBadge>;
      case "Approved":
        return <CBadge className="high">Approved</CBadge>;
      case "Rejected":
        return <CBadge color="danger">Rejected</CBadge>;
      default:
        return <CBadge>Unknown</CBadge>;
    }
  };

  return (
    <div className="driverPaymentsPage">
      <h4 className="heading mb-3">Driver Payment Approvals</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput placeholder="Search payments..." />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">Status: All</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>All</CDropdownItem>
            <CDropdownItem>Pending</CDropdownItem>
            <CDropdownItem>Approved</CDropdownItem>
            <CDropdownItem>Rejected</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {payments.map((payment) => (
            <CTableRow key={payment._id}>
              <CTableDataCell>{payment.driverName}</CTableDataCell>
              <CTableDataCell>${payment.amount.toFixed(2)}</CTableDataCell>
              <CTableDataCell>{getStatusBadge(payment.status)}</CTableDataCell>
              <CTableDataCell>{payment.date}</CTableDataCell>
              <CTableDataCell>{payment.description}</CTableDataCell>
              <CTableDataCell>
                {payment.status === "Pending" && (
                  <>
                    <CButton size="sm" className="medium me-2">
                      <CIcon icon={cilCheck} />
                    </CButton>
                    <CButton size="sm" className="high">
                      <CIcon icon={cilX} />
                    </CButton>
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default DriverPayments;