'use client'

import Image from "next/image";
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
   <section className="w-screen h-screen flex flex-col ">
    <div className="w-full p-4 border-[#eaeaea] flex  space-x-4 lg:justify-between  justify-between rounded-md relative z-40 flex-1 items-center ">
       
          <div className={`flex flex-row space-x-4 items-center`}>
         <h1 className="font-bold dark:text-[#eaeaea] text-lg text-black">
          Actionary®
          </h1>
          <ul className="lg:flex space-x-3 flex-row font-medium hidden">
            <li>
            <Link href={'/About'} className=" h-fit p-1 ">
              About
              </Link>
            </li>
            <li> <Link href={'#Features'} className=" h-fit p-1">
              Features
              </Link></li>
            <li> <Link href={'#Steps'} className=" h-fit p-1">
                Steps
              </Link></li>
            <li><Link href={'#Contact'} className=" h-fit p-1">
              Contact
              </Link></li>
            </ul> 
         </div>

          <div className="flex flex-row space-x-2 items-center">
          
         <div className="hidden lg:flex flex-row space-x-2">
          <Link href={'/Auth/Login'}>
          <button className="rounded-md  font-semibold bg-black border border-neutral-800/35 p-2  text-nowrap  h-full flex flex-row space-x-6 text-white w-full text-center">
           Log in
         
          </button></Link>
          
         </div>
          
            <Menu
              className={`cursor-pointer lg:hidden   ${isOpen ? "hidden" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            />
            <X
              className={`cursor-pointer lg:hidden  ${isOpen ? "" : "hidden"}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isOpen ?<Navbar/> : null}
        </AnimatePresence>
      <section className=" w-screen h-fit lg:h-screen my-auto flex flex-col lg:flex-row justify-between  p-2 lg:p-10 space-y-8 md:space-y-0">
        <div className="w-full lg:w-1/2 my-auto space-y-3 p-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-wrap   ">
          Break down your yearly ambitions into manageable daily tasks and  give yourself a clear path to success .
          </h1>
          <p className="text-md text-muted-foreground ">
          Stay focused, organized, and consistently on track as you work toward accomplishing what matters most,Simplify your journey to success with personalized, goal-focused guidance that keeps you on track every step of the way.
          </p>
          <div className="flex flex-row space-x-3 w-full lg:w-1/2">
          <Link href={'Auth/Signup'}>
          <button className="rounded-md p-2 font-semibold bg-[#FFFFFFCC] border border-neutral-800/35  w-full h-full"> Get Started </button></Link>
          <Link href={'#Contact'}>
          <button className="rounded-md p-2 font-semibold bg-black text-white shadow-sm w-full text-nowrap">Contact</button></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-1/2 lg:w-1/2">
      
      <div className="col-span-2 md:col-span-1 lg:flex flex-col space-y-4 h-full hidden md:block">
      <Image
        src="/roman-bozhko-PypjzKTUqLo-unsplash.jpg" // Path relative to 'public'
        alt="Task Manager Inspiration"
        width={800} // Specify width
        height={600} // Specify height
        priority // Optional: Preload the image
        className="rounded-lg lg:h-full"
        
      />  <Image
      src="/avi-richards-Z3ownETsdNQ-unsplash.jpg" // Path relative to 'public'
      alt="Task Manager Inspiration"
      width={800} // Specify width
      height={600} // Specify height
      priority // Optional: Preload the image
     className="rounded-lg lg:h-full"
    />
      </div>
      <div className="col-span-2 md:col-span-1 ">
      <Image
        src="/marissa-grootes-flRm0z3MEoA-unsplash.jpg" // Path relative to 'public'
        alt="Task Manager Inspiration"
        width={800} // Specify width
        height={800} // Specify height
        priority // Optional: Preload the image
    className="rounded-lg md:h-full"
        
      />
    {/*   <Image
        src="/marissa-grootes-flRm0z3MEoA-unsplash.jpg" // Path relative to 'public'
        alt="Task Manager Inspiration"
        width={600} // Specify width
        height={800} // Specify height
        priority // Optional: Preload the image
    className="rounded-lg w-full"
    style={{
      maxHeight:'50%',
      
      maxWidth:'100%'
    }}
        
      /> */}
      </div>
      </div>
      </section>
   </section>
  );
}
