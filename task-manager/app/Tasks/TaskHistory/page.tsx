'use client'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import logout from '@/app/Auth/Actions/Actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Calendar, ChevronRight, User, CheckCircle, Target } from 'lucide-react';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'

type Task = {
    api_key: string,
    created_at: string,
    id: number,
    tasks: string[],
    updated_at: null,
    user_id: string,
};

type TasksHistory = {
    [key: string]: Task[];
};

type ProcessedTask = {
    date: string,
    tasks: any[]
};
interface ActionableStep {
    step: string;
    guidance: string[];
    time_estimate: string;
    potential_challenges: string;
    strategies: string;
  }
  type Resource = {
    title: string;
    type: string;
    url: string;
    description?: string;
  };

function Page() {
    const [, setTasksCompleteData] = useState<TasksHistory | undefined>(undefined);
    const [processedTasks, setProcessedTasks] = useState<ProcessedTask[]>([]);
    const [, setSelectedTask] = useState<Task | null>(null)
    const [expandedCard, setExpandedCard] = useState<string | null>(null)
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

            const tasksHistory: TasksHistory = tasks.reduce((acc: TasksHistory, task: Task) => {
                const date = task.created_at.split('T')[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(task);
                return acc;
            }, {});

            setTasksCompleteData(tasksHistory);

            const processed: ProcessedTask[] = Object.entries(tasksHistory).map(([date, tasks]) => {
                const taskItems = tasks.flatMap(task => task.tasks.map(taskItem => JSON.parse(taskItem)));
                return { date, tasks: taskItems };
            });

            setProcessedTasks(processed);
            console.log(tasksHistory);
            console.log(processed);
        };

        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 w-screen p-10 space-y-4">
       <nav className="flex items-center justify-between border-b border-gray-200 pb-4 w-full max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Aspire ®
                </h1>
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-100 p-2 rounded-full">
                    <User />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    
                    <DropdownMenuItem>
                      <div className='flex flex-col items-center justify-center'>
                      
                      <button
                        onClick={logout}
                        className="px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
                      >
                        Log out
                      </button>
                      <Link href={'/Tasks'} className='w-full px-6 py-2'>
                        <Button className='px-6 py-2 ' variant={'default'}>Back</Button>
                        </Link>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4 py-12">
      <div className="border-l-4 border-blue-500  pl-4">
                  <h2 className="text-lg font-medium text-gray-500">
                    Task Hisotry
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">Your journey to success, one task at a time</p>
                </div>
        

        {processedTasks.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {processedTasks.map(({ date, tasks }) => (
              <motion.div
                key={date}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`h-full transition-all duration-300 ${expandedCard === date ? "ring-4 ring-blue-400 shadow-xl" : "hover:shadow-md"}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg font-semibold">{date}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedCard(expandedCard === date ? null : date)}
                    >
                      <ChevronRight
                        className={`h-5 w-5 transition-transform duration-300 ${expandedCard === date ? "rotate-90" : ""}`}
                      />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {(expandedCard === date || !expandedCard) && tasks.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                              <Target className="h-5 w-5 text-blue-500 mt-1" />
                              <p className="font-medium text-gray-800">{tasks[0]["Today's Focus"]}</p>
                            </div>
                            {expandedCard === date && (
                              <>
                                <div className="flex items-start space-x-2">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                                  <p className="text-gray-600">{tasks[0]["Goal Summary"]}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-600 mb-2 flex items-center">
                                    <Book className="h-4 w-4 mr-2" />
                                    Suggested Resources:
                                  </h4>
                                  <ul className="space-y-1">
                                    {tasks[0]["Suggested Resources"].map((resource: Resource, index: number) => (
                                      <li key={index}>
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:underline"
                                        >
                                          {resource.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                  {tasks.length > 0 && (
                    <CardFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-blue-600">
                              {tasks[0]["Today's Focus"]}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">{tasks[0]["Goal Summary"]}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-blue-600 mb-2">Actionable Steps:</h4>
                              <ul className="space-y-2">
                                {tasks[0]["Actionable Steps"].map((action: ActionableStep, index:number) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>{action.step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-600 mb-2">Suggested Resources:</h4>
                              <ul className="space-y-2">
                                {tasks[0]["Suggested Resources"].map((resource: Resource, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <Book className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                    
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {resource.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              onClick={() => setSelectedTask(tasks[0])}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Mark as Complete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl">No tasks found. Time to set some goals!</p>
        )}
      </main>
    </div>
    );
}

export default Page;
