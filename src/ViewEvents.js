import React, { useState, useEffect } from "react";
import { ExternalLink, CalendarDays } from "lucide-react";
import "./ViewEvent.css";
import backendUrl from "./config";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/events`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch events:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="view-events-container">
      <header className="events-header">
        <h1>
          <CalendarDays size={32} /> Association Events
        </h1>
        <p>Browse through all the events organized by the association.</p>
      </header>

      <main className="events-content">
        {loading ? (
          <p className="status-message">Loading events...</p>
        ) : error ? (
          <p className="status-message error">Error: {error}</p>
        ) : events.length === 0 ? (
          <p className="status-message">No events have been scheduled yet.</p>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-card-header">
                  <h3>{event.eventName}</h3>
                  <p className="event-date">
                    <CalendarDays size={16} />
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="event-description">{event.description}</p>
                <a
                  href={event.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-link"
                >
                  <ExternalLink size={16} />
                  View Photos & Videos
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewEvents;
