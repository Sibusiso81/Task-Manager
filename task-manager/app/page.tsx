"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Target,
  Calendar,
  CheckCircle,
  TrendingUp,
  Zap,
  BarChart2,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import WordRotate from "@/components/ui/word-rotate";
export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section className="w-screen h-screen flex flex-col overflow-x-hidden ">
      <div>
        <div className="w-full p-6 border-[#eaeaea] flex  space-x-4 lg:justify-between  justify-between rounded-md relative z-40 flex-1 items-center ">
          <div className={`flex flex-row space-x-4 items-center`}>
            <h1 className="font-bold dark:text-[#eaeaea] text-lg text-black">
              Aspire®
            </h1>
            <ul className="lg:flex space-x-3 flex-row font-medium hidden">
              <li>
                <Link href={"/About"} className=" h-fit p-1 ">
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
                <button className="rounded-md  font-semibold bg-black border border-neutral-700/35 p-2  text-nowrap  h-full flex flex-row space-x-6 text-white w-full text-center">
                  Log in
                </button>
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
              <button className="rounded-md p-2 font-semibold bg-[#FFFFFFCC] border border-neutral-800/35  w-full h-full">
                {" "}
                Get Started{" "}
              </button>
            </Link>
            <Link href={"#Contact"}>
              <button className="rounded-md p-2 font-semibold bg-black text-white shadow-sm w-full text-nowrap">
                Contact
              </button>
            </Link>
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
            />{" "}
            <Image
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
      <section className="w-screen  h-fit bg-white md:p-10  ">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-wrap items-end justify-center mb-16">
            <div className="w-full lg:w-5/12 xl:w-5/12 text-left mb-8 lg:mb-0">
              <div className="inline-flex items-center mb-5  rounded-full px-6 py-2">
                <Target className="w-6 h-6 text-neutral-950 mr-3" />
                <span className="text-lg font-medium ">
                  Transform Your Goals
                </span>
              </div>
              <h2 className="text-4xl font-bold  leading-tight">
                Transform Big Dreams into Daily Victories
              </h2>
            </div>
            <div className="w-full lg:w-6/12 xl:w-6/12 lg:ml-auto text-left">
              <span className="block text-xl font-semibold text-black mb-2">
                Your path to success, one step at a time
              </span>
              <p className="text-muted-foreground lg:w-4/5">
                We help you break down your ambitious goals into manageable
                daily actions, making the path to success clear and achievable.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Set Clear Goals",
                description:
                  "Define your long-term objectives with clarity and purpose",
                stat: "Goal Setting",
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Daily Actions",
                description:
                  "Get personalized daily tasks that lead to your bigger goals",
                stat: "Daily Tasks",
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Track Progress",
                description:
                  "Monitor your advancement with intuitive progress tracking",
                stat: "Success Rate",
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Achieve More",
                description:
                  "Watch your consistent efforts compound into major achievements",
                stat: "Achievement",
              },
            ].map((item, index) => (
              <div key={index} className="relative last:border-r-0">
                <div className="p-8 text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-neutral-400/25 rounded-full flex items-center justify-center mx-auto relative z-10 text">
                      <div className="text-neutral-950">{item.icon}</div>
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-gray-900 block mb-2">
                    {item.title}
                  </span>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-col w-full">
                    <div className="py-3 text-sm font-bold uppercase">
                      <span>{item.stat}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="h-fit w-screen flex flex-col items-center justify-center 
      space-y-6 p-6 lg:p-10 md:space-y-10"/* w-screen h-screen p-4 space-y-4 md:space-y-10 */
      >
        <h1 className="text-2xl font-bold place-self-start">What should you expect ? </h1>
        <div className="grid grid-cols-4 gap-4 md:gap-y-10 ">
          {/*   <div className="col-span-4 md: flex flex-col space-y-2">
            <h1 className="text-neutral-600">01</h1>
            <h2 className="text-lg font-medium">Create an Aspire account</h2>
            <p>Click on teh get started button to sign up and ,your done.</p>
          </div> */}

          {[
            {
              icon: <Zap className="w-5 h-5"/>,
              heading: "AI-Powered Task Generation ",
              description: "Automatically generate personalized tasks based on your goals, timelines, and priorities.",
            },
            {
              icon: <Target className="w-5 h-5"/>,
              heading: "Smart Goal Planning",
              description:
                "Break down long-term goals into actionable milestones using project management principles.",
            },
            {
              icon: <TrendingUp className="w-5 h-5"/>,
              heading: " Dynamic Progress Tracking",
              description:
                "Visualize your progress with interactive charts, kanban boards, and task completion rates.",
            },
            {
              icon: <Calendar className="w-5 h-5"/>,
              heading: "Daily Actionable Suggestions",
              description:
                "Get tailored daily recommendations to stay on track and maximize productivity. ",
            },
            {
              icon: <BarChart2 className="w-5 h-5"/>,
              heading: "Performance Management Insights",
              description:
                "Based on your tasks complition ,a set of analytics will be generated to assess your performance on your tasks an a review provided ",
            }
          ].map((feature, index) => (
            <div
              key={index}
              className=" border-l-2 border-l-neutral-600/30 col-span-4 md:col-span-2 lg:col-span-1 space-y-2 pl-3"
            >
              <h1 className="text-green-500">{feature.icon}</h1>
              <h2 className="text-lg font-medium">{feature.heading}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-20 w-screen h-screen p-6 space-y-4 md:space-y-10">
      <h1 className="text-2xl font-bold place-self-start">How it works </h1>
        <div className="grid grid-cols-4 gap-4 gap-y-6">
          {/*   <div className="col-span-4 md: flex flex-col space-y-2">
            <h1 className="text-neutral-600">01</h1>
            <h2 className="text-lg font-medium">Create an Aspire account</h2>
            <p>Click on teh get started button to sign up and ,your done.</p>
          </div> */}

          {[
            {
              stepNumber: "01",
              heading: "Create a Aspire acccount ",
              description: "Click on the get started button and sign up ",
            },
            {
              stepNumber: "02",
              heading: "Set your goals",
              description:
                "Define your long-term objectives with clarity and purpose",
            },
            {
              stepNumber: "03",
              heading: " Head to your dashboard  ",
              description:
                "Find daily actionable tasks on your dashboard that will help you achive your goals",
            },
            {
              stepNumber: "04",
              heading: "Track your progress",
              description:
                "Based on your tasks complition ,a set of analytics will be generated to assess your performance on your tasks an a review provided ",
            },
          ].map((step, index) => (
            <div
              key={index}
              className=" border-l-2 border-l-neutral-600/30 col-span-4 md:col-span-2 lg:col-span-1 space-y-2 pl-3"
            >
              <h1 className="text-green-500">{step.stepNumber}</h1>
              <h2 className="text-lg font-medium">{step.heading}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="w-screen h-screen flex flex-col bg-neutral-900 text-white mt-32 md:52  p-4 md:p-10 space-y-6">
        <div className="flex-1">
        <h1 className="text-3xl font-bold text-white ">Aspire ®</h1>
        <h2 className="text-lg font-bold ">
          {" "}
          <WordRotate words={["Dream", "Organize", "Succeed"]} />
        </h2>
        <p className="font-bold text-lg">Index</p>
        <ul className="grid grid-cols-2 max-w-screen-sm">
          <li className="col-span-1 text-[#0f0f0f0] ">About </li>

          <li className="col-span-1 text-[#0f0f0f0] ">How to start</li>

          <li className="col-span-1 text-[#0f0f0f0] ">Contact</li>
          <li className="col-span-1 text-[#0f0f0f0] ">Email</li>
        </ul>
        </div>
        <div>
        <div className="w-full h-[2px] bg-neutral-800 "></div>
        <div className="flex flex-row md:flex-row justify-between p-2 text-xs md:text-sm text-wrap space-x-4 md:p-4">
          <p className="text-white">EST 2025</p>
          <p>Made with care and plenty coffee</p>
        </div>
        </div>
      </section>
    </section>
  );
}
