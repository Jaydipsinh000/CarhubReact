import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCarImage } from '../utils/imageUtils';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CarMap = ({ cars }) => {
    const navigate = useNavigate();

    // Default center (New York or user location)
    const defaultCenter = [20.5937, 78.9629]; // India Center

    return (
        <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-xl relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={5}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {cars.map((car) => (
                    car.location?.lat && car.location?.lng && (
                        <Marker key={car._id} position={[car.location.lat, car.location.lng]}>
                            <Popup className="custom-popup">
                                <div className="w-64 p-2">
                                    <div className="h-32 rounded-lg overflow-hidden mb-3">
                                        <img src={getCarImage(car)} alt={car.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                                    <p className="text-blue-600 font-bold mb-3">₹{car.pricePerDay}/day</p>
                                    <button
                                        onClick={() => navigate(`/cars/${car._id}`)}
                                        className="w-full bg-black text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 hover:bg-gray-800"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default CarMap;
