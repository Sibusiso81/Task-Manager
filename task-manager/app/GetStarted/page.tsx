"use client";
import React, { useCallback, useState } from "react";
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

import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

function GetStartedPage() {
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [geminiTasks, setGeminiTasks] = useState<string[]>([]);
  const [formInfo, setFormInfo] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const handleNextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const handlePreviousStep = useCallback(() => setStep((prev) => prev - 1), []);

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  
  const getUser = useCallback(async (tasks: string[], name: string) => {
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Error fetching session:", sessionError);
      return;
    }
    const user = session.user;
    if (!user) {
      console.error("Error: user is not authenticated");
      redirect("/Auth/Signup");
    }

    if (!tasks) {
      console.log("tasks not avaliable on db:", tasks);
    }
    if (tasks && tasks.length > 0) {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ user_id: user.id, name, tasks, api_key: apiKey }]);
      if (error) {
        console.log("Error inserting info to db:", error);
      }
      if (data) {
        console.log("Insert complete");
        setIsComplete(true);
      }
    } else {
      console.error("No tasks to insert");
    }
  }, [apiKey]);

  const fetchGeminiTasks = useCallback(async () => {
    const [name, goals] = formInfo;

    if (goals) {
      console.log(`combined goals${typeof goals}`);
      console.log(`goals ${goals} ,name: ${name}`);
    }
    if (goals) {
      try {
        console.log("getting tasks");
        toast.success("Generating Tasks");
        const tasks = await getApiKey(goals, apiKey);
        if (!tasks) {
          console.log("Error fetching tasks ");
          return;
        }
        const dataArray = JSON.parse(tasks);
        console.log(dataArray);
        if (Array.isArray(dataArray)) {
          setGeminiTasks(dataArray);
          await getUser(geminiTasks, name);
          setIsComplete(true);
          redirect("/Task");
        } else {
          console.error("Invalid data type:", typeof dataArray);
        }
        redirect("/Tasks");
      } catch (error) {
        console.error("Error fetching Gemini Tasks:", error);
      }
    }
  }, [formInfo, apiKey, getUser]);
  

  
  const nameSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  });

  const goalsSchema = z.object({
    goals: z
      .string()
      .min(10, { message: "Please provide more details about your goals." }),
  });

  const apiKeySchema = z.object({
    apiKey: z
      .string()
      .min(20, { message: "API key must be at least 20 characters long." }),
  });
  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { apiKey: "" },
  });
  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const goalsForm = useForm<z.infer<typeof goalsSchema>>({
    resolver: zodResolver(goalsSchema),
    defaultValues: { goals: "" },
  });

  return (
    <main className="h-screen w-screen flex flex-col mx-auto items-center justify-center max-w-screen-md">
      <Toaster position="top-right" />
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
          <h1
            className={`text-xl font-semibold ${
              isComplete ? "hidden" : "block"
            }`}
          >
            Get Started
          </h1>

          {/* Step 1: Ask for Name */}
          {step === 1 && !isComplete && (
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
                      <FormLabel className="text-left">
                        What&apos;s your name?
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" variant={"default"}>
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
                  handleNextStep();
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-4 justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-full">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 3: Ask for Gemini API Key */}
          {step === 3 && !isComplete && (
            <Form {...apiKeyForm}>
              <form
                className="space-y-10"
                onSubmit={apiKeyForm.handleSubmit((data) => {
                  console.log("API Key Submitted:", data.apiKey);
                  setFormInfo((prev) => [...prev, data.apiKey]);
                  setApiKey(data.apiKey)
                  fetchGeminiTasks();
                })}
              >
                <FormField
                  control={apiKeyForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your Google Gemini API Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your API key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500 mt-2">
                        Don&apos;t have an API key?{" "}
                        <a
                          href="https://makersuite.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline inline-flex items-center"
                        >
                          Get one from Google AI Studio
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </p>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-4 justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-full">
                    Finish
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {isComplete && (
            <div className="text-center space-y-6">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Ready to Start Your Journey?
              </motion.h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Head to your personalized dashboard and begin tracking your
                progress
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/Tasks">
                  <Button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 group">
                    Go to Dashboard
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-200"
                      size={20}
                    />
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
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
