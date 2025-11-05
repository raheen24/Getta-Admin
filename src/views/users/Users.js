import React, { useEffect, useState } from "react";
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CBadge,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilPencil, cilTrash } from "@coreui/icons";
import { apiHelper } from "../../services";
import { toast } from "react-toastify";
import chat4 from "src/assets/images/chat4.png";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async (
    page = 1,
    search = "",
    status = "",
    isInitial = false
  ) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setTableLoading(true);
    }

    try {
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append('q', search);
      }

      const endpoint = `admin/get-customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const { response, error } = await apiHelper(
        "GET",
        endpoint,
        {},
        null
      );

      if (response?.data?.status === 1) {
        let usersData = response.data.data.users || [];

        // Filter by status if provided
        if (status) {
          const isActive = status === "Active";
          usersData = usersData.filter(user => user.isActive === isActive);
        }
        const mappedUsers = usersData.map(user => ({
          _id: user._id,
          firstName: user.fullName?.split(' ')[0] || '',
          lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
          emailAddress: user.email,
          phoneNumber: user.phoneNumber,
          isActive: user.isActive,
          profilePicture: user.image,
          fullName: user.fullName,
          role: user.role,
          totalRides: user.totalRides,
          earning: user.earning,
          points: user.points,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));

        setUsers(mappedUsers);
        setTotalPages(Math.ceil(mappedUsers.length / 10));
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch users.");
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Something went wrong. Please try again.");
      setUsers([]);
      setTotalPages(1);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setTableLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers(1, "", "", true);
  }, []);

  useEffect(() => {
    if (currentPage !== 1 || searchTerm || statusFilter) {
      const delayDebounce = setTimeout(() => {
        fetchUsers(currentPage, searchTerm, statusFilter);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <CBadge className="medium">Active</CBadge>;
    } else {
      return <CBadge className="high">Inactive</CBadge>;
    }
  };

  const handleRowClick = (user) => {
    navigate(`/users/${user._id}`, { state: { user } });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = () => {
    setShowEditModal(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedUser?._id) return;

    try {
      setDeleteLoading(true);
      setTimeout(() => {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
        toast.success("User deleted successfully.");
        setShowDeleteModal(false);
        setSelectedUser(null);
        setDeleteLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong. Please try again.");
      setDeleteLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="reportsPage">
        <h4 className="heading mb-3">Users Management</h4>
        <div className="text-center">
          <CSpinner />
        </div>
      </div>
    );
  }
  return (
    <div className="usersPage">
      <h4 className="heading mb-3">Users Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search users..."
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
            <CDropdownItem onClick={() => setStatusFilter("Active")}>
              Active
            </CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter("Inactive")}>
              Inactive
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      {/* <CCol md={3} className="text-end">
            <CButton className="cta cta2 mb-3" color="cta">
              <CIcon icon={cilPlus} className="me-2" /> Add User
            </CButton>
          </CCol> */}

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell className="d-none d-md-table-cell">
              Contact Number
            </CTableHeaderCell>
            <CTableHeaderCell className="d-none d-lg-table-cell">
              Total Rides
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tableLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : users.length > 0 ? (
            users.map((user) => (
              <CTableRow
                key={user._id}
                onClick={() => handleRowClick(user)}
                style={{ cursor: "pointer" }}
              >
                <CTableDataCell className="d-flex align-items-center">
                  <img
                    src={user.image || chat4}
                    alt="User Avatar"
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
                  <span style={{ wordBreak: "break-word" }}>
                    {user?.fullName || "N/A"}
                  </span>
                </CTableDataCell>

                <CTableDataCell>{user.emailAddress}</CTableDataCell>
                <CTableDataCell className="d-none d-md-table-cell">
                  {user.phoneNumber || "N/A"}
                </CTableDataCell>
                <CTableDataCell className="d-none d-lg-table-cell">
                  {user.totalRides || 0}
                </CTableDataCell>
                <CTableDataCell>{getStatusBadge(user.isActive)}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    className="medium me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(user);
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    className="high"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user);
                    }}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                No users found
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

      {/* Edit Modal */}
      {/* <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>Edit form yahan aayega...</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleEditSubmit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal> */}

      {/* Delete Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete {selectedUser?.firstName}{" "}
          {selectedUser?.lastName}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="cta"
            className="cta cta2"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CSpinner size="sm" /> : "Delete"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Users;
