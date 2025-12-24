import React, { useEffect, useRef } from "react";
import "../Styles/Brands.css";

const brands = [
  { name: "BMW", image: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
  { name: "Audi", image: "https://www.logo.wine/a/logo/Audi/Audi-Logo.wine.svg" },
  { name: "Mercedes-Benz", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
  { name: "Range Rover", image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/LandRover.svg/2560px-LandRover.svg.png" },
  { name: "Lexus", image: "https://www.svgrepo.com/show/446890/lexus.svg" },
  { name: "Porsche", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMDM0u0xFj_dH7A3VD0Bi3qQ66phUz2-uLqA&s" },
  { name: "Jaguar", image: "https://upload.wikimedia.org/wikipedia/en/8/8e/Jaguar_logo.png" },
  { name: "Volvo", image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Volvo-Iron-Mark-Logo.png" },
];

const Brands = () => {
  const trackRef = useRef(null);

  // Infinite scroll logic
  useEffect(() => {
    const track = trackRef.current;
    let animationFrame;
    let x = 0;

    const scroll = () => {
      x -= 0.5; // scroll speed
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0; // reset when half-width scrolled
      track.style.transform = `translateX(${x}px)`;
      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="brands-page">
      {/* HERO */}
      <section className="brands-hero">
        <h1>
          Our <span>Premium Brands</span>
        </h1>
        <p>World-class automotive brands curated for the ultimate experience</p>
      </section>

      {/* BRAND CARDS */}
      <section className="brands-grid">
        {brands.slice(0, 6).map((brand, index) => (
          <div className="brand-card" key={index}>
            <div className="brand-image">
              <img src={brand.image} alt={brand.name} />
            </div>
            <h3>{brand.name}</h3>
          </div>
        ))}
      </section>

      {/* HORIZONTAL BRAND STRIP */}
      <section className="brand-strip">
        <div className="strip-track" ref={trackRef}>
          {brands.concat(brands).map((brand, index) => (
            <div className="strip-logo" key={index}>
              <img src={brand.image} alt={brand.name} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Brands;
