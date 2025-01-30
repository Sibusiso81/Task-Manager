import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Book, Calendar, ChevronRight, CheckCircle, Target, Clock } from "lucide-react"
import {
  type TaskContent,
  type DailyScheduleActivity,
} from "@/lib/processTasksUtil"

interface TaskCardProps {
  date: string
  tasks: TaskContent[]
}

export function TaskCard({ date, tasks }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`h-full transition-all duration-300 ${isExpanded ? "ring-4 ring-blue-400 shadow-xl" : "hover:shadow-md"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg font-semibold">{date}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {(isExpanded || !isExpanded) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {tasks.map((task: TaskContent, index: number) => (
                    <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                      {task["Today's Focus"] && (
                        <div className="flex items-start space-x-2">
                          <Target className="h-5 w-5 text-blue-500 mt-1" />
                          <p className="font-medium text-gray-800">{task["Today's Focus"]}</p>
                        </div>
                      )}
                      {task["Goal Summary"] && (
                        <div className="flex items-start space-x-2 mt-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          <p className="text-gray-600">{task["Goal Summary"]}</p>
                        </div>
                      )}
                      {task["Daily Schedule"] && (
                        <div className="flex items-start space-x-2 mt-2">
                          <Clock className="h-5 w-5 text-purple-500 mt-1" />
                          <p className="text-gray-600">Daily Schedule Available</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-blue-300 hover:bg-blue-50">
                View Details
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{date}</DialogTitle>
                <DialogDescription className="text-gray-600">Task Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {tasks.map((task: TaskContent, index: number) => (
                  <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                    {task["Today's Focus"] && <h3 className="text-xl font-semibold mb-2">{task["Today's Focus"]}</h3>}
                    {task["Goal Summary"] && <p className="text-gray-600 mb-4">{task["Goal Summary"]}</p>}
                    {task["Actionable Steps"] && (
                      <div>
                        <h4 className="font-semibold mb-2">Actionable Steps:</h4>
                        <ul className="space-y-2">
                          {task["Actionable Steps"].map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>{step.step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {task["Suggested Resources"] && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Suggested Resources:</h4>
                        <ul className="space-y-2">
                          {task["Suggested Resources"].map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="flex items-start">
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
                    )}
                    {task["Daily Schedule"] && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Daily Schedule:</h4>
                        {Object.entries(task["Daily Schedule"]).map(([period, activities]) => (
                          <div key={period} className="mb-2">
                            <h5 className="font-medium">{period}</h5>
                            <ul className="space-y-1">
                              {activities.map((activity: DailyScheduleActivity, activityIndex: number) => (
                                <li key={activityIndex} className="flex items-center">
                                  <span className="mr-2">{activity.icon}</span>
                                  <span>
                                    {activity.time}: {activity.activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

