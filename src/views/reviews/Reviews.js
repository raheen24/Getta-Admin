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
  CButton,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import { apiHelper } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Reviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: currentPage,
      limit: 10,
      ...(searchTerm && { q: searchTerm }),
      ...(ratingFilter && { rating: ratingFilter }),
    });
    const { error, response } = await apiHelper(
      "GET",
      `admin/get-reviews?${queryParams}`
    );
    setLoading(false);
    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }
    setReviews(response.data.data.reviews);
    setPagination(response.data.data.pagination);
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={i < rating ? "text-warning" : "text-secondary"}
            size="sm"
          />
        ))}
        <span className="ms-2 fw-bold">{rating}/5</span>
      </div>
    );
  };

  const handleRowClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

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
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <CTableRow
                key={review._id}
                onClick={() => handleRowClick(review._id)}
                style={{ cursor: "pointer" }}
              >
                <CTableDataCell>{review._id}</CTableDataCell>
                <CTableDataCell>{review.userId.fullName}</CTableDataCell>
                <CTableDataCell>{review.driverId.fullName}</CTableDataCell>
                <CTableDataCell>{renderStars(review.rating)}</CTableDataCell>
                <CTableDataCell
                  className="text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {review.comment}
                </CTableDataCell>
                <CTableDataCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </CTableDataCell>
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

      {pagination.pages > 1 && (
        <CPagination align="center" className="mt-3">
          <CPaginationItem
            disabled={pagination.page === 1}
            onClick={() => setCurrentPage(pagination.page - 1)}
          >
            Previous
          </CPaginationItem>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <CPaginationItem
                key={page}
                active={page === pagination.page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </CPaginationItem>
            )
          )}
          <CPaginationItem
            disabled={pagination.page === pagination.pages}
            onClick={() => setCurrentPage(pagination.page + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default Reviews;
