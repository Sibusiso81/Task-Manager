"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import getApiKey from "@/lib/Gemini/gemini"
import { redirect } from "next/navigation"
import { ExternalLink, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react"
import Link from "next/link"

// Define types
type ActionableStep = {
  step: string
  guidance: string[]
  time_estimate: string
  potential_challenges: string
  strategies: string
}

function Page() {
  // State variables
  const [step, setStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [formInfo, setFormInfo] = useState<string[]>([])
  const [apiKey, setApiKey] = useState<string>("")
  const [dailyFocus, setDailyFocus] = useState<string>()
  const [actionableSteps, setActionableSteps] = useState<ActionableStep[]>([])

  const [visionPurposeGoals, setVisionPurposeGoals] = useState({
    vision: "",
    purpose: "",
    specificGoals: "",
  })

  // Form schemas
  const nameSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  })

  const visionSchema = z.object({
    vision: z.string().min(10, { message: "Vision must be at least 10 characters long." }),
    purpose: z.string().min(10, { message: "Purpose must be at least 10 characters long." }),
    specificGoals: z.string().min(10, { message: "Specific goals must be at least 10 characters long." }),
  })

  const apiKeySchema = z.object({
    apiKey: z.string().min(20, { message: "API key must be at least 20 characters long." }),
  })

  // Form hooks
  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  })

  const visionForm = useForm<z.infer<typeof visionSchema>>({
    resolver: zodResolver(visionSchema),
    defaultValues: visionPurposeGoals,
  })

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { apiKey: "" },
  })

  // Handlers
  const handleNextStep = useCallback(() => setStep((prev) => prev + 1), [])
  const handlePreviousStep = useCallback(() => setStep((prev) => prev - 1), [])

  const handleInputChange = (field: keyof typeof visionPurposeGoals) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setVisionPurposeGoals((prev) => ({
      ...prev,
      [field]: value,
    }))
    visionForm.setValue(field, value)
  }

  const getUser = useCallback(
    async (tasks: string[], name: string) => {
      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.error("Error fetching session:", sessionError)
        return
      }
      const user = session.user
      if (!user) {
        console.error("Error: user is not authenticated")
        redirect("/Auth/Signup")
      }

      if (!tasks) {
        console.log("tasks not available on db:", tasks)
      }
      if (tasks && tasks.length > 0) {
        const { data, error } = await supabase
          .from("tasks")
          .insert([{ user_id: user.id, name, tasks, api_key: apiKey }])
        if (error) {
          console.log("Error inserting info to db:", error)
          toast.error("Oops, Please try again.")
        }
        if (data) {
          console.log("Insert complete")
          setIsComplete(true)
        }
      } else {
        console.error("No tasks to insert")
        toast.error("Something went wrong!")
      }
    },
    [apiKey],
  )

  const fetchGeminiTasks = useCallback(async () => {
    const [name] = formInfo
    toast.success("Generating tasks")
   
      try {
        toast.success("Compiling...")

        const tasks = await getApiKey(
          `Vision: ${visionPurposeGoals.vision}\nPurpose: ${visionPurposeGoals.purpose}\nSpecific Goals: ${visionPurposeGoals.specificGoals}`,
          apiKey,
        )
        if (!tasks) {
          toast.error("Error fetching tasks ")
          toast.error('Oops ,Please try again')

          return
        }

        const dataArray = JSON.parse(tasks)
        setActionableSteps(dataArray[0]["Actionable Steps"])
        setDailyFocus(dataArray[0]["Goal Summary"])
        if (Array.isArray(dataArray)) {
          await getUser(dataArray, name)
          setIsComplete(!isComplete)
          redirect("/Task")
        } else {
          toast.error("Invalid data type")
          setIsComplete(!isComplete)
        }
        redirect("/Tasks")
      } catch (error) {
        toast.error('Oops ,Please try again')
        console.log(error)
      
    }
  }, [apiKey, getUser, visionPurposeGoals, formInfo])

  const steps = [
    {
      title: "Define Your Vision",
      description: "Imagine your ideal future. What does success look like to you?",
      field: "vision",
      placeholder: "In year, I envision myself...",
      hint: "Think big! Consider all aspects of your life - career, personal growth, relationships, etc.",
    },
    {
      title: "Clarify Your Purpose",
      description: "What drives you? Why are these goals important to you?",
      field: "purpose",
      placeholder: "These goals matter to me because...",
      hint: "Understanding your 'why' will help keep you motivated when things get challenging.",
    },
    {
      title: "Set Specific Goals",
      description: "Break down your vision into concrete, achievable goals",
      field: "specificGoals",
      placeholder: "My specific goals are...",
      hint: "Make your goals SMART: Specific, Measurable, Achievable, Relevant, and Time-bound",
    },
  ]

  const currentStep = steps[step - 2]

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }
console.log(visionPurposeGoals)
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
          <h1 className={`text-xl font-semibold ${isComplete ? "hidden" : "block"}`}>Get Started</h1>

          {/* Step 1: Ask for Name */}
          {step === 1 && !isComplete && (
            <Form {...nameForm}>
              <form
                className="space-y-4 max-w-screen-md"
                onSubmit={nameForm.handleSubmit((data) => {
                  setFormInfo((prev) => [...prev, data.name])
                  handleNextStep()
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
                <Button type="submit" className="w-full" variant={"default"}>
                  Next
                </Button>
              </form>
            </Form>
          )}

          {/* Steps 2-4: Vision, Purpose, and Specific Goals */}
          {step >= 2 && step <= 4 && !isComplete && (
            <Form {...visionForm}>
              <form
                className="space-y-10"
                onSubmit={visionForm.handleSubmit((data) => {
                  setFormInfo((prev) => [...prev, data.vision, data.purpose, data.specificGoals])
                  setVisionPurposeGoals(data)
                  console.log(visionPurposeGoals)
                  if (step < 4) {
                    handleNextStep()
                  } else {
                    handleNextStep()
                  }
                })}
              >
                <Card className="max-w-2xl mx-auto p-6 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{currentStep.title}</h2>
                    <p className="text-gray-500">{currentStep.description}</p>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={visionForm.control}
                      name={currentStep.field as "vision" | "purpose" | "specificGoals"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={currentStep.placeholder}
                              rows={6}
                              className="w-full resize-none"
                              onChange={handleInputChange(currentStep.field as keyof typeof visionPurposeGoals)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-start gap-3 text-sm text-gray-500">
                      <Lightbulb className="h-5 w-5 flex-shrink-0" />
                      <p>{currentStep.hint}</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePreviousStep} disabled={step === 2}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <div className="space-x-1 text-sm">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span
                          key={i}
                          className={`inline-block h-2 w-2 rounded-full ${
                            i + 2 === step ? "bg-blue-500" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <Button type="submit" onClick={handleNextStep}>
                      {step === 4 ? "Next" : "Next"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </form>
            </Form>
          )}

          {/* Step 5: Ask for Gemini API Key */}
          {step === 5 && !isComplete && (
            <Form {...apiKeyForm}>
              <form
                className="space-y-10"
                onSubmit={apiKeyForm.handleSubmit((data) => {
                  setFormInfo((prev) => [...prev, data.apiKey])
                  setApiKey(data.apiKey)
                  fetchGeminiTasks()
                })}
              >
                <FormField
                  control={apiKeyForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your Google Gemini API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your API key" {...field} />
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
                  <Button variant="outline" type="button" className="w-full" onClick={handlePreviousStep}>
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
                Head to your personalized dashboard and begin tracking your progress
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Preview</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Your Journey Overview</DialogTitle>
                      <DialogDescription>Here&apos;s a summary of your goals and actionable steps.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold">{dailyFocus}</h1>
                      <p>{dailyFocus}</p>

                      <h2 className="text-md font-semibold mt-4">Actionable Steps</h2>
                      <ul className="list-disc pl-5 mt-2">
                        {actionableSteps.length > 0 ? (
                          actionableSteps.map((step, index) => <li key={index}>{step.step}</li>)
                        ) : (
                          <li>No actionable steps available yet.</li>
                        )}
                      </ul>
                    </div>
                    <DialogFooter>
                      <Link href={"/Tasks"}>
                        <Button>Agree & Continue</Button>
                      </Link>
                      <Button variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  )
}

export default Page

