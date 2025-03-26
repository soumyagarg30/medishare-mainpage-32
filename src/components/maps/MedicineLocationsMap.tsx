
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Pill, MapPin, Loader2 } from "lucide-react";
import { getMedicineLocations } from "@/utils/medicineUtils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MedicineLocation {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  latitude: number;
  longitude: number;
}

const MedicineLocationsMap: React.FC = () => {
  const [locations, setLocations] = useState<MedicineLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState<[number, number]>([20.5937, 78.9629]); // Default to center of India

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const result = await getMedicineLocations();
        if (result.success && result.data) {
          setLocations(result.data);
          
          // Set map center to first location or user's location if available
          if (result.data.length > 0) {
            setCenterPosition([result.data[0].latitude, result.data[0].longitude]);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setCenterPosition([
                  position.coords.latitude,
                  position.coords.longitude
                ]);
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          }
        } else {
          setError(result.message || "Failed to load medicine locations");
        }
      } catch (error) {
        console.error("Error loading medicine locations:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'antibiotics':
        return "text-blue-600";
      case 'painkillers':
        return "text-red-600";
      case 'vitamins':
        return "text-green-600";
      case 'antidiabetic':
        return "text-purple-600";
      case 'cardiovascular':
        return "text-pink-600";
      case 'respiratory':
        return "text-indigo-600";
      case 'gastrointestinal':
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-medishare-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">No Medicine Locations</h3>
        <p className="text-gray-600">
          There are currently no medicines with location data available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={centerPosition} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.latitude, loc.longitude]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-base">{loc.name}</h3>
                <p className={`text-sm ${getCategoryColor(loc.category)}`}>
                  {loc.category.charAt(0).toUpperCase() + loc.category.slice(1)}
                </p>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Pill className="h-3 w-3" />
                  <span>Quantity: {loc.quantity}</span>
                </div>
                <div className="flex items-start gap-1 text-sm mt-1">
                  <MapPin className="h-3 w-3 mt-0.5" />
                  <span>{loc.location}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MedicineLocationsMap;
