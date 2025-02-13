"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";

import Features from "@/components/Features";
import Steps from "@/components/Steps";


import Home from "@/components/Home";

export default function page() {
  return (
    <main className="overflow-x-hidden ">
      <Home />
      <Steps />
      <About />
      <Features />
      
      <Contact />
    </main>
  );
}
