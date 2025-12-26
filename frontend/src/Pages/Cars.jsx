import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars } from "../Services/carApi";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars()
      .then((res) => setCars(res.data.cars))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading cars...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Cars</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={car.image}
              alt={car.name}
              className="h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{car.name}</h2>
              <p className="text-sm text-gray-600">{car.brand}</p>
              <p className="mt-2 font-semibold">₹{car.pricePerDay}/day</p>
              <Link
                to={`/cars/${car._id}`}
                className="block mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;
