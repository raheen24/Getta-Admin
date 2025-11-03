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
import { cilSearch, cilChatBubble } from "@coreui/icons";

const SupportChats = () => {
  // Placeholder data
  const chats = [
    {
      _id: 1,
      userName: "John Doe",
      driverName: "Jane Smith",
      type: "Support",
      status: "Open",
      lastMessage: "Need help with booking",
      timestamp: "2023-10-01 10:00",
    },
    {
      _id: 2,
      userName: "Alice Johnson",
      driverName: "Bob Wilson",
      type: "Dispute",
      status: "Resolved",
      lastMessage: "Issue with payment",
      timestamp: "2023-09-30 15:30",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return <CBadge className="medium">Open</CBadge>;
      case "Resolved":
        return <CBadge className="high">Resolved</CBadge>;
      default:
        return <CBadge>Unknown</CBadge>;
    }
  };

  return (
    <div className="supportChatsPage">
      <h4 className="heading mb-3">Support & Dispute Chats</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput placeholder="Search chats..." />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">Type: All</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>All</CDropdownItem>
            <CDropdownItem>Support</CDropdownItem>
            <CDropdownItem>Dispute</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <CDropdown>
          <CDropdownToggle className="dropdown">Status: All</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>All</CDropdownItem>
            <CDropdownItem>Open</CDropdownItem>
            <CDropdownItem>Resolved</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Last Message</CTableHeaderCell>
            <CTableHeaderCell>Timestamp</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {chats.map((chat) => (
            <CTableRow key={chat._id}>
              <CTableDataCell>{chat.userName}</CTableDataCell>
              <CTableDataCell>{chat.driverName}</CTableDataCell>
              <CTableDataCell>{chat.type}</CTableDataCell>
              <CTableDataCell>{getStatusBadge(chat.status)}</CTableDataCell>
              <CTableDataCell>{chat.lastMessage}</CTableDataCell>
              <CTableDataCell>{chat.timestamp}</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" className="medium">
                  <CIcon icon={cilChatBubble} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SupportChats;