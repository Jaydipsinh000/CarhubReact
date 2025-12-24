import React, { useState, useEffect } from "react";
import Header from "./Components/Header.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Brands from "./Pages/Brands.jsx";
import Cars from "./Pages/Cars.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Footer from "./Components/Footer.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";

const App = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
