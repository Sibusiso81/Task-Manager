import React from "react";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from 'lucide-react'
import { z } from "zod";

function ReflectionForm() {
  const [satisfaction, setSatisfaction] = useState(5);
  const [timeDifference, setTimeDifference] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
const [reflectionSent,setReflectionSent] = useState<boolean>(false)
 
  /* Validate form using zod  */
  const tasksFormSchema = z.object({
    satisfaction: z.number().min(1).max(10),
    timeDifference: z.number().int(),
    tasksCompleted: z.number().int().min(0),
    totalTasks: z.number().int().min(1, "Total tasks must be at least 1"),
    adherence: z.enum(["excellent", "good", "fair", "poor"]),
    obstacles: z.string().optional(),
    support: z.string().optional(),
  });
  const {
    register,
    handleSubmit,
    formState:{errors},
    setValue,
    watch,
  } = useForm<z.infer<typeof tasksFormSchema>>({
    resolver:zodResolver(tasksFormSchema),
    defaultValues:{
        satisfaction: 5,
      timeDifference: 0,
      tasksCompleted: 0,
      totalTasks: 0,
    }
  })
   /* Return data that can be accesed later by the analytics component */
   const onSubmit = (data:FormData) => {
    
    // Handle form submission logic here
    
    console.log("Form submitted",data);
  };
  
  /* 
  
  `watchTasksCompleted = watch("tasksCompleted")` creates a variable that will always contain the current value of the "tasksCompleted" field in your form. Whenever this value changes (i.e., when the user inputs a new number), `watchTasksCompleted` will be updated automatically.
Similarly, `watchTotalTasks = watch("totalTasks")` creates a variable that always contains the current value of the "totalTasks" field.
  
  
Things to fix or imporve 

Frontend
-Navbar on landing page
-Add api key form
-Center things properly on tasks
-Concider adding s dialogue to  display analytics

-Also add a begin new day button
-This is where we will pass in the previos tasks,new tasks,support needed/imporvments

Analytics 
Performance measures
--Quality of work based on own satisfaction with tasks compltions
--Quantity number of actual tasks completed against the actual number of tasks
--Time ,actual time against the expected amount of time for complition

Infered behaviours low / neutral / good colors should change
-based on tasks completed/number of tasks 
initiative and proactivity


-Learning and development 
work quality
-Goal setting and achivement 

Backend
-Update tasks once the review is given



*/
const watchTasksCompleted = watch("tasksCompleted")
const watchTotalTasks = watch("totalTasks")
  return (
    <div className="min-h-screen w-fit mx-auto p-6 flex items-center justify-center">
   {
    !reflectionSent
    ? <Card className=" max-w-3xl ">
    <CardHeader className="bg-blue-600 w-full text-white rounded-t-lg">
      <CardTitle className="text-lg md:text-2xl font-bold text-center">Daily Reflection</CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit(()=>onSubmit)} className="space-y-6 p-6">


        <div className="w-fit grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Label htmlFor="satisfaction" className="text-lg font-semibold text-gray-700">Task Satisfaction</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="satisfaction"
                min={1}
                max={10}
                step={1}
                value={[watch("satisfaction")]}
                onValueChange={(value) => setValue("satisfaction", value[0])}
                className="flex-grow"
              />
              <span className="text-2xl font-bold ">{watch("satisfaction")}</span>
            </div>
            {errors.satisfaction && (
              <p className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{errors.satisfaction.message}</p>
            )}
          </div>

        
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-700">Task Completion Rate</Label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Completed"
              {...register("tasksCompleted", { valueAsNumber: true })}
              className="text-center"
            />
            <span className="text-2xl font-bold text-gray-500">/</span>
            <Input
              type="number"
              placeholder="Total"
              {...register("totalTasks", { valueAsNumber: true })}
              className="text-center"
            />
          </div>
          <Progress value={(watchTasksCompleted / watchTotalTasks) * 100 || 0} className="h-2" />
          {(errors.tasksCompleted || errors.totalTasks) && (
            <p className="text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.tasksCompleted?.message || errors.totalTasks?.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="adherence" className="text-lg font-semibold text-gray-700">Schedule Adherence</Label>
          <Select onValueChange={(value) => setValue("adherence", value as z.infer<typeof tasksFormSchema>["adherence"])}>
            <SelectTrigger id="adherence">
              <SelectValue placeholder="How well did you stick to your schedule?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent (90-100%)</SelectItem>
              <SelectItem value="good">Good (70-89%)</SelectItem>
              <SelectItem value="fair">Fair (50-69%)</SelectItem>
              <SelectItem value="poor">Needs Improvement (Below 50%)</SelectItem>
            </SelectContent>
          </Select>
          {errors.adherence && (
            <p className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{errors.adherence.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="obstacles" className="text-lg font-semibold text-gray-700">Obstacles Encountered</Label>
          <Textarea 
            id="obstacles" 
            {...register("obstacles")} 
            placeholder="What challenges did you face?" 
            className="h-24 resize-none" 
          />
          {errors.obstacles && (
            <p className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{errors.obstacles.message}</p>
          )}
        </div>

       

        <div className="space-y-4">
          <Label htmlFor="support" className="text-lg font-semibold text-gray-700">Support Needed</Label>
          <Textarea 
            id="support" 
            {...register("support")} 
            placeholder="What resources would help you improve?" 
            className="h-24 resize-none" 
          />
          {errors.support && (
            <p className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{errors.support.message}</p>
          )}
        </div>

        <Button type="submit" variant={'default'} className="w-full b text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Submit Your Progress
        </Button>
      </form>
    </CardContent>
  </Card>
    :<div className="flex flex-row space-y-3 ">
        <Button variant={'default'}>Start new day</Button>
        <Button variant={'link'}>Performance review</Button>

    </div>
   }
  </div>
  );
}

export default ReflectionForm;