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
  CBadge,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilChatBubble,
  cilUserFollow,
  cilGroup,
  cilCheck,
  cilX,
  cilDollar,
  cilTruck,
  cilMoney,
} from "@coreui/icons";
import { apiHelper } from "../../services";
import { toast } from "react-toastify";
import chat4 from "src/assets/images/chat4.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalVendors: 0,
    totalRides: 0,
    totalReviews: 0,
    totalDisputes: 0,
    totalEarnings: 0,
    totalPendingPayments: 0,
    driverRequests: [],
  });
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    const { error, response } = await apiHelper("GET", "admin/get-dashboard-data");
    if (error) {
      toast.error(error);
    } else {
      setDashboardData(response.data.data);
    }
    setLoading(false);
  };

  const stats = dashboardData
    ? [
        {
          title: "Total Users",
          value: dashboardData.totalUsers?.toString() || "0",
          icon: cilGroup,
          color: "primary",
          change: "",
        },
        {
          title: "Total Drivers",
          value: dashboardData.totalDrivers?.toString() || "0",
          icon: cilUserFollow,
          color: "success",
          change: "",
        },
        {
          title: "Total Vendors",
          value: dashboardData.totalVendors?.toString() || "0",
          icon: cilUserFollow,
          color: "info",
          change: "",
        },
        {
          title: "Total Rides",
          value: dashboardData.totalRides?.toString() || "0",
          icon: cilTruck,
          color: "warning",
          change: "",
        },
        {
          title: "Total Reviews",
          value: dashboardData.totalReviews?.toString() || "0",
          icon: cilCheck,
          color: "secondary",
          change: "",
        },
        {
          title: "Total Disputes",
          value: dashboardData.totalDisputes?.toString() || "0",
          icon: cilChatBubble,
          color: "danger",
          change: "",
        },
        {
          title: "Total Earnings",
          value: `$${dashboardData.totalEarnings?.toString() || "0"}`,
          icon: cilDollar,
          color: "success",
          change: "",
        },
        {
          title: "Total Pending Payments",
          value: dashboardData.totalPendingPayments?.toString() || "0",
          icon: cilMoney,
          color: "warning",
          change: "",
        },
      ]
    : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <CBadge className="pending">Pending</CBadge>;
      case "approved":
        return <CBadge className="medium">Approved</CBadge>;
      case "rejected":
        return <CBadge className="high">Rejected</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const handleRowClick = (request) => {
    navigate(`/driver-requests/${request._id}`, { state: { request } });
  };

  // const handleApprove = async (request) => {
  //   const id = request._id;
  //   setApproveLoading((prev) => ({ ...prev, [id]: true }));
  //   setTimeout(() => {
  //     toast.success("Request accepted successfully.");
  //     setApproveLoading((prev) => ({ ...prev, [id]: false }));
  //   }, 1000);
  // };

  // const handleReject = async (request) => {
  //   const id = request._id;
  //   setRejectLoading((prev) => ({ ...prev, [id]: true }));
  //   setTimeout(() => {
  //     toast.success("Request rejected successfully.");
  //     setRejectLoading((prev) => ({ ...prev, [id]: false }));
  //   }, 1000);
  // };

  if (loading) {
    return (
      <div className="dashboardPage">
        <h4 className="heading mb-4">Dashboard</h4>
        <div className="text-center">
          <CSpinner />
        </div>
      </div>
    );
  }

  return (
    <>
      <h4 className="heading mb-4">Dashboard</h4>

      {/* Statistics Cards */}
      <CRow className="mb-4">
        {stats.map((stat, index) => (
          <CCol key={index} sm={6} lg={3} xl={3}>
            <CCard className="text-center counterCard mb-2">
              <CCardBody>
                <div className={`text-${stat.color} mb-2`}>
                  <CIcon icon={stat.icon} />
                </div>
                <h2 className="mb-1">{stat.value}</h2>
                <p className="text-body-secondary mb-1">{stat.title}</p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Driver Requests Table */}
      <h4 className="heading mb-4">Driver Requests</h4>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Driver</CTableHeaderCell>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {dashboardData.driverRequests &&
          dashboardData.driverRequests.length > 0 ? (
            dashboardData.driverRequests.map((request) => (
              <CTableRow
                key={request._id}
                onClick={() => handleRowClick(request)}
                style={{ cursor: "pointer" }}
              >
                {/* Driver Info */}
                <CTableDataCell>
                  <div>
                    <div className="d-flex align-items-center gap-2 justify-content-center">
                      <img
                        src={request.driverId?.image || chat4}
                        alt="Driver Avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = chat4;
                        }}
                      />
                      <p
                        style={{
                          textTransform: "capitalize",
                          marginBottom: "0px",
                          wordBreak: "break-word",
                          flexGrow: 1,
                        }}
                      >
                        {request.driverId?.fullName || "N/A"}
                      </p>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{request.vendorId?.businessName || "N/A"}</div>
                </CTableDataCell>

                {/* Status */}
                <CTableDataCell>
                  {getStatusBadge(request.status)}
                </CTableDataCell>

                {/* Actions */}
                {/* <CTableDataCell>
                  <div className="d-flex align-items-center gap-2 justify-content-center">
                    <CButton
                      size="sm"
                      className="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request);
                      }}
                      disabled={approveLoading[request._id]}
                    >
                      {approveLoading[request._id] ? (
                        <CSpinner size="sm" />
                      ) : (
                        <CIcon icon={cilCheck} />
                      )}
                    </CButton>
                    <CButton
                      size="sm"
                      className="high"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(request);
                      }}
                      disabled={rejectLoading[request._id]}
                    >
                      {rejectLoading[request._id] ? (
                        <CSpinner size="sm" />
                      ) : (
                        <CIcon icon={cilX} />
                      )}
                    </CButton>
                  </div>
                </CTableDataCell> */}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center">
                No driver requests found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

    </>
  );
};

export default Dashboard;
