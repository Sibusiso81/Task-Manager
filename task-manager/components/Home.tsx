import React from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Navbar from "./ui/Navbar";
import { useState } from "react";
function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section className="flex flex-col overflow-x-hidden">
      <div id="Home">
        <div className="w-full p-6 border-[#eaeaea] flex  space-x-4 lg:justify-between  justify-between rounded-md relative z-40 flex-1 items-center ">
          <div className={`flex flex-row space-x-4 items-center`}>
            <h1 className="font-bold dark:text-[#eaeaea] text-lg text-black">
              Aspire ®
            </h1>
            <ul className="lg:flex space-x-3 flex-row font-medium hidden">
              <li>
                <Link href={"#About"} className=" h-fit p-1 ">
                  About
                </Link>
              </li>
              <li>
                {" "}
                <Link href={"#Features"} className=" h-fit p-1">
                  Features
                </Link>
              </li>
              <li>
                {" "}
                <Link href={"#Steps"} className=" h-fit p-1">
                  Steps
                </Link>
              </li>
              <li>
                <Link href={"#Contact"} className=" h-fit p-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-row space-x-2 items-center">
            <div className="hidden lg:flex flex-row space-x-2">
              <Link href={"/Auth/Login"}>
                <Button>Log In</Button>
              </Link>
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
          {isOpen ? <Navbar /> : null}
        </AnimatePresence>
      </div>
      <section className=" w-screen h-fit lg:h-screen my-auto flex flex-col lg:flex-row justify-between  p-2 lg:p-10 space-y-8 md:space-y-0">
        <div className="w-full lg:w-1/2 my-auto space-y-3 p-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-wrap   ">
            Break down your yearly ambitions into manageable daily tasks and
            give yourself a clear path to success .
          </h1>
          <p className="text-md text-muted-foreground ">
            Stay focused, organized, and consistently on track as you work
            toward accomplishing what matters most,Simplify your journey to
            success with personalized, goal-focused guidance that keeps you on
            track every step of the way.
          </p>
          <div className="flex flex-row space-x-3 w-full lg:w-1/2">
            <Link href={"Auth/Signup"}>
             
              <Button
                variant={"outline"}
                className=" rounded-lg w-full h-full "
              >
                Get Started{" "}
              </Button>
            </Link>
            <Link href={"#Contact"}>
              <Button variant={"default"}>Contact</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-1/2 lg:w-1/2">
          <div className="col-span-2 md:col-span-1 lg:flex flex-col space-y-4 h-full">
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
              className="rounded-lg lg:h-full hidden "
            />
          </div>
          <div className="col-span-2 md:col-span-1 hidden">
            <Image
              src="/marissa-grootes-flRm0z3MEoA-unsplash.jpg" 
              alt="Task Manager Inspiration"
              width={800} 
              height={800} 
              priority 
              className="rounded-lg md:h-full hidden"
            />
          </div>
        </div>
      </section>
    </section>
  );
}

export default Home;
