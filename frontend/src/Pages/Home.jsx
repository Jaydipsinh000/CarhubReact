import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Home.css";

const Home = () => {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content glass">
          <h1>
            Find Your <span>Perfect Drive</span>
          </h1>
          <p>
            Premium cars curated for your lifestyle, mood and journey.
            Not just renting — an experience.
          </p>

          <div className="hero-buttons">
            <Link to="/cars" className="btn-primary">Explore Cars</Link>
            <Link to="/register" className="btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* FIND MY CAR */}
      <section className="finder">
        <h2>Find <span>My Car</span></h2>
        <p className="sub">
          Answer few questions and we’ll recommend the best car for you.
        </p>

        <div className="finder-grid">
          <div className="finder-card">💰 Budget Friendly</div>
          <div className="finder-card">👨‍👩‍👧 Family Ride</div>
          <div className="finder-card">🔥 Luxury Feel</div>
          <div className="finder-card">🌄 Long Trip</div>
        </div>
      </section>

      {/* WHY CARENT */}
      <section className="why">
        <h2>Why <span>Carent</span></h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>🚗 Curated Cars</h3>
            <p>Only top condition, premium maintained vehicles.</p>
          </div>

          <div className="why-card">
            <h3>🧠 Smart Recommendation</h3>
            <p>Cars suggested based on your needs, not random listings.</p>
          </div>

          <div className="why-card">
            <h3>🔐 Secure & Verified</h3>
            <p>OTP based login, verified users and cars.</p>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="featured">
        <h2>Featured <span>Experiences</span></h2>

        <div className="car-grid">
          <div className="car-card">
            <img src="https://wallpapercave.com/wp/wp5052561.jpg" alt="BMW" />
            <h3>BMW X5</h3>
            <p>Perfect for luxury highway drives</p>
          </div>

          <div className="car-card">
            <img src="https://wallpapercave.com/wp/wp10683432.jpg" alt="Audi" />
            <h3>Audi A6</h3>
            <p>Executive comfort & class</p>
          </div>

          <div className="car-card">
            <img src="https://wallpapercave.com/wp/wp13496427.jpg" alt="Range Rover" />
            <h3>Range Rover</h3>
            <p>Power, presence & performance</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
