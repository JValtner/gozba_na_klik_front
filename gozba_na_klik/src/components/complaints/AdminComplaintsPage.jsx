import React, { useState, useEffect } from "react";
import { getAllComplaintsLast30Days, getComplaintById } from "../service/complaintService";
import ViewComplaintModal from "./ViewComplaintModal";
import Spinner from "../spinner/Spinner";
import Pagination from "../utils/Pagination";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    loadComplaints();
  }, [currentPage, pageSize]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllComplaintsLast30Days(currentPage + 1, pageSize);
      setComplaints(data.items || data.Items || []);
      setTotalCount(data.count || data.Count || 0);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setHasPreviousPage(data.hasPreviousPage || data.HasPreviousPage || false);
      setHasNextPage(data.hasNextPage || data.HasNextPage || false);
    } catch (err) {
      console.error("Error loading complaints:", err);
      setError("Greška pri učitavanju žalbi. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = async (complaintId) => {
    try {
      const complaint = await getComplaintById(complaintId);
      if (complaint) {
        setSelectedComplaint(complaint);
        setShowModal(true);
      } else {
        setError("Žalba nije pronađena.");
      }
    } catch (err) {
      console.error("Error loading complaint:", err);
      setError("Greška pri učitavanju žalbe.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      <div className="table-container">
        <div className="title-container">
          <div>
            <h1>Žalbe korisnika</h1>
            <p>Pregled svih žalbi iz poslednjih 30 dana</p>
          </div>
        </div>
        {!complaints.length > 0 ? (
          <p>Trenutno nema žalbi u poslednjih 30 dana.</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Porudžbina ID</th>
                  <th>Restoran ID</th>
                  <th>Korisnik ID</th>
                  <th>Datum podnošenja</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.id}</td>
                    <td>#{complaint.orderId}</td>
                    <td>{complaint.restaurantId}</td>
                    <td>{complaint.userId}</td>
                    <td>{formatDate(complaint.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn--primary btn--small"
                        onClick={() => handleViewComplaint(complaint.id)}
                      >
                        Pregledaj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalCount > 0 && (
              <Pagination
                page={currentPage}
                pageCount={totalPages}
                totalCount={totalCount}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

      {showModal && selectedComplaint && (
        <ViewComplaintModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowModal(false);
            setSelectedComplaint(null);
          }}
        />
      )}
    </div>
  );
}

