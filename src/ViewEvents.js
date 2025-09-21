import React, { useState, useEffect } from 'react';
import { ExternalLink, CalendarDays } from 'lucide-react';

// This component fetches and displays all created events.
const ViewEvents = () => {
  // State to store the list of events from the server
  const [events, setEvents] = useState([]);
  // State to manage the loading status
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch
  const [error, setError] = useState(null);

  // useEffect hook runs once when the component is first rendered
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // 1. Fetch the data from your backend API
        const response = await fetch('https://asca360.onrender.com/api/events');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // 2. Store the fetched events in the component's state
        setEvents(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch events:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // The empty array [] ensures this effect runs only once

  // Conditional rendering based on the state
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading events...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
          <CalendarDays />
          Association Events
        </h1>
      </header>

      {/* 3. Display the events or a message if none exist */}
      <main>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No events have been scheduled yet.</p>
        ) : (
          events.map(event => (
            // Each event is rendered in its own card
            <div key={event._id} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>{event.eventName}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>
              <a 
                href={event.driveFolderUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
              >
                <ExternalLink size={16} />
                View Photos & Videos
              </a>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ViewEvents;
