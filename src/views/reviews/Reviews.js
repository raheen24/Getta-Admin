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
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilStar } from "@coreui/icons";

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dummy data for reviews
  const dummyReviews = [
    {
      id: 1,
      reviewId: "REV001",
      user: "John Doe",
      driver: "Mike Johnson",
      rating: 5,
      comment: "Great service! Driver was very professional.",
      date: "2023-10-01",
    },
    {
      id: 2,
      reviewId: "REV002",
      user: "Jane Smith",
      driver: "Sarah Wilson",
      rating: 4,
      comment: "Good ride, but could be cleaner.",
      date: "2023-10-02",
    },
    {
      id: 3,
      reviewId: "REV003",
      user: "Tom Brown",
      driver: "Alex Davis",
      rating: 3,
      comment: "Average experience.",
      date: "2023-10-03",
    },
    {
      id: 4,
      reviewId: "REV004",
      user: "Lisa Green",
      driver: "Chris Taylor",
      rating: 2,
      comment: "Driver was late and rude.",
      date: "2023-10-04",
    },
    {
      id: 5,
      reviewId: "REV005",
      user: "David White",
      driver: "Emma Brown",
      rating: 5,
      comment: "Excellent service! Highly recommended.",
      date: "2023-10-05",
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) => (
          <CIcon
            key={i}
            icon={cilStar}
            className={i < rating ? "text-warning" : "text-muted"}
            size="sm"
          />
        ))}
        <span className="ms-2">{rating}/5</span>
      </div>
    );
  };

  const filteredReviews = dummyReviews.filter((review) => {
    const matchesSearch =
      review.reviewId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / 10);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="reviewsPage">
      <h4 className="heading mb-3">Reviews Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CDropdown>
          <CDropdownToggle className="dropdown">
            Rating: {ratingFilter || "All"}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setRatingFilter("")}>
              All
            </CDropdownItem>
            <CDropdownItem onClick={() => setRatingFilter("5")}>
              5 Stars
            </CDropdownItem>
            <CDropdownItem onClick={() => setRatingFilter("4")}>
              4 Stars
            </CDropdownItem>
            <CDropdownItem onClick={() => setRatingFilter("3")}>
              3 Stars
            </CDropdownItem>
            <CDropdownItem onClick={() => setRatingFilter("2")}>
              2 Stars
            </CDropdownItem>
            <CDropdownItem onClick={() => setRatingFilter("1")}>
              1 Star
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Review ID</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Rating</CTableHeaderCell>
            <CTableHeaderCell>Comment</CTableHeaderCell>
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
          ) : paginatedReviews.length > 0 ? (
            paginatedReviews.map((review) => (
              <CTableRow key={review.id}>
                <CTableDataCell>{review.reviewId}</CTableDataCell>
                <CTableDataCell>{review.user}</CTableDataCell>
                <CTableDataCell>{review.driver}</CTableDataCell>
                <CTableDataCell>{renderStars(review.rating)}</CTableDataCell>
                <CTableDataCell className="text-truncate" style={{ maxWidth: "200px" }}>
                  {review.comment}
                </CTableDataCell>
                <CTableDataCell>{review.date}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                No reviews found
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

export default Reviews;