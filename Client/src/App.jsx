import React, { useState } from 'react'

import Navbar from './components/Navbar/Navbar';
import Capability from './components/Compatibilty/Compatibilty';
import Hero from './components/Hero/Hero';
import TrustBar from './components/TrustBar/TrustBar';
import Service from './components/Service/Service';
import ProcessStep from './components/ProcessStep/ProcessStep';
import Feature from './components/Feature/Feature';
import Stats from './components/Stats/Stats';
import Pricing from './components/Price/Price';
import Testimonial from './components/Testimonial/Testimonial';
import FAQ from './components/Faq/Faq';
import CTA from './components/Cta/Cta';
import Footer from './components/Footer/Footer';


import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";


function App() {



useEffect(() => {
  AOS.init({
    duration: 2000,
    once: false, // animation only once
  });
}, []);



  return (
    <>
      <div >
        <Navbar />
        <Hero />
        <TrustBar />                
        <Service />
        <Capability />
        <ProcessStep />
        <Feature />
        <Stats />
        <Pricing />
        <Testimonial />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </>
  )
}

export default App
