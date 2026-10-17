import React from "react";
import { Hero } from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainSection from "./components/MainSection";

const App = () => {
  return (
    <div>
      <Navbar />
      <MainSection />
      <Footer />
    </div>
  );
};

export default App;
