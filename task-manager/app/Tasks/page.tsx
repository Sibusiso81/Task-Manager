"use client";

import React, { useEffect, useState } from "react";
import logout from "../Auth/Actions/Actions";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sun, Cloud, Moon, Clock, User } from "lucide-react";

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
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { PomodoroTimer } from "./Pomodoro-timer";
import ReflectionForm from "./reflectionForm";
import { Input } from "@/components/ui/input";


export interface ActionableStep {
  step: string;
  guidance: string[];
  time_estimate: string;
  potential_challenges: string;
  strategies: string;
}

export type ScheduleItem = {
  time: string;
  activity: string;
  icon: string;
};

export type SchduledSuggestion = {
  [key: string]: ScheduleItem[];
};

export type Resource = {
  title: string;
  type: string;
  url: string;
  description?: string;
};
export type ResourceSuggestion = {
  [key: string]: Resource[];
};

function Tasks() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyFocus, setDailyFocus] = useState<string>();
  const [scheduleSuggestion, setScheduleSuggestion] =
    useState<SchduledSuggestion>({});
  const [actionableSteps, setActionableSteps] = useState<ActionableStep[]>([]);
  const [suggestedResources, setSuggestedResources] =
    useState<ResourceSuggestion>({});
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [complitionTimes, setComplitionTimes] = useState<number[]>([]);
  const [actualTime, setActualTime] = useState<number>(0);
  const [completionTimePercentage, setCompletionTimePercentage] =
    useState<number>(0);
            const [name,setName] = useState<string>('')
    
  const tasksNumber = actionableSteps.length;
  const completionPercentage = tasksNumber
    ? (completedTasks / (tasksNumber + completedTasks)) * 100
    : 0;

  /* Create a function that will take actual time used to complete each task 
    Add the time estimates that each tasks has
    return a value 
    
    */

  const [initialTaskCompletionTime, setInitialTaskCompletionTime] =
    useState<number>(0);

    

    useEffect(() => {
      let  totalMinutes = 0;
      actionableSteps.forEach((item) => {
        // Extract '1 hour', '30 mins' etc
        const  timeString = item.time_estimate;
        // Split into number and unit
        const [value, unit] = timeString.split(" ");
        const newNumber = parseInt(value);

        if (unit.includes("hour")) {
          totalMinutes += newNumber * 60;
        } else if (unit.includes("minutes")) {
          totalMinutes += newNumber;
        }
      });
      console.log(totalMinutes);
      setInitialTaskCompletionTime(totalMinutes);
    }, [actionableSteps]);


  const handleComplete = (stepToRemove: number) => {
    const estimatedComplitionTime = initialTaskCompletionTime;
    setActionableSteps((prevActionableSteps) => {
      const updatedSteps = prevActionableSteps.filter(
        (_, index) => index !== stepToRemove
      );
      setCompletedTasks((prev)=> prev + 1);
      return updatedSteps;
    });
    complitionTimes.push(actualTime);
    setComplitionTimes([...complitionTimes, actualTime])
    let complitionTime = 0;
    // Map through the array of complition times and return a total
    complitionTimes.forEach((item) => {
      complitionTime += item;
    });

    let result;
    result = complitionTime > estimatedComplitionTime
      ? 0
      : (estimatedComplitionTime / complitionTime) * 10;
    if (result >= 10) {
      result = 10;
      setCompletionTimePercentage(result);
      console.log(10);
    } else if (result < 10) {
      console.log(result);
      setCompletionTimePercentage(result);
    }
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
      setName(tasks[0].name)

      const data = JSON.parse(tasks[tasks.length - 1].tasks[0]);
      const schedule = JSON.parse(tasks[tasks.length - 1].tasks[1]);

      setDailyFocus(data["Today's Focus"]);
      setScheduleSuggestion(schedule["Daily Schedule"][0]);

      const {
        "Suggested Resources": suggestedResources,
        "Actionable Steps": actionableSteps,
      } = data;
      const { "Daily Schedule": dailySchedule } = schedule;
      if (suggestedResources) {
        setSuggestedResources({ "Suggested Resources": suggestedResources });
      }

      if (dailySchedule) {
        setScheduleSuggestion(dailySchedule);
      }

      if (actionableSteps) {
        setActionableSteps(actionableSteps);
      }

   

      setLoading(false);
      let totalMinutes = 0;
      actionableSteps.forEach((item: ActionableStep) => {
        // Extract '1 hour', '30 mins' etc
        const timeString = item.time_estimate;
        // Split into number and unit
        const  [value, unit] = timeString.split(" ");
        const  newNumber = parseInt(value);

        if (unit.includes("hour")) {
          totalMinutes += newNumber * 60;
        } else if (unit.includes("minutes")) {
          totalMinutes += newNumber;
        }
      });
      setInitialTaskCompletionTime(totalMinutes);
      
    };

    getUser();
  },[] );

  const circumference = 2 * Math.PI * 36;

  return (
    <main
      className={`min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br  p-4 md:p-8 overflow-x-hidden`}
    >
      {loading ? (
        <div className="w-screen loader justify-self-center place-self-center my-auto mx-auto max-w-screen-sm"></div>
      ) : (
        <section className="mx-auto flex flex-col p-2 md:p-8 w-full overflow-x-hidden space-y-10">
          <Toaster position="top-right" />
          <section className="w-full mx-auto md:px-4 sm:px-6 lg:px-8">
            <div className="bg-white space-y-6 ">
            
            <nav className="flex items-center justify-between border-b border-gray-200 pb-4 w-full max-w-7xl   mx-auto">
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
      Aspire ®
    </h1>
   
<div className="place-self-end">
   
<DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-100 p-2 rounded-full">
        
<div className="flex w-full space-x-1"><User/> {name}</div>
      </DropdownMenuTrigger>
      <DropdownMenuSeparator/>
      <DropdownMenuContent>
      <Link href={"/Tasks"}>
          {" "}
          <DropdownMenuItem>Tasks</DropdownMenuItem>
        </Link>
        <Link href={"/Tasks/TaskHistory"}>
          {" "}
          <DropdownMenuItem>Task history</DropdownMenuItem>
        </Link>
        <Link href={"/Tasks/TaskAssistant"}>
          {" "}
          <DropdownMenuItem>Task Assistant</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <button
            onClick={logout}
            className="px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> 
  </div>   
  </nav>


              <div className="flex items-start justify-between w-full max-w-7xl mx-auto">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Today&apos;s Focus
                  </h2>
                  <p className="text-sm md:text-2xl lg:text-4xl font-bold mt-2 text-gray-800">
                    {dailyFocus}
                  </p>
                </div>
                <div className="relative w-24 h-24">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="50"
                        cy="50"
                      />
                      <motion.circle
                        className="text-blue-500"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="50"
                        cy="50"
                        initial={{
                          strokeDasharray: circumference,
                          strokeDashoffset: circumference,
                        }}
                        animate={{
                          strokeDashoffset:
                            circumference -
                            (circumference * completionPercentage) / 100,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-lg font-semibold text-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {Math.round(completionPercentage)}%
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className=" max-w-7xl  p-2 md:p-8    mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Daily Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {Object.entries(scheduleSuggestion).map(
                ([period, activities]) => (
                  <Card
                    key={period}
                    className="overflow-hidden text-wrap w-full"
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                      <CardTitle className="text-white flex items-center space-x-2">
                        {period === "Morning" && <Sun className="w-5 h-5" />}
                        {period === "Afternoon" && (
                          <Cloud className="w-5 h-5" />
                        )}
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
                          <div className="flex flex-row space-x-4 items-start">
                            <div className="flex items-start gap-3 text-wrap">
                              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="text-sm lg:text-base font-medium text-gray-800">
                                {item.activity}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {item.time}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </section>
          <section className="w-full  max-w-7xl mx-auto  p-2 mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Tasks
            </h2>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <div className="mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {actionableSteps && actionableSteps.length > 0 ? (
                actionableSteps.map((step, index) => (
                  <Card key={index} className="overflow-hidden space-y-4 ">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span>{step.step}</span>
                        </span>
                        <span className="text-sm flex flex-row items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-nowrap ">
                            {step.time_estimate}
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-col">
                        <div className="flex-1">
                          <p className="text-gray-600 mb-4">
                            {step.guidance.join(", ")}
                          </p>
                        </div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
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
                            <div>
                              <PomodoroTimer />
                            </div>
                            <div className="pb-4 space-y-4">
                              <label className="text-nowrap text-muted-foreground">
                                How long did it take you to complete the task ?
                              </label>
                              <Input
                              required
                                type="number"
                                placeholder="Actual time to complete task (mins)"
                                onChange={(e) =>
                                  setActualTime(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : 0
                                  )
                                }
                              />
                            </div>
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
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="w-full mx-auto col-span-2 ">
                  <ReflectionForm
                    completionTimePercentage={completionTimePercentage}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto  mt-8">
            <h2 className="text-xl font-semibold text-black mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
              Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedResources &&
              Object.keys(suggestedResources).length > 0 ? (
                Object.entries(suggestedResources).flatMap(
                  ([, resources]) =>
                    Array.isArray(resources)
                      ? resources.map((item: Resource) => (
                          <Card key={item.url} className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                              <CardTitle className="text-white text-lg">
                                {item.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600 mb-2">
                                {item.type}
                              </p>
                              {item.description && (
                                <p className="text-sm text-gray-700 mb-4">
                                  {item.description}
                                </p>
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
                        ))
                      : []
                )
              ) : (
                <div className="col-span-full flex justify-center items-center p-8">
                  <p className="text-gray-500 text-lg">
                    No Suggested Resources
                  </p>
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
