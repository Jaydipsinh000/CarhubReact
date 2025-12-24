import React, { useState } from "react";
import "../styles/Cars.css";


const carsData = [
  {
    id: 1,
    name: "BMW X5",
    brand: "BMW",
    category: "SUV",
    price: 8200,
    image:
      "https://wallpapercat.com/w/full/1/7/7/1682692-2249x1500-desktop-hd-bmw-x5-background-photo.jpg",
  },
  {
    id: 2,
    name: "Audi Q7",
    brand: "Audi",
    category: "SUV",
    price: 7800,
    image: "https://wallpapercave.com/wp/wp5057435.jpg",
  },
  {
    id: 3,
    name: "Mercedes GLE",
    brand: "Mercedes",
    category: "SUV",
    price: 9000,
    image: "https://wallpapercave.com/wp/wp8730442.jpg",
  },
  {
    id: 4,
    name: "BMW 3 Series",
    brand: "BMW",
    category: "Sedan",
    price: 6500,
    image: "https://wallpapercave.com/wp/wp1837798.jpg",
  },
  {
    id: 5,
    name: "Audi A6",
    brand: "Audi",
    category: "Sedan",
    price: 7000,
    image: "https://wallpapercave.com/wp/wp4152397.jpg",
  },
];

const Cars = () => {
  const [filter, setFilter] = useState("All");

  const filteredCars =
    filter === "All"
      ? carsData
      : carsData.filter(
          (car) =>
            car.brand === filter || car.category === filter
        );

  return (
    <section className="cars-page">
      <h1>
        Our <span>Cars</span>
      </h1>

      {/* FILTER BUTTONS */}
      <div className="filters">
        {["All", "BMW", "Audi", "Mercedes", "SUV", "Sedan"].map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* CAR GRID */}
      <div className="cars-grid">
        {filteredCars.map((car) => (
          <div className="car-card" key={car.id}>
            <img src={car.image} alt={car.name} />
            <div className="car-info">
              <h3>{car.name}</h3>
              <p>{car.category} • {car.brand}</p>
              <h4>₹{car.price} / day</h4>
              <button>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cars;
