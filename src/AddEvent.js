import React, { useState } from "react";
import "./AddEvent.css";
import backendUrl from "./config";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [driveFolderUrl, setDriveFolderUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const eventData = {
      eventName,
      date,
      description,
      driveFolderUrl,
      createdBy: "Admin User",
    };

    try {
      const response = await fetch(`${backendUrl}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Event created successfully!");
        setEventName("");
        setDate("");
        setDescription("");
        setDriveFolderUrl("");
      } else {
        setMessage(data.message || "Failed to create event.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-event-container">
      <div className="form-wrapper">
        <header className="form-header">
          <h1>Create New Event</h1>
          <p>Fill out the details below to add a new event.</p>
        </header>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="eventName">Event Name</label>
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="driveFolderUrl">Google Drive Folder URL</label>
            <input
              id="driveFolderUrl"
              type="url"
              placeholder="https://drive.google.com/..."
              value={driveFolderUrl}
              onChange={(e) => setDriveFolderUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
};

export default AddEvent;
