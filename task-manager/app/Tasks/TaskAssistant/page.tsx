"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Avatar} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger ,DropdownMenuSeparator} from "@/components/ui/dropdown-menu"
import ReactMarkdown from "react-markdown"
import { GoogleGenerativeAI } from "@google/generative-ai";

import { useState } from "react"
import Link from "next/link"
import logout from "@/app/Auth/Actions/Actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { redirect } from "next/navigation"

interface Message {
  id: number
  role: "user" | "assistant" | "default"
  content: string
}

function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "default",
      content: "Hi! I'm John your personal assistant. What task would you like me to help you with?",
    },
  ])
  const [input, setInput] = useState("")
  const [apikey, setApiKey] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [name,setName] = useState<string>('')

 async  function taskAssistant(apiKey:string,message:string,onChunk: (chunk: string) => void){
  const geminiApiKey = apiKey;
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  systemInstruction: "You are a productivity coach and project management expert. Your role is to help users achieve their personal and professional goals by providing daily actionable suggestions. Follow these guidelines:\n\n1. **Understand the User's Goals**: Identify the user's short-term, medium-term, and long-term goals. Focus on making the goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound).\n\n2. **Incorporate Project Management Principles**:\n   - **Initiation**: Help the user define clear objectives, identify challenges, and understand why the goal is important.\n   - **Planning**: Break the goal into smaller, manageable tasks with deadlines. Suggest tools, methods, or techniques to plan effectively.\n   - **Execution**: Provide actionable steps for the day. Ensure they are clear, achievable within the user's time frame, and aligned with their overall goal.\n\n3. **Provide Personalized Resources**: Suggest relevant courses, tools, or resources to aid in achieving their goals. Ensure the suggestions are high-quality, diverse, and accessible.\n\n4. **Track Progress**: Encourage users to reflect on progress, highlight what went well, and areas for improvement.\n\n5. **Tone and Language**: Be encouraging, positive, and concise. Use simple language and actionable suggestions.\n\n**Output Structure**:\n- Goal Summary: A quick summary of the user's goal.\n- Today's Focus: The primary focus or theme for the day.\n- Actionable Steps: 3-5 specific steps to take today.\n- Suggested Resources: At least one course, article, or tool to explore.\n- Reflective Question: A question for the user to reflect on at the end of the day.\n\nExample:\n---\n**Goal Summary**: Complete a personal portfolio website by the end of the month.\n\n**Today's Focus**: Create the homepage layout.\n\n**Actionable Steps**:\n1. Sketch a basic wireframe for the homepage using pen and paper or a digital tool like Figma.\n2. Choose a color palette and typography style that matches your theme.\n3. Start coding the header and navigation bar.\n4. Test the responsiveness of the design on both desktop and mobile.\n\n**Suggested Resources**:\n- FreeCodeCamp tutorial on responsive web design.\n- Color palette generator: [Coolors](https://coolors.co/).\n\n**Reflective Question**: What part of today’s work did you find most challenging, and how could you make it easier tomorrow?\n\n---\n\n### **Courses and Resources**\n- **Project Management Basics**:\n  - *Coursera*: [Introduction to Project Management](https://www.coursera.org/)\n  - *edX*: [Fundamentals of Project Planning and Management](https://www.edx.org/)\n- **Time Management & Productivity**:\n  - *Skillshare*: Productivity Masterclass – Principles and Tools\n  - Books: *Atomic Habits* by James Clear\n- **Goal Achievement Frameworks**:\n  - *YouTube*: Videos on OKRs (Objectives and Key Results)\n  - Templates: Trello, Notion, or Asana templates for goal tracking.\n\n\n\n\n\n\n",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessageStream(message);
   
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    onChunk(chunkText);
  }
   
  }
  
 return run();
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const assistantMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: "",
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      await taskAssistant(apikey, input, (chunk) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage.role === "assistant") {
            return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunk }]
          }
          return prev
        })
      })
    } catch (error) {
      console.error("Error in streaming response:", error)
      toast.error("An error occurred while processing your request.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      if (apikey !== "") return

      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        toast.error("Error getting session")
        redirect("/Auth/Error")
      }
      const user = session.user

      if (!user) {
        console.error("Error: user is not authenticated")
        redirect("/Auth/Signup")
      }
      const { data: tasks, error: tasksError } = await supabase.from("tasks").select("*").eq("user_id", user.id)

      if (tasksError) {
        console.log("Error fetching db", tasksError)
        return
      }
      if (!tasks || tasks.length === 0 || !tasks[0].api_key) {
        redirect("/GetStarted")
      }
      setName(tasks[0].name)

      setApiKey(tasks[0].api_key)
    }
    getUser()
  }, [apikey])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Corrected dependency

  return (
    <div className="flex flex-col h-screen bg-white p-4 md:p-10">
      {/* Header */}
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
      <Link href={"/Tasks/Tasks"}>
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
      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          

          {/* Chat Messages */}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-1 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8">
                 <p>✦</p>
                </Avatar>
              )}
              <Card className={`p-3 max-w-[80%] ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white"}`}>
                <ReactMarkdown className={`text-sm ${message.role === "assistant" ? "prose-sm prose-slate" : ""}`}>
                  {message.content}
                </ReactMarkdown>
              </Card>
              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                 
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </footer>
    </div>
  )
}

export default Page

