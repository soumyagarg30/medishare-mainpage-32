
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sample data for donors
const sampleDonors = [
  {
    id: 1,
    name: "John Doe Pharmaceuticals",
    location: [72.8777, 19.0760], // Mumbai coordinates
    medicines: ["Antibiotics", "Painkillers", "Insulin"]
  },
  {
    id: 2,
    name: "MediCare Hospital",
    location: [72.8560, 19.1136], // Andheri, Mumbai
    medicines: ["Asthma Inhalers", "Diabetes Medication"]
  },
  {
    id: 3,
    name: "HealthPlus Clinic",
    location: [72.8296, 19.1004], // Juhu, Mumbai
    medicines: ["Vitamin C", "Antibiotic Ointment"]
  }
];

interface DonorsMapProps {
  title: string;
  className?: string;
}

const DonorsMap: React.FC<DonorsMapProps> = ({ title, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;
    
    // Initialize map with Mapbox token
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [72.8777, 19.0760], // Mumbai coordinates
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add markers for each donor
    map.current.on('load', () => {
      sampleDonors.forEach(donor => {
        // Create a marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'bg-medishare-blue text-white px-2 py-1 rounded-full text-xs font-bold';
        markerEl.innerText = donor.name.substring(0, 1);
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';
        markerEl.style.backgroundColor = '#3b82f6';
        markerEl.style.color = 'white';
        markerEl.style.fontWeight = 'bold';

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div>
              <h3 class="font-bold">${donor.name}</h3>
              <p>Available Medicines: ${donor.medicines.join(', ')}</p>
            </div>
          `);

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat(donor.location as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setIsMapLoaded(true);
    });
  };

  const handleMapboxTokenSubmit = () => {
    if (mapboxToken) {
      initializeMap();
    }
  };

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isMapLoaded ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To view the donors map, please enter your Mapbox access token:
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter Mapbox token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={handleMapboxTokenSubmit}>Load Map</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              You can get a Mapbox token by signing up at <a className="text-medishare-blue hover:underline" href="https://mapbox.com" target="_blank" rel="noopener noreferrer">mapbox.com</a>
            </p>
          </div>
        ) : null}
        <div ref={mapContainer} className={`w-full ${isMapLoaded ? 'h-[400px]' : 'h-0'} rounded-lg`} />
      </CardContent>
    </Card>
  );
};

export default DonorsMap;
