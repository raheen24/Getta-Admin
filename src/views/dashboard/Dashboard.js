import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
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
  cilUser,
  cilUserFollow,
  cilCalendar,
  cilChartLine,
  cilCheck,
  cilX,
} from "@coreui/icons";
import { apiHelper } from "../../services";
import { toast } from "react-toastify";
import chat4 from "src/assets/images/chat4.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    totalDrivers: 450,
    totalRides: 3200,
    totalTransactions: 1850,
    totalReviews: 1200,
    totalDisputes: 85,
    totalReports: 150,
    pendingCoinReqs: 15,
    engagementPercentage: 72,
    pendingCoinPurchases: [
      {
        _id: 1,
        name: "John Doe",
        email: "john@example.com",
        image: null,
        packageId: { amount: 25.99 },
        status: "pending",
      },
      {
        _id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        image: null,
        packageId: { amount: 49.99 },
        status: "pending",
      },
      {
        _id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        image: null,
        packageId: { amount: 15.50 },
        status: "pending",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    // Simulate API call - data is already set in state
    setTimeout(() => {
      // Data is already initialized
    }, 500);
  };

  const stats = dashboardData
    ? [
        {
          title: "Total Users",
          value: dashboardData.totalUsers?.toString() || "0",
          icon: cilUser,
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
          title: "Total Rides",
          value: dashboardData.totalRides?.toString() || "0",
          icon: cilCalendar,
          color: "info",
          change: "",
        },
        {
          title: "Total Transactions",
          value: dashboardData.totalTransactions?.toString() || "0",
          icon: cilChartLine,
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
          icon: cilX,
          color: "danger",
          change: "",
        },
        {
          title: "Total Reports",
          value: dashboardData.totalReports?.toString() || "0",
          icon: cilChartLine,
          color: "info",
          change: "",
        },
        {
          title: "Pending Payments",
          value: dashboardData.pendingCoinReqs?.toString() || "0",
          icon: cilCalendar,
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

  const handleRowClick = (purchase) => {
    navigate(`/coin-purchases/${purchase._id}`, { state: { purchase } });
  };

  const handleApprove = async (purchase) => {
    const id = purchase._id;
    setApproveLoading((prev) => ({ ...prev, [id]: true }));
    // Simulate API call
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        pendingCoinPurchases: prev.pendingCoinPurchases.filter(p => p._id !== id)
      }));
      toast.success("Purchase approved successfully.");
      setApproveLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const handleReject = async (purchase) => {
    const id = purchase._id;
    setRejectLoading((prev) => ({ ...prev, [id]: true }));
    // Simulate API call
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        pendingCoinPurchases: prev.pendingCoinPurchases.filter(p => p._id !== id)
      }));
      toast.success("Purchase rejected successfully.");
      setRejectLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

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

      {/* Pending Coin Purchases Table */}
      <h4 className="heading mb-4">Pending Payments</h4>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>

            <CTableHeaderCell className="d-none d-md-table-cell">
              Package
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {dashboardData.pendingCoinPurchases &&
          dashboardData.pendingCoinPurchases.length > 0 ? (
            dashboardData.pendingCoinPurchases.map((purchase) => (
              <CTableRow
                key={purchase._id}
                onClick={() => handleRowClick(purchase)}
                style={{ cursor: "pointer" }}
              >
                {/* User Info */}
                <CTableDataCell>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={purchase.image || chat4}
                        alt="User Avatar"
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
                        {purchase.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{purchase.email || "N/A"}</div>
                </CTableDataCell>

                {/* Package Info */}
                <CTableDataCell>
                  <div>${purchase.packageId?.amount || "N/A"}</div>
                </CTableDataCell>

                {/* Status */}
                <CTableDataCell>
                  {getStatusBadge(purchase.status)}
                </CTableDataCell>

                {/* Actions */}
                <CTableDataCell>
                  <div className="d-flex align-items-center gap-2 justify-content-center">
                    <CButton
                      size="sm"
                      className="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(purchase);
                      }}
                      disabled={approveLoading[purchase._id]}
                    >
                      {approveLoading[purchase._id] ? (
                        <CSpinner size="sm" />
                      ) : (
                        "Approve"
                      )}
                    </CButton>
                    <CButton
                      size="sm"
                      className="high"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(purchase);
                      }}
                      disabled={rejectLoading[purchase._id]}
                    >
                      {rejectLoading[purchase._id] ? (
                        <CSpinner size="sm" />
                      ) : (
                        "Reject"
                      )}
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center">
                No pending purchases found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </>
  );
};

export default Dashboard;
