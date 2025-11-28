import React, { useState, useEffect } from "react";
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
  CBadge,
  CSpinner,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilChatBubble } from "@coreui/icons";
import { getDisputes } from "../../services";
import { toast } from "react-toastify";

const Disputes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });


  const fetchDisputes = async (page = 1, search = "", status = "") => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;

      const { response, error } = await getDisputes(params);

      if (response?.data?.status === 1) {
        setDisputes(response.data.data.disputes || []);
        setPagination(response.data.data.pagination || { total: 0, page: 1, limit: 10, pages: 1 });
        setCurrentPage(page);
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch disputes.");
        setDisputes([]);
        setPagination({ total: 0, page: 1, limit: 10, pages: 1 });
      }
    } catch (err) {
      console.error("Fetch disputes error:", err);
      toast.error("Something went wrong. Please try again.");
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes(1, "", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDisputes(1, searchTerm, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "unsolved":
        return <CBadge className="pending">Unsolved</CBadge>;
      case "resolved":
        return <CBadge className="medium">Resolved</CBadge>;
      case "under review":
        return <CBadge className="low">Under Review</CBadge>;
      case "closed":
        return <CBadge className="high">Closed</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "unsolved":
        return "Unsolved";
      case "resolved":
        return "Resolved";
      case "under review":
        return "Under Review";
      case "closed":
        return "Closed";
      default:
        return "All";
    }
  };


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
            Status: {getStatusDisplay(statusFilter) || "All"}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setStatusFilter("")}>
              All
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("unsolved")}>
              Unsolved
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("resolved")}>
              Resolved
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("under review")}>
              Under Review
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("closed")}>
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
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : disputes.length > 0 ? (
            disputes.map((dispute) => (
              <CTableRow key={dispute._id}>
                <CTableDataCell>{dispute._id}</CTableDataCell>
                <CTableDataCell>{dispute.userId?.fullName || "N/A"}</CTableDataCell>
                <CTableDataCell>{dispute.driverId?.fullName || "N/A"}</CTableDataCell>
                <CTableDataCell>{dispute.reason}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(dispute.status)}</CTableDataCell>
                <CTableDataCell>{new Date(dispute.createdAt).toLocaleDateString()}</CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex gap-2">
                    <CButton
                      className="cta medium"
                      onClick={() => navigate(`/disputes/${dispute._id}`)}
                    >
                      View Details
                    </CButton>
                    <CButton
                      size="sm"
                      className="cta low"
                      onClick={() => navigate(`/disputes/chat/${dispute.driverId?._id}`)}
                    >
                      <CIcon icon={cilChatBubble} />
                      Chat
                    </CButton>
                  </div>
                </CTableDataCell>
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

      {pagination.pages > 1 && (
        <CPagination align="center" className="mt-3">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => fetchDisputes(currentPage - 1, searchTerm, statusFilter)}
          >
            Previous
          </CPaginationItem>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <CPaginationItem
              key={page}
              active={page === currentPage}
              onClick={() => fetchDisputes(page, searchTerm, statusFilter)}
            >
              {page}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === pagination.pages}
            onClick={() => fetchDisputes(currentPage + 1, searchTerm, statusFilter)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default Disputes;