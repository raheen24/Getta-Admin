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
  CButton,
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
import { cilSearch, cilPencil, cilTrash } from "@coreui/icons";
import chat4 from "src/assets/images/chat4.png";
import { apiHelper } from "src/services";
import { toast } from "react-toastify";

const Drivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDrivers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append("q", search);
      }
      const endpoint = `admin/get-drivers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const { response, error } = await apiHelper("GET", endpoint, {}, null);

      if (response?.data?.status === 1) {
        let fetchedDrivers = response.data.data.drivers || [];
        // Filter by status client-side
        if (statusFilter !== "All") {
          const isActive = statusFilter === "Active";
          fetchedDrivers = fetchedDrivers.filter(driver => driver.isActive === isActive);
        }
        setDrivers(fetchedDrivers);
        const pagination = response.data.data.pagination;
        if (pagination) {
          setTotalPages(pagination.pages || 1);
        }
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch drivers.");
        setDrivers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch drivers error:", err);
      toast.error("Something went wrong. Please try again.");
      setDrivers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(currentPage, searchTerm);
  }, [currentPage, statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDrivers(1, searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <CBadge className="medium">Active</CBadge>;
    } else {
      return <CBadge className="high">Inactive</CBadge>;
    }
  };

  return (
    <div className="driversPage">
      <h4 className="heading mb-3">Drivers Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">Status: {statusFilter}</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setStatusFilter("All")}>All</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Active")}>Active</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Inactive")}>Inactive</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell className="d-none d-md-table-cell">
              Contact Number
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : drivers.length > 0 ? (
            drivers.map((driver) => (
              <CTableRow
                key={driver._id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/drivers/${driver._id}`)}
              >
                <CTableDataCell className="d-flex align-items-center">
                  {driver.image && (driver.image.includes('.mp4') || driver.image.includes('.webm') || driver.image.includes('.avi') || driver.image.includes('.mov')) ? (
                    <video
                      src={driver.image}
                      alt="Driver Video"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        flexShrink: 0,
                      }}
                      controls
                      muted
                    />
                  ) : (
                    <img
                      src={driver.image || chat4}
                      alt="Driver Avatar"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = chat4;
                      }}
                    />
                  )}
                  <span style={{ wordBreak: "break-word" }}>
                    {driver?.fullName || "N/A"}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{driver.email}</CTableDataCell>
                <CTableDataCell className="d-none d-md-table-cell">
                  {driver.phoneNumber || "N/A"}
                </CTableDataCell>
                <CTableDataCell>{getStatusBadge(driver.isActive)}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" className="medium me-2">
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton className="high" size="sm">
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center">
                No drivers found
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

export default Drivers;