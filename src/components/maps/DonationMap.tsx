
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Sample data for donation centers
const sampleCenters = [
  {
    id: 1,
    name: "City Hospital",
    location: [72.8777, 19.0760], // Mumbai coordinates
    medicines: ["Antibiotics", "Painkillers"]
  },
  {
    id: 2,
    name: "Rural Health Center",
    location: [72.8560, 19.1136], // Andheri, Mumbai
    medicines: ["Asthma Inhalers", "Vitamins"]
  },
  {
    id: 3,
    name: "Community Clinic",
    location: [72.8296, 19.1004], // Juhu, Mumbai
    medicines: ["First Aid Supplies", "Diabetes Medication"]
  }
];

interface DonationMapProps {
  title: string;
  className?: string;
}

const MAPBOX_TOKEN_KEY = 'medishare-mapbox-token';

const DonationMap: React.FC<DonationMapProps> = ({ title, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get the token from localStorage on component mount
    return localStorage.getItem(MAPBOX_TOKEN_KEY) || '';
  });
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isTokenError, setIsTokenError] = useState<boolean>(false);

  // Initialize map when component mounts or token changes
  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
  }, [mapboxToken]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;
    
    // Clear any existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    try {
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

      // Add markers for each donation center
      map.current.on('load', () => {
        sampleCenters.forEach(center => {
          // Create a marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'bg-medishare-orange text-white px-2 py-1 rounded-full text-xs font-bold';
          markerEl.innerText = center.name.substring(0, 1);
          markerEl.style.width = '30px';
          markerEl.style.height = '30px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.display = 'flex';
          markerEl.style.alignItems = 'center';
          markerEl.style.justifyContent = 'center';
          markerEl.style.backgroundColor = '#f97316';
          markerEl.style.color = 'white';
          markerEl.style.fontWeight = 'bold';

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div>
                <h3 class="font-bold">${center.name}</h3>
                <p>Needed Medicines: ${center.medicines.join(', ')}</p>
              </div>
            `);

          // Add marker to map
          new mapboxgl.Marker(markerEl)
            .setLngLat(center.location as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
        });

        setIsMapLoaded(true);
        setIsTokenError(false);
      });
      
      // Handle map load error
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (e.error?.status === 401) {
          setIsTokenError(true);
          setIsMapLoaded(false);
          localStorage.removeItem(MAPBOX_TOKEN_KEY);
          toast({
            title: "Invalid Mapbox token",
            description: "Please enter a valid Mapbox token.",
            variant: "destructive"
          });
        }
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsTokenError(true);
      setIsMapLoaded(false);
      localStorage.removeItem(MAPBOX_TOKEN_KEY);
    }
  };

  const handleMapboxTokenSubmit = () => {
    if (mapboxToken) {
      // Save token to localStorage for future use
      localStorage.setItem(MAPBOX_TOKEN_KEY, mapboxToken);
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
              {isTokenError ? "Invalid token. Please try again with a valid Mapbox access token:" : "To view the donation centers map, please enter your Mapbox access token:"}
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
              You can get a Mapbox token by signing up at <a className="text-medishare-orange hover:underline" href="https://mapbox.com" target="_blank" rel="noopener noreferrer">mapbox.com</a>
            </p>
          </div>
        ) : null}
        <div ref={mapContainer} className={`w-full ${isMapLoaded ? 'h-[400px]' : 'h-0'} rounded-lg`} />
      </CardContent>
    </Card>
  );
};

export default DonationMap;
