"use client";

import React, { useEffect, useState } from "react";
import logout from "../Auth/Actions/Actions";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sun, Cloud, Moon, CheckCircle, Clock, Activity } from 'lucide-react';

const periodIcons = {
  Morning: Sun,
  Afternoon: Cloud,
  Evening: Moon,
};
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { PomodoroTimer } from "./Pomodoro-timer";
import ReflectionForm from "./reflectionForm";
import { Input } from "@/components/ui/input";
import { object } from "zod";
import { SuggestedResources } from "./SuggestedResources";

interface ActionableStep {
  step: string;
  guidance: string[];
  time_estimate: string;
  potential_challenges: string;
  strategies: string;
}

type ScheduleItem = {
  time: string;
  activity: string;
  icon: string;
};

type SchduledSuggestion = {
  [key: string]: ScheduleItem[];
};

type Resource = {
  title: string;
  type: string;
  url: string;
  description?: string;
};
type ResourceSuggestion ={
  [key:string] :Resource[],
}

function Tasks() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyFocus, setDailyFocus] = useState<string>();
  const [scheduleSuggestion, setScheduleSuggestion] =
    useState<SchduledSuggestion>({});
  const [actionableSteps, setActionableSteps] = useState<ActionableStep[]>([]);
  const [suggestedResources, setSuggestedResources] = useState<ResourceSuggestion>({});
  const [reflectiveQuestion, setReflectiveQuestion] = useState<string>();
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [reflection, setReflection] = useState<string>("");
  const tasksNumber = actionableSteps.length;
  const completionPercentage = tasksNumber
    ? (completedTasks / (tasksNumber + completedTasks)) * 100
    : 0;

  const handleComplete = (stepToRemove: number) => {
    setActionableSteps((prevActionableSteps) => {
      const updatedSteps = prevActionableSteps.filter(
        (_, index) => index !== stepToRemove
      );
      setCompletedTasks(completedTasks + 1);
      return updatedSteps;
    });
  };

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log("Error fetching session", sessionError);
        redirect("/Auth/Error");
        return;
      }

      const user = session.user;
      if (!user) {
        console.error("Error: user is not authenticated");
        redirect("/Auth/Signup");
        return;
      }

      console.log(user.email);

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

      if (tasksError) {
        console.log("Error fetching tasks", tasksError);
        return;
      }

      if (!tasks || tasks.length === 0 || !tasks[tasks.length - 1].tasks) {
        redirect("/GetStarted");
        return;
      }

      const data = JSON.parse(tasks[tasks.length - 1].tasks[0]);
      const schedule = JSON.parse(tasks[tasks.length - 1].tasks[1]);
      setDailyFocus(data["Today's Focus"]);
      setScheduleSuggestion(schedule["Daily Schedule"][0]);

      if (data["Suggested Resources"]) {
        const parsedResource = data["Suggested Resources"];
        setSuggestedResources({ "Suggested Resources": parsedResource });
        console.log(parsedResource);
      }

      if (schedule["Daily Schedule"]) {
        const parsedSchedule = schedule["Daily Schedule"];
        setScheduleSuggestion(parsedSchedule);
       
      }

      setActionableSteps(data["Actionable Steps"]);
      console.log(actionableSteps)
      setReflectiveQuestion(data["Reflective Question"]);
      setLoading(false);
      
    };

    getUser();
  }, []);

  return (
    <main
      className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br  p-4 md:p-8`}
    >
      {loading ? (
        <div className="w-screen loader justify-self-center place-self-center my-auto mx-auto max-w-screen-sm"></div>
      ) : (
        <section className="mx-auto flex flex-col p-2 md:p-8 w-full overflow-x-hidden space-y-10">
          <Toaster position="top-right" />
          <section className="w-full mx-auto md:px-4 sm:px-6 lg:px-8">
            <div className="bg-white space-y-6 ">
              <nav className="flex items-center justify-between border-b border-gray-200 pb-4 w-full max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Aspire ®</h1>
                <button
                  onClick={logout}
                  className="px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
                >
                  Log out
                </button>
              </nav>
              <div className="flex items-start justify-between  p-6 w-full max-w-7xl mx-auto">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h2 className="text-sm font-medium text-gray-500">Today's Focus</h2>
                  <p className="text-sm md:text-2xl lg:text-4xl font-bold mt-2 text-gray-800">
                    {dailyFocus}
                  </p>
                </div>
                <motion.div
                  initial={{
                  opacity: 0,
                  scale: 0.8,
                  }}
                  animate={{
                  opacity: 1,
                  scale: 1,
                  }}
                  className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center"
                >
                  <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-gray-100"
                    strokeWidth={4}
                    stroke="currentColor"
                    fill="transparent"
                    r={36}
                    cx={40}
                    cy={40}
                  />
                  <motion.circle
                    className="text-blue-500"
                    strokeWidth={4}
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                    initial={{
                    strokeDasharray: "226.19",
                    strokeDashoffset: "226.19",
                    }}
                    animate={{
                    strokeDashoffset:
                      226.19 - (226.19 * completionPercentage) / 100,
                    }}
                    transition={{
                    duration: 0.5,
                    }}
                  />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-2/3 -translate-y-1/2 text-center">
                  <span className="text-md font-semibold text-blue-600">
                    {Math.round(completionPercentage)}%
                  </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          <section className="w-full max-w-7xl mx-auto  p-6 mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Daily Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(scheduleSuggestion).map(([period, activities]) => (
                <Card key={period} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                    <CardTitle className="text-white flex items-center space-x-2">
                      {period === "Morning" && <Sun className="w-5 h-5" />}
                      {period === "Afternoon" && <Cloud className="w-5 h-5" />}
                      {period === "Evening" && <Moon className="w-5 h-5" />}
                      <span>{period}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {activities.map((item: ScheduleItem, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="mb-3 last:mb-0"
                      >
                        <div className="flex flex-col lg:flex-row items-baseline space-x-2">
                          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                            {item.time}
                          </span>
                          <span className="text-base text-gray-800">
                            {item.activity}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="w-full max-w-7xl mx-auto  p-6 mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Tasks
            </h2>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actionableSteps && actionableSteps.length > 0 ? (
                actionableSteps.map((step, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>{step.step}</span>
                        </span>
                        <span className="text-sm flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{step.time_estimate}</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-600 mb-4">{step.guidance.join(", ")}</p>
                        <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" className="w-full">View Details</Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                          <SheetHeader>
                          <SheetTitle className=" text-start">
                            {step.step}
                          </SheetTitle>
                          <SheetDescription className="text-start ">
                            {step.guidance.join(", ")}
                          </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                          <div className="flex flex-col space-y-2">
                            <p className="text-start">Time Estimate</p>
                            <p className="text-muted-foreground text-start">
                            {step.time_estimate}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <h3 className="text-start">
                            Potential Challenge
                            </h3>
                            <p className="text-muted-foreground text-start">
                            {step.potential_challenges}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <h3 className="text-start">Strategy</h3>
                            <p className="text-muted-foreground text-start">
                            {step.strategies}
                            </p>
                          </div>
                          </div>
                          <PomodoroTimer />
                          <Input
                          type="number"
                          placeholder="Actual time to complete task (mins)"
                          />
                          <SheetFooter>
                          <SheetClose asChild>
                            <Button
                            className="w-full "
                            type="submit"
                            onClick={() => handleComplete(index)}
                            >
                            Complete
                            </Button>
                          </SheetClose>
                          </SheetFooter>
                          
                        </SheetContent>
                        </Sheet>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center">
                  <ReflectionForm />
                </div>
              )}
            </div>
          </section>
          <section className="w-full max-w-7xl mx-auto p-6 mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedResources && Object.keys(suggestedResources).length > 0 ? (
                Object.entries(suggestedResources).flatMap(([category, resources]) =>
                  Array.isArray(resources) ? resources.map((item: Resource) => (
                    <Card key={item.url} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                        <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                        {item.description && (
                          <p className="text-sm text-gray-700 mb-4">{item.description}</p>
                        )}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm inline-block mt-2"
                        >
                          View Resource
                        </a>
                      </CardContent>
                    </Card>
                  )) : []
                )
              ) : (
                <div className="col-span-full flex justify-center items-center p-8">
                  <p className="text-gray-500 text-lg">No Suggested Resources</p>
                </div>
              )}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

function page() {
  return (
    <>
      <Tasks />
    </>
  );
}

export default page;
