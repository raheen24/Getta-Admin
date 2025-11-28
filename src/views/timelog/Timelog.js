import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CButton,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import { apiHelper } from "../../services";
import { toast } from "react-toastify";

const Timelog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timelogs, setTimelogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchTimelogs = async (search = "", isInitial = false) => {
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

      const endpoint = `admin/get-time-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const { response, error } = await apiHelper(
        "GET",
        endpoint,
        {},
        null
      );

      if (response?.data?.status === 1) {
        const timelogsData = response.data.data?.logs || [];
        setTimelogs(timelogsData);
      } else {
        toast.error(response?.data?.message || error || "Failed to fetch timelogs.");
        setTimelogs([]);
      }
    } catch (err) {
      console.error("Fetch timelogs error:", err);
      toast.error("Something went wrong. Please try again.");
      setTimelogs([]);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setTableLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTimelogs("", true);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTimelogs(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="timelogPage">
        <h4 className="heading mb-3">Timelog Management</h4>
        <div className="text-center">
          <CSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="timelogPage">
      <h4 className="heading mb-3">Timelog Management</h4>
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <CInputGroup className="searchfield">
          <CFormInput
            placeholder="Search timelogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CButton type="button" color="secondary" variant="outline">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
      </div>

      <CTable hover responsive className="customTables">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Driver ID</CTableHeaderCell>
            <CTableHeaderCell>Driver Name</CTableHeaderCell>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Total Ride Time</CTableHeaderCell>
            <CTableHeaderCell>Last Ride Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tableLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center">
                <CSpinner size="sm" />
              </CTableDataCell>
            </CTableRow>
          ) : timelogs.length > 0 ? (
            timelogs.map((log, index) => (
              <CTableRow key={log.driverId || index}>
                <CTableDataCell>{log.driverId}</CTableDataCell>
                <CTableDataCell>{log.driverName}</CTableDataCell>
                <CTableDataCell>{log.vendorName || log.vendorEmail}</CTableDataCell>
                <CTableDataCell>{log.totalRideTime}</CTableDataCell>
                <CTableDataCell>{log.lastRideDate}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center">
                No timelogs found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default Timelog;