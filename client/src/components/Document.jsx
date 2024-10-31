// //here we will create a route for the document page that take the coordinates from the map to create a document

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../API';

function DocumentRoute() {
  const [position, setPosition] = useState(null);
  const [title, setTitle] = useState('');
  const [scale, setScale] = useState('');
  const [issuanceDate, setIssuanceDate] = useState('');
  const [description, setDescription] = useState('');
  
  // Function to handle map clicks and set the position state
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng); // Capture coordinates on map click
      }
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      alert('Please select a location on the map.');
      return;
    }
    try {
      await API.addDocument(title, 1, scale, issuanceDate, 'en', 1, description, 1);
      alert('Document added successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <div className="document-route">
      <h2>Create Document with Location</h2>
      <div style={{ height: '400px', width: '100%', marginBottom: '1rem' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Scale:</label>
          <input type="text" value={scale} onChange={(e) => setScale(e.target.value)} required />
        </div>
        <div>
          <label>Issuance Date:</label>
          <input type="date" value={issuanceDate} onChange={(e) => setIssuanceDate(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit">Create Document</button>
      </form>
    </div>
  );
}

export default DocumentRoute;
