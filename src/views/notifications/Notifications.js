import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CSpinner,
  CAlert,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash } from "@coreui/icons";
import { apiHelper } from "../../services";
import { toast } from "react-toastify";

const Notifications = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [createFormData, setCreateFormData] = useState({
    title: "",
    body: "",
    userIds: [],
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { error: apiError, response } = await apiHelper(
        "GET",
        "admin/notifications?page=1&limit=10"
      );
      if (apiError) {
        toast.error(apiError);
      } else {
        setNotifications(response.data.data.results);
        setPagination({
          totalRecords: response.data.data.totalRecords,
          totalPages: response.data.data.totalPages,
          currentPage: response.data.data.currentPage,
          pageSize: response.data.data.pageSize,
        });
      }
    } catch (err) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter((user) =>
    `${user.firstName || ""} ${user.lastName || ""}`
      .toLowerCase()
      .includes(userSearchTerm.toLowerCase())
  );

  // Agar search term khali hai to sirf top 10 show karo
  const displayedUsers =
    userSearchTerm.trim() === "" ? filteredUsers.slice(0, 10) : filteredUsers;

  const fetchUsers = async () => {
    try {
      const { error, response } = await apiHelper(
        "GET",
        "admin/users?page=1&limit=1000"
      );
      if (error) {
        toast.error(error);
      } else {
        setUsers(response.data.data.results || []);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleCreateNotification = async () => {
    const requestBody = {
      title: createFormData.title,
      body: createFormData.body,
      userIds: createFormData.userIds,
    };
    setCreateLoading(true);
    try {
      const { error: apiError, response } = await apiHelper(
        "POST",
        "admin/notifications/send",
        {},
        requestBody
      );

      if (apiError) {
        toast.error(apiError);
      } else {
        await fetchNotifications();
        setShowCreateModal(false);
        setCreateFormData({
          title: "",
          body: "",
          userIds: [],
        });
      }
    } catch (err) {
      toast.error("Failed to create notification");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    setShowEditModal(false);
  };

  const handleDelete = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNotification?._id) return;

    try {
      const { error: apiError } = await apiHelper(
        "DELETE",
        `admin/notifications/${selectedNotification._id}`
      );

      if (apiError) {
        toast.error(apiError);
      } else {
        await fetchNotifications();
        setShowDeleteModal(false);
        setSelectedNotification(null);
      }
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // const filteredUsers = users.filter((user) =>
  //   `${user.firstName || ""} ${user.lastName || ""}`
  //     .toLowerCase()
  //     .includes(userSearchTerm.toLowerCase())
  // );

  const toggleUserSelection = (userId) => {
    setCreateFormData((prev) => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId],
    }));
  };

  return (
    <CRow className="notificationsPage">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="heading">Notifications</h4>
        <CButton
          color="cta"
          className="cta cta2"
          onClick={() => setShowCreateModal(true)}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Create Notification
        </CButton>
      </div>

      {/* Table */}

      <CCol xs={12}>
        {loading ? (
          <div className="text-center">
            <CSpinner />
          </div>
        ) : (
          <CTable hover responsive className="customTables">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Reciever</CTableHeaderCell>
                <CTableHeaderCell>Message Type</CTableHeaderCell>
                <CTableHeaderCell>Message</CTableHeaderCell>
                {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {notifications.map((notification) => (
                <CTableRow key={notification._id}>
                  <CTableDataCell>
                    {notification.receiverId?.firstName}{" "}
                    {notification.receiverId?.lastName}
                  </CTableDataCell>
                  <CTableDataCell>{notification.type}</CTableDataCell>

                  <CTableDataCell>{notification.message}</CTableDataCell>
                  {/* <CTableDataCell>{notification.isRead ? 'Read' : 'Unread'}</CTableDataCell> */}
                  <CTableDataCell>
                    {formatDate(notification.createdAt)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {/* <CButton
                      size="sm"
                      className="medium me-2"
                      onClick={() => handleEdit(notification)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton> */}
                    <CButton
                      size="sm"
                      className="high"
                      onClick={() => handleDelete(notification)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCol>

      {/* Create Notification Modal */}
      {/* Create Notification Modal */}
      <CModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Create Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="notificationTitle">Title</CFormLabel>
              <CFormInput
                type="text"
                id="notificationTitle"
                placeholder="Enter notification title"
                value={createFormData.title}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="notificationMessage">Message</CFormLabel>
              <CFormTextarea
                id="notificationMessage"
                rows={3}
                placeholder="Enter notification message"
                value={createFormData.body}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, body: e.target.value })
                }
              />
            </div>

            <div className="userDropdown mb-3 ">
              <CFormLabel>Select Users(Optional)</CFormLabel>
              <CDropdown
                visible={dropdownVisible}
                onVisibleChange={(val) => setDropdownVisible(val)}
              >
                <CDropdownToggle className="w-100 text-start">
                  {createFormData.userIds.length > 0
                    ? `${createFormData.userIds.length} user selected`
                    : "Select users"}
                </CDropdownToggle>

                <CDropdownMenu
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    width: "100%",
                  }}
                  onClick={(e) => e.stopPropagation()} // ✅ Ye add karo
                >
                  <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    <CFormInput
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  </div>

                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => (
                      <CDropdownItem
                        key={user._id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleUserSelection(user._id);
                          setDropdownVisible(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <CFormCheck
                          checked={createFormData.userIds.includes(user._id)}
                          readOnly
                          className="me-2"
                        />
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || user.lastName || "N/A"}
                      </CDropdownItem>
                    ))
                  ) : (
                    <CDropdownItem disabled>No users found</CDropdownItem>
                  )}
                </CDropdownMenu>
              </CDropdown>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="cta"
            className="cta cta2"
            onClick={handleCreateNotification}
            disabled={createLoading}
          >
            {createLoading ? <CSpinner size="sm" /> : "Create"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Notification Modal */}
      {/* <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="editTitle">Title</CFormLabel>
              <CFormInput
                type="text"
                id="editTitle"
                defaultValue={selectedNotification?.metadata?.title}
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="editMessage">Message</CFormLabel>
              <CFormTextarea
                id="editMessage"
                rows={3}
                defaultValue={selectedNotification?.message}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="cta" className="cta cta2" onClick={handleEditSubmit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal> */}

      {/* Delete Notification Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Delete Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this notification?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="cta"
            className="cta cta2"
            onClick={handleDeleteConfirm}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Notifications;
