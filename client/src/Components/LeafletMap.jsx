import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click() {
        setUserLocation(null); // Clear user location marker when map is clicked
      },
      locationfound(e) {
        setUserLocation(e.latlng);
      },
    });

    return userLocation ? (
      <Marker position={userLocation}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  };

  return (
    <div style={{ height: '400px' }} className='w-76 h-full flex justify-center items-center'>
      <MapContainer center={[23.0225, 72.5714]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <button onClick={handleGetLocation} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
        Get Your Location
      </button>
    </div>
  );
};

export default LeafletMap;
