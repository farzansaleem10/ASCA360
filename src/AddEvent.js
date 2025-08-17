import React, { useState } from 'react';

// This component provides the form for ASCA/Committee members to create an event.
const AddEvent = () => {
  // State hooks to store the values from the form inputs
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [driveFolderUrl, setDriveFolderUrl] = useState(''); 
  
  // State for showing messages (e.g., "Event created successfully!") to the user
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function is called when the user clicks the "Create Event" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page on submit
    setIsLoading(true);
    setMessage('');

    // 1. Create a JavaScript object with the data from the form
    const eventData = {
      eventName,
      date,
      description,
      driveFolderUrl,
      createdBy: 'Admin User', // In a real app, you would get this from your login state
    };

    try {
      // 2. Send the data to your backend API endpoint
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        body: JSON.stringify(eventData), // Convert the JavaScript object to a JSON string
      });

      const data = await response.json();

      // 3. Handle the response from the server
      if (data.success) {
        setMessage('Event created successfully!');
        // Clear the form for the next entry
        setEventName('');
        setDate('');
        setDescription('');
        setDriveFolderUrl('');
      } else {
        setMessage(data.message || 'Failed to create event.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // This is the JSX that renders the HTML form
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Google Drive Folder URL</label>
          <input
            type="url"
            placeholder="https://drive.google.com/..."
            value={driveFolderUrl}
            onChange={(e) => setDriveFolderUrl(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default AddEvent;
