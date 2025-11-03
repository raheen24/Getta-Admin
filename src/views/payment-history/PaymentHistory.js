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
import { cilSearch, cilFindInPage  } from "@coreui/icons";

const PaymentHistory = () => {
  // Placeholder data
  const history = [
    {
      _id: 1,
      driverName: "John Doe",
      amount: 150.00,
      status: "Completed",
      date: "2023-10-01",
      transactionId: "TXN123456",
    },
    {
      _id: 2,
      driverName: "Jane Smith",
      amount: 200.50,
      status: "Completed",
      date: "2023-09-30",
      transactionId: "TXN123457",
    },
    {
      _id: 3,
      driverName: "Bob Wilson",
      amount: 175.25,
      status: "Failed",
      date: "2023-09-29",
      transactionId: "TXN123458",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "Failed":
        return <CBadge className="high">Failed</CBadge>;
      case "Pending":
        return <CBadge className="pending">Pending</CBadge>;
      default:
        return <CBadge>Unknown</CBadge>;
    }
  };

  return (
    <div className="paymentHistoryPage">
      <h4 className="heading mb-3">Driver Payment History</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput placeholder="Search history..." />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">Status: All</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>All</CDropdownItem>
            <CDropdownItem>Completed</CDropdownItem>
            <CDropdownItem>Failed</CDropdownItem>
            <CDropdownItem>Pending</CDropdownItem>
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
            <CTableHeaderCell>Transaction ID</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {history.map((item) => (
            <CTableRow key={item._id}>
              <CTableDataCell>{item.driverName}</CTableDataCell>
              <CTableDataCell>${item.amount.toFixed(2)}</CTableDataCell>
              <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
              <CTableDataCell>{item.date}</CTableDataCell>
              <CTableDataCell>{item.transactionId}</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" className="medium">
                  <CIcon icon={cilFindInPage} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default PaymentHistory;