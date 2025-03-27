
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from "@/hooks/use-toast";
import { Locate, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix Leaflet default icon issue
// Leaflet's default icon references assets that might be missing in the build
// This is a workaround to set default icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample data for NGOs
const sampleNGOs = [
  {
    id: 1,
    name: "Health For All NGO",
    location: [19.0760, 72.8777], // Mumbai coordinates
    address: "123 Health Street, Mumbai",
    contact: "+91 9876543210",
    medicinesNeeded: ["Antibiotics", "Painkillers", "Insulin"],
    distance: 2.5 // Distance in km
  },
  {
    id: 2,
    name: "Medical Aid Foundation",
    location: [19.1136, 72.8560], // Andheri, Mumbai
    address: "45 Aid Road, Andheri, Mumbai",
    contact: "+91 9876543211",
    medicinesNeeded: ["Asthma Inhalers", "Diabetes Medication"],
    distance: 1.8 // Distance in km
  },
  {
    id: 3,
    name: "Care NGO",
    location: [19.1004, 72.8296], // Juhu, Mumbai
    address: "78 Care Avenue, Juhu, Mumbai",
    contact: "+91 9876543212",
    medicinesNeeded: ["Vitamin C", "Antibiotic Ointment"],
    distance: 3.2 // Distance in km
  }
];

// Component to set view based on user's location
function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    // Check if location is stored in localStorage
    const lat = localStorage.getItem("userLatitude");
    const lng = localStorage.getItem("userLongitude");
    
    if (lat && lng) {
      const userPosition: [number, number] = [parseFloat(lat), parseFloat(lng)];
      setPosition(userPosition);
      map.setView(userPosition, 13);
    } else {
      // Default view if no location is available
      map.setView([19.0760, 72.8777], 10);
    }
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your location</Popup>
    </Marker>
  );
}

// Create custom NG marker icon
const ngoIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'text-green-500'
});

const NearbyNGOsTab = () => {
  const [sortedNGOs, setSortedNGOs] = useState(sampleNGOs);

  useEffect(() => {
    const userLat = localStorage.getItem("userLatitude");
    const userLng = localStorage.getItem("userLongitude");
    
    if (userLat && userLng) {
      // Sort NGOs by distance
      const sorted = [...sampleNGOs].sort((a, b) => a.distance - b.distance);
      setSortedNGOs(sorted);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NGOs Near Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '500px', width: '100%', marginBottom: '2rem' }}>
            <MapContainer 
              center={[19.0760, 72.8777]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <LocationMarker />
              
              {sortedNGOs.map(ngo => (
                <Marker 
                  key={ngo.id} 
                  position={[ngo.location[0], ngo.location[1]]} 
                  icon={ngoIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-lg">{ngo.name}</h3>
                      <p className="text-sm">{ngo.address}</p>
                      <p className="text-sm">Contact: {ngo.contact}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Medicines Needed:</span> {ngo.medicinesNeeded.join(', ')}
                      </p>
                      <p className="text-sm text-green-600 font-medium mt-2">
                        {ngo.distance} km away
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nearby NGOs</h3>
            {sortedNGOs.map(ngo => (
              <Card key={ngo.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{ngo.name}</h4>
                    <p className="text-sm text-gray-500">{ngo.address}</p>
                    <p className="text-sm mt-1">Contact: {ngo.contact}</p>
                    <p className="text-sm mt-2">
                      <span className="font-semibold">Medicines Needed:</span> {ngo.medicinesNeeded.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-medium">{ngo.distance} km away</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyNGOsTab;
