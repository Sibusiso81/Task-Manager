"use client"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import logout from "@/app/Auth/Actions/Actions"
import {  User,  } from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { processTasksHistory ,
    type ProcessedTask,
} from "@/lib/processTasksUtil"
import { TaskCard } from "./taskCard"

function Page() {
  const [processedTasks, setProcessedTasks] = useState<ProcessedTask[]>([]);
  const [name,setName]  = useState<string>()
  

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

      const processedTasksHistory = processTasksHistory(tasks)
/*       console.log("Processed tasks history:", processedTasksHistory)
 */      setProcessedTasks(processedTasksHistory)
 console.log(processedTasksHistory)
    }
console.log(processedTasks)
    getUser()
  })

  return (
    <div className="min-h-screen bg-white text-gray-900 w-screen p-10 space-y-4">
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

    <main className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4 py-12">
      <div className="border-l-4 border-blue-500 pl-4">
        <h2 className="text-lg font-medium text-gray-500">Task History</h2>
        <p className="text-xl text-gray-600 mb-8">Your journey to success, one task at a time</p>
      </div>

      {processedTasks ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {processedTasks.map(({ date, tasks }) => (
            <TaskCard key={date} date={date} tasks={tasks} />
            
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl">No tasks found. Time to set some goals!</p>
      )}
    </main>
  </div>
  )
}

export default Page

