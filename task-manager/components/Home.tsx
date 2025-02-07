import React from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Navbar from "./ui/Navbar";
import { useState } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <main  className='w-full  h-fit flex flex-col overflow-hidden ' id="Home">
     <header className="w-full p-6 border-[#eaeaea] flex items-center justify-between relative z-40">
        <div className="flex items-center gap-4">
          <h1 className="font-bold dark:text-[#eaeaea] text-lg text-black">Aspire ®</h1>
          <nav className="hidden lg:block">
            <ul className="flex gap-3 font-medium">
              {["About", "Features", "Steps", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`#${item}`} className="p-1 hover:opacity-80 transition-opacity">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Link href="/Auth/Login">
              <Button className="rounded-lg" variant="default">
                Log In
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>
      <section className="   my-auto flex flex-col lg:flex-row justify-between   p-2 lg:p-10 space-y-8 md:space-y-0">
        <div className="w-full lg:w-1/2 place-self-end space-y-3 p-4 ">
          <h1 className="text-3xl md:text-4xl xl:text-6xl font-medium text-wrap   ">
            Break down your yearly ambitions into manageable daily tasks and
            give yourself a clear path to success .
          </h1>
          <p className="text-md xl:text-lg text-neutral-500">
            Stay focused, organized, and consistently on track as you work
            toward accomplishing what matters most,Simplify your journey to
            success with personalized, goal-focused guidance that keeps you on
            track every step of the way.
          </p>
          <div className="flex flex-row space-x-3 w-full lg:w-1/2">
            <Link href={"Auth/Signup"}>
              
              <Button variant={'outline'} className="rounded-lg w-full h-full ">
              Get Started{" "}
              </Button>
            </Link>
            <Link href={"#Contact"}>
              <Button variant={'default'} className="rounded-lg">Contact</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-1/2 lg:w-1/2 lg:place-self-center">
          <div className="col-span-2 md:col-span-1 lg:flex flex-col space-y-4 h-full ">
            <Image
              src="/roman-bozhko-PypjzKTUqLo-unsplash.jpg" 
              alt="Task Manager Inspiration"
              width={800} 
              height={600} 
              priority 
              className="rounded-lg lg:h-full"
            />{" "}
            <Image
              src="/avi-richards-Z3ownETsdNQ-unsplash.jpg" 
              alt="Task Manager Inspiration"
              width={800} 
              height={600} 
              priority 
              className="rounded-lg lg:h-full hidden md:block"
            />
          </div>
          <div className="col-span-2 md:col-span-1 ">
            <Image
              src="/marissa-grootes-flRm0z3MEoA-unsplash.jpg"
              alt="Task Manager Inspiration"
              width={800} 
              height={800} 
              priority 
              
              className="rounded-lg md:h-full hidden md:block"
            />
            
          </div>
        </div>
      </section>
    
   </main>
  );
}

