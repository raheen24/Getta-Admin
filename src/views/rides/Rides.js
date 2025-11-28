import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { apiHelper } from "../../services";
import { cilSearch, cilPencil, cilTrash } from "@coreui/icons";

const Rides = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchRides = async (page = 1, search = "", status = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const { error, response } = await apiHelper(
        "GET",
        `admin/get-rides?${params.toString()}`
      );
      if (error) {
        console.error("Error fetching rides:", error);
        return;
      }

      const data = response.data;
      if (data.status === 1) {
        setRides(data.data.rides);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <CBadge className="medium">Completed</CBadge>;
      case "dispute":
        return <CBadge className="high">Dispute</CBadge>;
      case "cancelled":
        return <CBadge className="high">Cancelled</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="ridesPage">
      <h4 className="heading mb-3">Rides Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search rides..."
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
            <CDropdownItem onClick={() => setStatusFilter("completed")}>
              Completed
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("dispute")}>
              Dispute
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("cancelled")}>
              Cancelled
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Ride ID</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Pickup</CTableHeaderCell>
            <CTableHeaderCell>Dropoff</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Fare</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={9} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : rides.length > 0 ? (
            rides.map((ride) => (
              <CTableRow key={ride._id}>
                <CTableDataCell>{ride._id.slice(-8)}</CTableDataCell>
                <CTableDataCell>
                  {ride.userId?.fullName || "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {ride.driverId?.fullName || "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {ride.pickUpLocation?.address || "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {ride.dropOffLocation?.address || "N/A"}
                </CTableDataCell>
                <CTableDataCell>{getStatusBadge(ride.status)}</CTableDataCell>
                <CTableDataCell>
                  ${ride.fare?.toFixed(2) || "0.00"}
                </CTableDataCell>
                <CTableDataCell>{formatDate(ride.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    className="cta medium"
                    size="sm"
                    onClick={() =>
                      navigate(`/rides/${ride._id}`, { state: { ride } })
                    }
                    title="View Details"
                  >
                    View Details
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={9} className="text-center">
                No rides found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {pagination.pages > 1 && (
        <CPagination align="center" className="mt-3">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </CPaginationItem>
          {(() => {
            const totalPages = pagination.pages;
            const current = currentPage;
            const pages = [];

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              
              pages.push(1);

              if (current > 4) {
                pages.push("...");
              }
              const start = Math.max(2, current - 1);
              const end = Math.min(totalPages - 1, current + 1);

              for (let i = start; i <= end; i++) {
                pages.push(i);
              }

              if (current < totalPages - 3) {
                pages.push("...");
              }
              if (totalPages > 1) {
                pages.push(totalPages);
              }
            }

            return pages.map((page, index) => (
              <CPaginationItem
                key={index}
                active={page === current}
                disabled={page === "..."}
                onClick={() => page !== "..." && setCurrentPage(page)}
              >
                {page}
              </CPaginationItem>
            ));
          })()}
          <CPaginationItem
            disabled={currentPage === pagination.pages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default Rides;
