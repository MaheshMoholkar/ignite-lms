import React from "react";
import Categories from "./Categories";
import FAQ from "./FAQ";
import FeaturedCourses from "./FeaturedCourses";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedCourses />
      <Features />
      <FAQ />
      <Footer />
    </>
  );
}
