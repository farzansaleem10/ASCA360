import React, { useState, useEffect } from "react";
import "./CreateAnnouncement.css"; // We will use the same CSS file
import backendUrl from "./config";
// Import icons for the tabs and buttons
import { PlusSquare, Edit, CheckSquare, Trash2, Check, X } from "lucide-react";

const CreateAnnouncement = () => {
  // --- STATE ---
  // 1. Add state for the active tab
  const [activeSection, setActiveSection] = useState("create"); 
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  // --- DATA FETCHING ---
  const fetchAnnouncements = async () => {
    setListLoading(true);
    try {
      const response = await fetch(`${backendUrl}/announcement/all`);
      const data = await response.json();
      if (response.ok) {
        setAllAnnouncements(data);
      } else {
        setMessage("Failed to fetch announcements.");
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setMessage("A network error occurred.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // --- API HANDLERS (Create, Edit, Approve, Delete) ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url = editingId
      ? `${backendUrl}/announcement/${editingId}`
      : `${backendUrl}/announcement`;
    const method = editingId ? "PUT" : "POST";

    const payload = editingId
      ? { title, content }
      : { title, content, createdBy: "Asca Admin" };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        cancelEdit(); // Clear form
        fetchAnnouncements(); // Refresh list
        
        // If we were creating, switch to the manage tab to see it
        if (!editingId) {
          setActiveSection("manage");
        }

      } else {
        setMessage(data.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setMessage("");
    try {
      const response = await fetch(`${backendUrl}/announcement/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchAnnouncements(); // Refresh list
      } else {
        setMessage(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setMessage("A network error occurred.");
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      const response = await fetch(`${backendUrl}/announcement/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Deleted successfully!");
        fetchAnnouncements();
      } else {
        setMessage(data.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      setMessage("A network error occurred.");
    }
  };

  // --- HELPER FUNCTIONS ---

  // Sets form for editing and jumps to 'create' tab
  const handleEditClick = (announcement) => {
    setEditingId(announcement._id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setMessage("");
    setActiveSection("create"); // Switch to the create/edit tab
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMessage("");
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Pending") return "status-pending";
    if (status === "Rejected") return "status-rejected";
    return "";
  };

  // Filter lists for the sections
  const approvedAnnouncements = allAnnouncements.filter(
    (ann) => ann.status === "Approved"
  );
  const pendingAnnouncements = allAnnouncements.filter(
    (ann) => ann.status === "Pending"
  );

  // --- RENDER ---
  return (
    <div className="admin-announcement-container">
      {/* --- 2. THE NEW TAB INTERFACE --- */}
      <div className="admin-dashboard-tabs">
        <button
          onClick={() => setActiveSection("create")}
          className={`admin-tab ${
            activeSection === "create" ? "active" : ""
          }`}
        >
          <PlusSquare size={18} />
          {editingId ? "Edit Announcement" : "Create Announcement"}
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`admin-tab ${
            activeSection === "manage" ? "active" : ""
          }`}
        >
          <Edit size={18} /> Manage Announcements
        </button>
        <button
          onClick={() => setActiveSection("approve")}
          className={`admin-tab ${
            activeSection === "approve" ? "active" : ""
          }`}
        >
          <CheckSquare size={18} /> Approve Announcements
          {/* Show a notification badge if there are pending posts */}
          {pendingAnnouncements.length > 0 && (
            <span className="pending-badge">{pendingAnnouncements.length}</span>
          )}
        </button>
      </div>

      {/* --- 3. CONDITIONAL CONTENT AREA --- */}
      <main className="admin-dashboard-main-content">
        
        {/* --- SECTION 1: Create / Edit Form --- */}
        {activeSection === "create" && (
          <div className="admin-announcement-card">
            <h2 className="admin-announcement-title">
              {editingId ? "Edit Announcement" : "Create New Announcement"}
            </h2>
            <form onSubmit={handleSubmit} className="admin-announcement-form">
              <div>
                <label htmlFor="title" className="admin-announcement-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="admin-announcement-input"
                  placeholder="e.g., Upcoming Holiday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="admin-announcement-label">
                  Content
                </label>
                <textarea
                  id="content"
                  className="admin-announcement-textarea"
                  placeholder="Write your announcement here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-btn"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Announcement"
                    : "Publish Announcement"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {message && (
              <p
                className={`admin-announcement-message ${
                  message.includes("success") ||
                  message.includes("approved") ||
                  message.includes("updated")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}

        {/* --- SECTION 2: Edit/Delete Approved Announcements --- */}
        {activeSection === "manage" && (
          <div className="admin-announcement-card">
            <h2 className="admin-announcement-title">
              Manage Approved Announcements
            </h2>
            {listLoading && <p>Loading...</p>}
            <div className="announcements-list">
              {approvedAnnouncements.length > 0 ? (
                approvedAnnouncements.map((ann) => (
                  <div key={ann._id} className="announcement-item">
                    <div className="announcement-item-header">
                      <h4>{ann.title}</h4>
                      <span
                        className={`status-badge ${getStatusClass(ann.status)}`}
                      >
                        {ann.status}
                      </span>
                    </div>
                    <p>{ann.content}</p>
                    <small>
                      By: <strong>{ann.createdBy}</strong>
                    </small>
                    <div className="announcement-actions">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEditClick(ann)} // Use handleEditClick
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(ann._id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                !listLoading && (
                  <p className="empty-list-message">
                    No approved announcements found.
                  </p>
                )
              )}
            </div>
          </div>
        )}

        {/* --- SECTION 3: Approve/Reject Pending Announcements --- */}
        {activeSection === "approve" && (
          <div className="admin-announcement-card">
            <h2 className="admin-announcement-title">
              Pending Announcements for Approval
            </h2>
            {listLoading && <p>Loading...</p>}
            <div className="announcements-list">
              {pendingAnnouncements.length > 0 ? (
                pendingAnnouncements.map((ann) => (
                  <div key={ann._id} className="announcement-item">
                    <div className="announcement-item-header">
                      <h4>{ann.title}</h4>
                      <span
                        className={`status-badge ${getStatusClass(ann.status)}`}
                      >
                        {ann.status}
                      </span>
                    </div>
                    <p>{ann.content}</p>
                    <small>
                      By: <strong>{ann.createdBy}</strong>
                    </small>
                    <div className="announcement-actions pending-actions">
                      <button
                        className="icon-btn approve-btn"
                        onClick={() => handleStatusChange(ann._id, "Approved")}
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        className="icon-btn reject-btn"
                        onClick={() => handleStatusChange(ann._id, "Rejected")}
                      >
                        <X size={16} /> Reject
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(ann._id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                !listLoading && (
                  <p className="empty-list-message">
                    No pending announcements to review.
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateAnnouncement;