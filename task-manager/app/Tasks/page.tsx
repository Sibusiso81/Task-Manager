"use client";

/* 
Add input feild to view sheet
--Get actual time it takes to complete the task
--Get reflection section for ossible chnages or improvements

Analytics
-Infered behaviours 
such as user completing tasks on time 
-user completing all sugested tasks

*/
import React, { useEffect, useState } from "react";
import logout from "../Auth/Actions/Actions";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import { motion } from "framer-motion";
import {

  Sun,
  Cloud,
  Moon,
  CheckCircle,
  ExternalLink,
  Clock,
  Send,

} from "lucide-react";
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


interface ActionableStep {
  step: string;
  guidance: string[];
  time_estimate: string;
  potential_challenges: string;
  strategies_to_overcome: string;
}
type ScheduleItem = {
  time: string;
  activity: string;
  icon: string;
};

type SchduledSuggestion = {
  [key: string]: ScheduleItem[];
};

function Tasks() {


  const [loading, setLoading] = useState<boolean>(true);
 
  // const[completeTask,setCompleteTask] = useState<boolean>(false)


  const [dailyFocus, setDailyFocus] = useState<string>();
  const [scheduleSuggestion, setScheduleSuggestion] = useState<SchduledSuggestion>({});
  const [actionableSteps, setActionableSteps] = useState<ActionableStep[]>([]);
  const [suggestedResources, setSuggestedResources] = useState<{ title: string; link: string; description: string }[]>([]);
  const [reflectiveQuestion, setReflectiveQuestion] = useState<string>();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
const [reflection, setReflection] = useState<string>("");
  
   

  

  const completionPercentage = actionableSteps.length
    ? (completedTasks.length / (completedTasks.length + actionableSteps.length)) * 100
    : 0;

    const handleComplete = (stepToRemove:number) => {
 
      setCompletedTasks([...completedTasks, stepToRemove])
 delete actionableSteps[stepToRemove]
 console.log(scheduleSuggestion)

    /*  console.log(stepToComplete)
     if(!stepToComplete){
      console.log('step not found');
      return
     }; */
     //update actionable steps
    
     setActionableSteps((prevSteps) =>
      prevSteps.filter((item) => item.step !== actionableSteps[stepToRemove].step)
     
    );
    console.log("Updated actionable steps:", actionableSteps);
    console.log('updated actionable steps',)
    //update completed tasks
   /*  setCompletedTasks((prevTasks)=>[...prevTasks ,stepToComplete])
    console.log('completed tasks',completedTasks) */
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
        redirect('/Auth/Error');
        return; // Unreachable code detected
      }

      const user = session.user;
      if (!user) {
        console.error("Error: user is not authenticated");
        redirect('/Auth/Signup');
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

      if (!tasks || tasks.length === 0 || !tasks[tasks.length - 1].task_list) {
        redirect('/GetStarted');
        return;
      }
      
      const data = JSON.parse(tasks[tasks.length - 1].task_list[0]);
      







console.log(data)
   // Output: To be determined based on user input.

// Accessing today's focus
// Output: To be determined based on user input.
/* data["Actionable Steps"].forEach((step: ActionableStep, index: number) => {
  console.log(`Step ${index + 1}: ${step.step}`);
  console.log("Guidance:", step.guidance.join(", "));
  console.log("Time Estimate:", step.time_estimate);
  console.log("Potential Challenges:", step.potential_challenges);
  console.log("Strategies to Overcome:", step.strategies_to_overcome);
}); */
    
      setDailyFocus(data["Today's Focus"]);
      setSuggestedResources(data["Suggested Resources"]);
      console.log(data["Suggested Resources"])
      setScheduleSuggestion(data["Daily Schedule"])
      const dailySchedule = data["Daily Schedule"];
    
  
for (const period in dailySchedule) {
  console.log(`${period}:`);
  dailySchedule[period].forEach((item: { time: string; activity: string; icon: string }) => {
    console.log(`  ${item.time} - ${item.activity} (${item.icon})`);
  });
}

      
      setActionableSteps(data["Actionable Steps"]);
      setSuggestedResources(data["Suggested Resources"]);
     
      setReflectiveQuestion(data["Reflective Question"]);
      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <main className={`min-h-screen flex flex-col justify-center items-center overflow-x-hidden  ${loading ? 'w-screen':'w-fit'}`}>
      {loading ? (
      <div className=" w-screen loader justify-self-center place-self-center my-auto mx-auto"></div>
      ) : (
      <section className="flex flex-col p-2 md:p-8 w-full overflow-x-hidden space-y-10">
        <Toaster position="top-right" />
        <section className="w-full mx-auto md:px-4 sm:px-6 lg:px-8">
        <div className="bg-white space-y-6">
          <nav className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-blue-600">Aspire ®</h1>
          <button
            onClick={logout}
            className="px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            Log out
          </button>
          </nav>
          <div className="flex items-start justify-between">
          <div className="border-l-4 border-t-transparent border-blue-500 pl-4">
            <h2 className="text-sm font-medium text-gray-500">
            Today&apos;s Focus
            </h2>
            <p className="text-md md:text-2xl text-wrap md:text-nowrap font-bold mt-2 text-black">
            {dailyFocus}
            </p>
          </div>
          <div className="relative w-15 h-10 md:w-30 md:h-20 flex-shrink-0">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative w-20 h-20 flex-shrink-0"
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
                strokeDashoffset: 226.19 - (226.19 * completionPercentage) / 100,
              }}
              transition={{
                duration: 0.5,
              }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-lg font-semibold text-blue-600">
              {Math.round(completionPercentage)}%
              </span>
            </div>
            </motion.div>
          </div>
          </div>
        </div>
        </section>
        <section className="flex flex-col p-2 md:p-8 w-full overflow-x-hidden space-y-10 ite ">
        <div className="flex flex-col ">
          <h2 className="text-xl font-semibold text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2 text-start">
          Daily Schedule
          </h2>
          <div className="mx-auto w-full  grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6">
          {Object.keys(scheduleSuggestion).map((period) => (
            <div className="border-l border-gray-200 col-span-1 md:col-span-2 lg:col-span-1 flex items-center gap-3 mb-4" key={period}>
            <div className="flex flex-col p-2 mb-3 space-y-4">
              <div className="flex flex-row space-x-2">
              {period === 'Morning' ? <Sun className="stroke-blue-600" /> : null}
              {period === 'Afternoon' ? <Cloud className="stroke-blue-600" /> : null}
              {period === 'Evening' ? <Moon className="stroke-blue-600" /> : null}
              <h3 className="font-medium text-black place-self-start">{period}</h3>
              </div>
              <ul>
              {scheduleSuggestion[period].map((item: ScheduleItem, index: number) => (
                <li key={index} className="flex flex-col">
                <strong>{item.time}: </strong>{item.activity}
                <item.icon></item.icon>
                </li>
              ))}
              </ul>
            </div>
            </div>
          ))}
          </div>
        </div>
        </section>
        <section className="w-full space-y-8 mx-auto md:px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
          Tasks
          </h2>
          <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(completionPercentage)}%
          </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {actionableSteps && actionableSteps.length > 0 ? (
            actionableSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{
              x: 0,
              }}
              className="border-l border-gray-200 pl-4 space-y-3"
            >
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-blue-500" size={20} />
                <h3 className={`font-medium text-black ${completedTasks.includes(index) ? 'line-through' : ''}`}>{step.step}</h3>
              </div>
              <span className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>{step.time_estimate}</span>
              </span>
              </div>
              <p className="text-gray-600">{step.guidance.join(", ")}</p>
              <div className="flex flex-col items-center">
              <Sheet>
                <SheetTrigger asChild>
                <Button variant="link" className="border-none">
                  View
                </Button>
                </SheetTrigger>
                <SheetContent>
                <SheetHeader>
                  <SheetTitle>{step.step}</SheetTitle>
                  <SheetDescription>
                  {step.guidance.join(", ")}
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-2">
                  <p>Time Estimate</p>
                  <p className="text-muted-foreground">{step.potential_challenges}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                  <h3>Potential Challenge</h3>
                  <p className="text-muted-foreground">{step.strategies_to_overcome}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                  <h3 className="">Strategy</h3>
                  <p className="text-muted-foreground">{step.strategies_to_overcome}</p>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                  <Button type="submit" onClick={() => handleComplete(index)}>Complete</Button>
                  </SheetClose>
                </SheetFooter>
                </SheetContent>
              </Sheet>
              </div>
            </motion.div>
            ))
          ) : (
            <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl font-semibold text-blue-800">Daily Reflection</CardTitle>
            </CardHeader>
            <form >
              <CardContent className="pt-6">
                <p className="text-lg text-blue-700 mb-4">{reflectiveQuestion}</p>
                <Textarea
                  placeholder="Type your reflection here..."
                  className="min-h-[150px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Reflection
                </Button>
                
              </CardFooter>
            </form>
          </Card>
          )}
          </div>
        </div>
        </section>
        <section className="w-full space-y-8 mx-auto md:px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-500 after:mt-2">
          Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedResources && suggestedResources.length > 0 ? (
            suggestedResources.map((resource, index) => (
            <motion.div
              key={index}
              whileHover={{
              x: 0,
              }}
              className="border-l border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-black">{resource.title}</h3>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                <ExternalLink size={20} />
              </a>
              </div>
              <p className="text-gray-600">{resource.description}</p>
            </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No resources available</p>
          )}
          </div>
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
    <Tasks/>
    </>
  )
}

export default page