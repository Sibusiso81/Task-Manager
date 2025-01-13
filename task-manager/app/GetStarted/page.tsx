/* 
check if user = to the session they are in 
--Only alow the right user
--make sure that functions with name as null only run wehn its a new day
Create an array state to store messages from the goal and suggestins made by the llm

Redirect user once json from gemini is inserted to the db
check if gemmini output is the besrt

-ensure that new tasks are fetched evry day ony 
check  call of get new task function
-Ensure no new tasks are added unncecesarily


*/

"use client";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import getApiKey from "@/lib/Gemini/gemini";
import { redirect } from "next/navigation";

import { ArrowRight } from "lucide-react";
import Link from "next/link";




// Validation schemas for each step
const nameSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
});

/* const apiKeySchema = z.object({
  apiKey: z.string().min(10, { message: "API Key must be at least 10 characters long." }),
});
 */
const goalsSchema = z.object({
  goals: z.string().min(5, { message: "Goals must be at least 5 characters long." }),
});

function GetStartedPage() {
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [geminiTasks, setGeminiTasks] = useState<string[]>([]);
  const [formInfo, setFormInfo] = useState<string[]>([]);
  

  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const goalsForm = useForm<z.infer<typeof goalsSchema>>({
    resolver: zodResolver(goalsSchema),
    defaultValues: { goals: "" },
  });

  const handleNextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const handlePreviousStep = useCallback(() => setStep((prev) => prev - 1), []);

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  const fetchGeminiTasks = useCallback(async () => {
    const [name, goals] = formInfo;
    

    if (goals) {
      console.log(`combined goals${typeof goals}`)
      console.log(`goals ${goals} ,name: ${name}`);
    }
    if (goals) {
      try {
        console.log('getting tasks');
        toast.success('Generating Tasks');
        const tasks = await getApiKey(goals);
        const dataArray = JSON.parse(tasks);
        console.log(dataArray);
        if (Array.isArray(dataArray)) {
          setGeminiTasks(dataArray);
          await getUser(geminiTasks,name);
        
          setIsComplete(true);
           redirect('/Task')
        
        } else {
          console.error("Invalid data type:", typeof dataArray);
        }
        redirect('/Tasks')
      } catch (error) {
        console.error("Error fetching Gemini Tasks:", error);
      }
    }
  }, [geminiTasks, formInfo]);
        
        
       

  const getUser = async (tasks: string[],name:string, isNewDay: boolean = false) => {
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Error fetching session:", sessionError);
      return;
    }
    const user = session.user;
    if (!user) {
      console.error("Error: user is not authenticated");
      redirect('/Auth/Sighup')
    
    }

    
    // Check if the user's name already exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user data:", fetchError);
      return;
    }

    if (!existingUser || isNewDay) {
      await supabase
        .from("tasks")
        .insert([{ user_id: user.id, name, task_list: tasks }]);
        setIsComplete(true);
      
    }
  

  };

  const [currentDay, setCurrentDay] = useState<number>(new Date().getDate());
  const [prevDay, setPrevDay] = useState<number>(new Date().getDate());

  useEffect(() => {
    const date = new Date();
    const today = date.getDate();
    setCurrentDay(today);

    if (prevDay !== today) {
      setPrevDay(today);
      async function getNewTasks() {
        try {
          const tasks = await getApiKey("its a new day");
          const dataArray = JSON.parse(tasks);
          if (Array.isArray(dataArray)) {
            setGeminiTasks(dataArray);
            await getUser(dataArray,formInfo[0],true);
          } else {
            console.error("Invalid data type:", typeof tasks);
          }
        } catch (error) {
          console.error("Error fetching new tasks:", error);
        }
      }
      getNewTasks();
    }
  }, [currentDay, prevDay, formInfo]);


 /*  useEffect(() => {
    const interval = setInterval(() => {
      const day = new Date().getDate();
      if (prevDayRef.current !== day) {
        prevDayRef.current = day;
        async function getNewTasks() {
          try {
            const tasks = await getApiKey("its a new day");
            const dataArray = JSON.parse(tasks);
            if (Array.isArray(dataArray)) {
              setGeminiTasks(dataArray);
              await getUser(dataArray, formInfo[0], true);
            } else {
              console.error("Invalid data type:", typeof tasks);
            }
          } catch (error) {
            console.error("Error fetching new tasks:", error);
          }
        }
        getNewTasks();
      }
    }, 60000 * 60 * 24);
    return () => clearInterval(interval);
  }, []); */

  return (
    <main className="h-screen w-screen flex flex-col mx-auto items-center justify-center max-w-screen-md">
      <Toaster position="top-right"/>
      <section className="w-full place-self-center justify-self-center max-w-screen-md">
        <motion.div
          key={step}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="w-full max-w-screen-sm p-6 space-y-6 my-auto mx-auto rounded-lg shadow-sm"
        >
          <h1 className={`text-xl font-semibold ${isComplete ? 'hidden':'block'}`}>Get Started</h1>

          {/* Step 1: Ask for Name */}
          {step === 1&& !isComplete && (
            <Form {...nameForm}>
              <form
                className="space-y-4 max-w-screen-md"
                onSubmit={nameForm.handleSubmit((data) => {
                  console.log("Name Submitted:", data.name);
                  setFormInfo((prev) => [...prev, data.name]);
                  handleNextStep();
                })}
              >
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-left">What&apos;s your name?</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-green-500">
                  Next
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Ask About Goals */}
          {step === 2 && !isComplete && (
            <Form {...goalsForm}>
              <form
                className="space-y-10"
                onSubmit={goalsForm.handleSubmit((data) => {
                  setFormInfo((prev) => [...prev, data.goals]);
                  fetchGeminiTasks();
                  
                 
                })}
              >
                <FormField
                  control={goalsForm.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your goals?</FormLabel>
                        <FormControl>
                        <Textarea
                          placeholder="Tell me about your goals or objectives"
                          {...field}
                          rows={5}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-4 justify-between">
                  <Button
                    variant={"default"}
                    type="button"
                    className="w-full"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant={"default"}  className="w-full">
                    Finish
                  </Button>
                </div>
              </form>
            </Form>
          )}
          {
            isComplete &&(
              <div className="text-center space-y-6">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-900"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.2,
                }}
              >
                Ready to Start Your Journey?
              </motion.h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Head to your personalized dashboard and begin tracking your progress
              </p>
              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
               <Link href="/Tasks">
               <button
                 
                 className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
               >
                 Go to Dashboard
                 <ArrowRight
                   className="group-hover:translate-x-1 transition-transform duration-200"
                   size={20}
                 />
               </button>
               </Link>
              </motion.div>
            </div>
         
      
            )
          }
        </motion.div>
      </section>
    </main>
  );
}

function Page() {
  return (
    <div className="w-screen h-screen text-start">
      <GetStartedPage />
    </div>
  );
}

export default Page;
