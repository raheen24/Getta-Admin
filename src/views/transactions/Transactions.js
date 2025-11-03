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
  CButton,
  CBadge,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dummy data for transactions
  const dummyTransactions = [
    {
      id: 1,
      transactionId: "TXN001",
      user: "John Doe",
      amount: 25.50,
      type: "Ride Payment",
      status: "Completed",
      date: "2023-10-01",
    },
    {
      id: 2,
      transactionId: "TXN002",
      user: "Jane Smith",
      amount: 15.75,
      type: "Ride Payment",
      status: "Pending",
      date: "2023-10-02",
    },
    {
      id: 3,
      transactionId: "TXN003",
      user: "Mike Johnson",
      amount: 30.00,
      type: "Driver Payout",
      status: "Completed",
      date: "2023-10-03",
    },
    {
      id: 4,
      transactionId: "TXN004",
      user: "Sarah Wilson",
      amount: 20.25,
      type: "Ride Payment",
      status: "Failed",
      date: "2023-10-04",
    },
    {
      id: 5,
      transactionId: "TXN005",
      user: "Tom Brown",
      amount: 18.90,
      type: "Ride Payment",
      status: "Completed",
      date: "2023-10-05",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "Pending":
        return <CBadge className="pending">Pending</CBadge>;
      case "Failed":
        return <CBadge className="high">Failed</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  const filteredTransactions = dummyTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / 10);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="transactionsPage">
      <h4 className="heading mb-3">Transactions Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search transactions..."
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
            <CDropdownItem onClick={() => setStatusFilter("Completed")}>
              Completed
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Pending")}>
              Pending
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Failed")}>
              Failed
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Transaction ID</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <CTableRow key={transaction.id}>
                <CTableDataCell>{transaction.transactionId}</CTableDataCell>
                <CTableDataCell>{transaction.user}</CTableDataCell>
                <CTableDataCell>${transaction.amount.toFixed(2)}</CTableDataCell>
                <CTableDataCell>{transaction.type}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(transaction.status)}</CTableDataCell>
                <CTableDataCell>{transaction.date}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                No transactions found
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

export default Transactions;