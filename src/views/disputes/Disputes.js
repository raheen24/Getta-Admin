import React, { useState } from "react";
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
  CInputGroup,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
  CBadge,
  CSpinner,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const Disputes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dummy data for disputes
  const dummyDisputes = [
    {
      id: 1,
      disputeId: "DSP001",
      user: "John Doe",
      driver: "Mike Johnson",
      issue: "Late arrival",
      status: "Open",
      amount: 25.50,
      date: "2023-10-01",
    },
    {
      id: 2,
      disputeId: "DSP002",
      user: "Jane Smith",
      driver: "Sarah Wilson",
      issue: "Vehicle condition",
      status: "Resolved",
      amount: 15.75,
      date: "2023-10-02",
    },
    {
      id: 3,
      disputeId: "DSP003",
      user: "Tom Brown",
      driver: "Alex Davis",
      issue: "Wrong route",
      status: "Under Review",
      amount: 30.00,
      date: "2023-10-03",
    },
    {
      id: 4,
      disputeId: "DSP004",
      user: "Lisa Green",
      driver: "Chris Taylor",
      issue: "Billing error",
      status: "Closed",
      amount: 20.25,
      date: "2023-10-04",
    },
    {
      id: 5,
      disputeId: "DSP005",
      user: "David White",
      driver: "Emma Brown",
      issue: "Driver behavior",
      status: "Open",
      amount: 18.90,
      date: "2023-10-05",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return <CBadge className="pending">Open</CBadge>;
      case "Resolved":
        return <CBadge className="medium">Resolved</CBadge>;
      case "Under Review":
        return <CBadge className="low">Under Review</CBadge>;
      case "Closed":
        return <CBadge className="high">Closed</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  const filteredDisputes = dummyDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.disputeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDisputes.length / 10);
  const paginatedDisputes = filteredDisputes.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="disputesPage">
      <h4 className="heading mb-3">Disputes Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">
            Status: {statusFilter || "All"}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setStatusFilter("")}>
              All
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Open")}>
              Open
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Under Review")}>
              Under Review
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Resolved")}>
              Resolved
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Closed")}>
              Closed
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Dispute ID</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Issue</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : paginatedDisputes.length > 0 ? (
            paginatedDisputes.map((dispute) => (
              <CTableRow key={dispute.id}>
                <CTableDataCell>{dispute.disputeId}</CTableDataCell>
                <CTableDataCell>{dispute.user}</CTableDataCell>
                <CTableDataCell>{dispute.driver}</CTableDataCell>
                <CTableDataCell>{dispute.issue}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(dispute.status)}</CTableDataCell>
                <CTableDataCell>${dispute.amount.toFixed(2)}</CTableDataCell>
                <CTableDataCell>{dispute.date}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
                No disputes found
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <CPaginationItem
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default Disputes;