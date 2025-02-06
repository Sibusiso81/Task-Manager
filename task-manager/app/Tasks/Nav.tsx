import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';
import logout from '../Auth/Actions/Actions';
function Nav() {
        const [name,setName] = useState<string>('')
    
    
    useEffect(() => {
        const getUser = async () => {
          const supabase = createClient()
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()
    
          if (sessionError || !session) {
            console.log("Error fetching session", sessionError)
            redirect("/Auth/Error")
            return
          }
    
          const user = session.user
          if (!user) {
            console.error("Error: user is not authenticated")
            redirect("/Auth/Signup")
            return
          }
    
          const { data: tasks, error: tasksError } = await supabase.from("tasks").select("*").eq("user_id", user.id)
    
          if (tasksError) {
            console.log("Error fetching tasks", tasksError)
            return
          }
    
          if (!tasks || tasks.length === 0 || !tasks[tasks.length - 1].tasks) {
            redirect("/GetStarted")
            
          }
    console.log(tasks)
    setName(tasks[0].name)
    console.log(name)
    
       
        getUser()
      }
    }
    )
    
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 pb-4 w-screen  mx-auto ">
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
      Aspire ®
    </h1>
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
  </nav>
  )
}

export default Nav