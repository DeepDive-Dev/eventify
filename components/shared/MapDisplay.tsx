"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet'; // Make sure to import Icon
import { useEffect, useState } from 'react';

// Define our new custom icon
const customIcon = new Icon({
  iconUrl: '/assets/icons/location-marker.svg', // Point to the new file
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});

interface MapDisplayProps {
  location: string;
}

interface Coords {
  lat: number;
  lng: number;
}

const MapDisplay = ({ location }: MapDisplayProps) => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const response = await fetch(`/api/geocode?location=${encodeURIComponent(location)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coordinates from server');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setError("Location could not be found on the map.");
        }
      } catch (err) {
        setError("There was an error loading the map. Please try again later.");
        console.error(err);
      }
    };

    if (location) {
      fetchCoords();
    }
  }, [location]);

  if (error) {
    return <div className="p-regular-16 text-center py-4 bg-red-50 rounded-lg text-red-500">{error}</div>;
  }

  if (!coords) {
    return <div className="text-center py-4">Loading map...</div>;
  }

  return (
    <MapContainer center={[coords.lat, coords.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '14px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Add the icon prop back to the Marker */}
      <Marker position={[coords.lat, coords.lng]} icon={customIcon}>
        <Popup>
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapDisplay;