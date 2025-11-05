import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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

const Vendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVendors = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append("q", search);
      }
      const endpoint = `admin/get-businesses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const { response, error } = await apiHelper("GET", endpoint, {}, null);

      if (response?.data?.status === 1) {
        let fetchedVendors = response.data.data.businesses || [];
        if (statusFilter !== "All") {
          const isActive = statusFilter === "Active";
          fetchedVendors = fetchedVendors.filter(vendor => vendor.isActive === isActive);
        }
        setVendors(fetchedVendors);
        const pagination = response.data.data.pagination;
        if (pagination) {
          setTotalPages(pagination.pages || 1);
        }
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch vendors.");
        setVendors([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch vendors error:", err);
      toast.error("Something went wrong. Please try again.");
      setVendors([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, searchTerm);
  }, [currentPage, statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVendors(1, searchTerm);
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
    <div className="vendorsPage">
      <h4 className="heading mb-3">Vendors Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search vendors..."
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
          ) : vendors.length > 0 ? (
            vendors.map((vendor) => (
              <CTableRow
                key={vendor._id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/vendors/${vendor._id}`)}
              >
                <CTableDataCell className="d-flex align-items-center">
                  <img
                    src={chat4}
                    alt="Vendor Avatar"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                      border: "1px solid #ddd",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ wordBreak: "break-word" }}>
                    {vendor?.businessName || "N/A"}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{vendor.email}</CTableDataCell>
                <CTableDataCell className="d-none d-md-table-cell">
                  {vendor.phoneNumber || "N/A"}
                </CTableDataCell>
                <CTableDataCell>{getStatusBadge(vendor.isActive)}</CTableDataCell>
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
                No vendors found
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

export default Vendors;