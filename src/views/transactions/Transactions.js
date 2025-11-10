import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { apiHelper } from "../../services";
import { toast } from "react-toastify";

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (page = 1, search = "", status = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append('q', search);
      }
      if (page > 1) {
        queryParams.append('page', page);
      }

      const endpoint = `admin/get-income${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const { response, error } = await apiHelper(
        "GET",
        endpoint,
        {},
        null
      );

      if (response?.data?.status === 1) {
        const vendorsData = response.data.data.vendors || [];
        const allPayments = [];

        vendorsData.forEach(vendor => {
          vendor.payments.forEach(payment => {
            allPayments.push({
              ...payment,
              vendor: vendor.vendor,
              driver: payment.driver,
              vendorId: vendor._id,
              totalIncome: vendor.totalIncome,
            });
          });
        });

        // Filter by status if provided
        let filteredPayments = allPayments;
        if (status) {
          filteredPayments = allPayments.filter(payment => payment.status === status.toLowerCase());
        }

        setTransactions(filteredPayments);
        setTotalPages(Math.ceil(filteredPayments.length / 10));
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch transactions.");
        setTransactions([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
      toast.error("Something went wrong. Please try again.");
      setTransactions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "pending":
        return <CBadge className="pending">Pending</CBadge>;
      case "failed":
        return <CBadge className="high">Failed</CBadge>;
      case "cancelled":
        return <CBadge className="high">Cancelled</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  useEffect(() => {
    fetchTransactions(1, "", "");
  }, []);

  useEffect(() => {
    if (currentPage !== 1 || searchTerm || statusFilter) {
      const delayDebounce = setTimeout(() => {
        fetchTransactions(currentPage, searchTerm, statusFilter);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.driver.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || transaction.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="transactionsPage">
      <h4 className="heading mb-3">Transactions Management</h4>
      {/* <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
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
            <CDropdownItem onClick={() => setStatusFilter("Cancelled")}>
              Cancelled
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div> */}

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Transaction ID</CTableHeaderCell>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Ride Type</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
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
          ) : paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <CTableRow
                key={transaction._id}
                onClick={() => navigate(`/transactions/${transaction._id}`, {
                  state: {
                    payment: transaction,
                    vendor: transaction.vendor,
                    driver: transaction.driver
                  }
                })}
                style={{ cursor: "pointer" }}
              >
                <CTableDataCell>{transaction._id}</CTableDataCell>
                <CTableDataCell>{transaction.vendor.businessName || transaction.vendor.fullName}</CTableDataCell>
                <CTableDataCell>{transaction.driver.fullName}</CTableDataCell>
                <CTableDataCell>${transaction.amount?.toFixed(2)}</CTableDataCell>
                <CTableDataCell>{transaction.rideType}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(transaction.status)}</CTableDataCell>
                <CTableDataCell>{new Date(transaction.createdAt).toLocaleDateString()}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
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