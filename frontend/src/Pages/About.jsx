import React from "react";
import "../Styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About <span>Carent</span></h1>
          <p>
            Carent is India’s trusted online car marketplace, providing a seamless experience for buyers, sellers, and car enthusiasts alike.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mission-vision">
  <div className="mv-grid">
    <div className="mv-card">
      <h2>Our Mission</h2>
      <p>
        To make car buying and selling easy, transparent, and enjoyable for everyone.
      </p>
    </div>
    <div className="mv-card">
      <h2>Our Vision</h2>
      <p>
        To become the most trusted and premium car marketplace in India.
      </p>
    </div>
    <div className="mv-card">
      <h2>Our Values</h2>
      <p>
        Integrity, transparency, and customer-first approach in every service we offer.
      </p>
    </div>
    <div className="mv-card">
      <h2>Our Commitment</h2>
      <p>
        Ensuring a seamless and enjoyable experience for all buyers and sellers.
      </p>
    </div>
  </div>
</section>


      {/* TEAM */}
      <section className="team">
        <h2>Meet the <span>Team</span></h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member"/>
            <h3>Jordan Rich</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member"/>
            <h3>Anita Patel</h3>
            <p>Head of Operations</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Team Member"/>
            <h3>Rahul Mehta</h3>
            <p>Lead Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
