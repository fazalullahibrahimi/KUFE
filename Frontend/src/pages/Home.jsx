import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MissionVisionValues from "../components/MissionVisionValues";
import Programs from "../components/Programs";
import Stats from "../components/Stats";
import Events from "../components/Events";
import TopPerformers from "../components/TopPerformers";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <MissionVisionValues />
      <Programs />
      <Stats />
      <TopPerformers />
      <Events />
      <Footer />
    </>
  );
};

export default Home;
