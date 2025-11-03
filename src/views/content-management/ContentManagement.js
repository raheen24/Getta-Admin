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
import { cilSearch, cilPencil, cilTrash } from "@coreui/icons";

const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dummy data for content
  const dummyContent = [
    {
      id: 1,
      contentId: "CNT001",
      title: "Terms of Service",
      type: "Legal",
      status: "Published",
      lastUpdated: "2023-10-01",
      author: "Admin",
    },
    {
      id: 2,
      contentId: "CNT002",
      title: "Privacy Policy",
      type: "Legal",
      status: "Published",
      lastUpdated: "2023-10-02",
      author: "Admin",
    },
    {
      id: 3,
      contentId: "CNT003",
      title: "Welcome Banner",
      type: "Banner",
      status: "Draft",
      lastUpdated: "2023-10-03",
      author: "Marketing",
    },
    {
      id: 4,
      contentId: "CNT004",
      title: "FAQ Section",
      type: "Help",
      status: "Published",
      lastUpdated: "2023-10-04",
      author: "Support",
    },
    {
      id: 5,
      contentId: "CNT005",
      title: "About Us",
      type: "Page",
      status: "Published",
      lastUpdated: "2023-10-05",
      author: "Admin",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return <CBadge className="medium">Published</CBadge>;
      case "Draft":
        return <CBadge className="high">Draft</CBadge>;
      case "Archived":
        return <CBadge className="secondary">Archived</CBadge>;
      default:
        return <CBadge>{status}</CBadge>;
    }
  };

  const filteredContent = dummyContent.filter((content) => {
    const matchesSearch =
      content.contentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "" || content.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredContent.length / 10);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="contentManagementPage">
      <h4 className="heading mb-3">Content Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">
            Type: {typeFilter || "All"}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setTypeFilter("")}>
              All
            </CDropdownItem>
            <CDropdownItem onClick={() => setTypeFilter("Legal")}>
              Legal
            </CDropdownItem>
            <CDropdownItem onClick={() => setTypeFilter("Banner")}>
              Banner
            </CDropdownItem>
            <CDropdownItem onClick={() => setTypeFilter("Help")}>
              Help
            </CDropdownItem>
            <CDropdownItem onClick={() => setTypeFilter("Page")}>
              Page
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Content ID</CTableHeaderCell>
            <CTableHeaderCell>Title</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Author</CTableHeaderCell>
            <CTableHeaderCell>Last Updated</CTableHeaderCell>
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
          ) : paginatedContent.length > 0 ? (
            paginatedContent.map((content) => (
              <CTableRow key={content.id}>
                <CTableDataCell>{content.contentId}</CTableDataCell>
                <CTableDataCell>{content.title}</CTableDataCell>
                <CTableDataCell>{content.type}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(content.status)}</CTableDataCell>
                <CTableDataCell>{content.author}</CTableDataCell>
                <CTableDataCell>{content.lastUpdated}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    className="medium me-2"
                    onClick={() => {
                      // Handle edit
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    className="high"
                    size="sm"
                    onClick={() => {
                      // Handle delete
                    }}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
                No content found
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

export default ContentManagement;