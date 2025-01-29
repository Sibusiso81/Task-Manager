"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Award, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import InferredBehaviors from "./inferredBehaviours";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Confetti, type ConfettiRef, } from "@/components/ui/confetti"
import getApiKey from "@/lib/Gemini/gemini"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
interface MetricProps {
  icon: React.ReactNode
  title: string
  value: number,
  description: string
}


const Metric = ({ icon, title, value, description }: MetricProps) => (
  <Card className="overflow-hidden" >
    <CardHeader className="space-y-1 flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toFixed(1)}</div>
     
    </CardContent>
    <CardFooter>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardFooter>
  </Card>
)

interface TaskCompletionCelebrationProps {
  satisfaction: number;
  completionTimePercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  obsticles?:string ;
  support?:string;
  apikey:string;
  
}

interface MetricData {
  quality: number;
  grade: string;
  fill: string;
}

interface MetricConfig {
  [key: string]: {
    label: string;
  };
}

export function TaskCompletionCelebration({
  satisfaction,
  completionTimePercentage,
  tasksCompleted,
  totalTasks,
  obsticles,
  support,
  apikey,
}: TaskCompletionCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
const [newDay,setNewDay]= useState<boolean>(false)
  const workQualityDataConfig: MetricConfig = {
    grade: {
      label: "Work Quality",
    },
  };

  const workQuantityDataConfig: MetricConfig = {
    quantity: {
      label: "Quantity",
    },
  };

  const WorkComplitionTimeDataConfig: MetricConfig = {
    quantity: {
      label: "Time",
    },
  };

  const colorSet = ["#dc2626", "#ea580c", "#16a34a"];

  const getWorkQualityData = (satisfaction: number): MetricData[] => {
    let fillColor = "";
    let workGrade = "";
    if (satisfaction <= 4) {
      fillColor = colorSet[0];
      workGrade = "Bad";
    } else if (satisfaction <= 7) {
      fillColor = colorSet[1];
      workGrade = "Good";
    } else {
      fillColor = colorSet[2];
      workGrade = "Great";
    }

    return [
      {
        quality: satisfaction,
        grade: workGrade,
        fill: fillColor,
      },
    ];
  };

  const getWorkComplitionTimeData = (
    completionTimePercentage: number
  ): MetricData[] => {
    let fillColor = "";
    let workGrade = "";
    if (completionTimePercentage <= 4) {
      fillColor = colorSet[0];
      workGrade = "Bad";
    } else if (satisfaction <= 7) {
      fillColor = colorSet[1];
      workGrade = "Good";
    } else {
      fillColor = colorSet[2];
      workGrade = "Great";
    }

    return [
      {
        quality: satisfaction,
        grade: workGrade,
        fill: fillColor,
      },
    ];
  };

  const getWorkQuantityData = (
    totalTasks: number,
    tasksCompleted: number
  ): MetricData[] => {
    let fillColor = "";
    let qualityGrade = "";
    if (tasksCompleted < totalTasks) {
      fillColor = colorSet[1];
      qualityGrade = "Bad";
    } else if (tasksCompleted === totalTasks) {
      fillColor = colorSet[2];
      qualityGrade = "Great";
    }

    return [
      {
        quality: (tasksCompleted / totalTasks) * 10,
        grade: qualityGrade,
        fill: fillColor,
      },
    ];
  };

  const workQualityData = getWorkQualityData(satisfaction);
  const workQuantityData = getWorkQuantityData(totalTasks, tasksCompleted);
  const workComplitionTimeData = getWorkComplitionTimeData(
    completionTimePercentage
  );

  const metrics = [
    {
      icon: <Award className="h-4 w-4 text-yellow-500" />,
      title: "Quality",
      value: parseFloat(workQualityData[0].quality.toFixed(1)),
      description: "Tasks Satisfaction Score",
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      title: "Quantity",
      value: parseFloat(workQuantityData[0].quality.toFixed(1)),
      description: "Task Completion Rate",
    },
    {
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      title: "Time",
      value: parseFloat(completionTimePercentage.toFixed(1)),
      description: "Task Completion Time Score",
    },
  ];

  const handleNewDay = async(apiKey:string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // Add your logic for starting a new day here
    const newDayText = `its a new day , obsticles i faces previously ${obsticles} and to impove my experiance and progress the following support would be helpfull ${support} ,take these into consideration before suggesting new days tasks`;
    console.log(newDayText);
  
    const geminiResponse = await getApiKey(newDayText, apiKey);

    const newTasks = JSON.parse(geminiResponse);
    const supabase = createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log("Error fetching session", sessionError);
      redirect("/Auth/Error");
    } else {
      const user = session.user;
      if (!user) {
        console.error("Error: user is not authenticated");
        redirect("/Auth/Signup");
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert([{ tasks: newTasks, user_id: user.id }]);
        if (data) {
          console.log("Insert Successful");
          setNewDay(true);
        }

        if (error) {
          console.log("Failed to inset new tasks:", error);
        }
        if (!error) {
          window.location.reload();
        }
        if (obsticles && support) {
          console.log(newDayText);
        }
        newDay ? window.location.reload() : null;
  };
}
  }

  /* 
    const handleNewDay = async () => {
    console.log("handling new day");
    const newDayText = `its a new day , obsticles i faces previously ${obsticles} and to impove my experiance and progress the following support would be helpfull ${support} ,take these into consideration before suggesting new days tasks`;
    console.log(newDayText);
    const geminiResponse = await getApiKey(newDayText, apiKey);

    const newTasks = JSON.parse(geminiResponse);
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log("Error fetching session", sessionError);
      redirect("/Auth/Error");
    } else {
      const user = session.user;
      if (!user) {
        console.error("Error: user is not authenticated");
        redirect("/Auth/Signup");
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert([{ tasks: newTasks, user_id: user.id }]);
        if (data) {
          console.log("Insert Successful");
          setNewDay(true);
        }

        if (error) {
          console.log("Failed to inset new tasks:", error);
        }
        if (!error) {
          window.location.reload();
        }
        if (obsticles && support) {
          console.log(newDayText);
        }
        newDay ? window.location.reload() : null;
      }
    }
  };
  
  
  */

  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="  space-y-8 w-full "
    >
      <div className="relative w-full">
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
          onMouseEnter={() => {
            confettiRef.current?.fire({});
          }}
        />
        <div className="text-center">
          <motion.h2
            className="text-3xl font-bold text-primary mb-2"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            Congratulations!
          </motion.h2>
          <p className="text-muted-foreground">
            You&apos;ve completed all your tasks for the day. Great job!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Metric {...metric} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={()=>handleNewDay} className=" overflow-hidden">
          <span className="relative z-10">Start New Day</span>
          {showConfetti && (
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sparkles className="w-full h-full text-yellow-500" />
            </motion.div>
          )}
        </Button>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>

          <DrawerContent className="max-h-[70vh] overflow-x-hidden overflow-hidden">
            <DrawerHeader className="place-self-start">
              <DrawerTitle>Performance analytics</DrawerTitle>
              <DrawerDescription>
                View your daily performance data
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <div className="flex flex-col ">
                <div className="flex flex-col w-full ">
                  <div className="flex flex-col md:flex-row overflow-hidden h-fit items-center">
                    {[
                      {
                        title: "Quality",
                        description: "Tasks Satisfaction Score",
                        data: workQualityData,
                        config: workQualityDataConfig,
                        grade: workQualityData[0].grade,
                        fill: workQualityData[0].fill,
                        value: workQualityData[0].quality.toFixed(1),
                      },
                      {
                        title: "Quantity",
                        description: "Number of completed tasks",
                        data: workQuantityData,
                        config: workQuantityDataConfig,
                        grade: workQuantityData[0].grade,
                        fill: workQuantityData[0].fill,
                        value: workQuantityData[0].quality.toFixed(1),
                      },
                      {
                        title: "Time",
                        description: "Task Completion Time Score",
                        data: workComplitionTimeData,
                        config: WorkComplitionTimeDataConfig,
                        grade: workComplitionTimeData[0].grade,
                        fill: workComplitionTimeData[0].fill,
                        value: completionTimePercentage.toFixed(1),
                      },
                    ].map((metric, index) => (
                      <Card
                        key={index}
                        className="flex flex-col w-fit h-fit shadow-none border-none mx-auto"
                      >
                        <CardHeader className="items-center pb-0">
                          <CardTitle className="text-sm font-medium">
                            {metric.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-muted-foreground">
                            {metric.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-fit flex-1 pb-0">
                          <ChartContainer
                            config={metric.config}
                            className="w-full aspect-square max-w-[300px] mx-auto items-center h-fit"
                          >
                            <RadialBarChart
                              data={metric.data}
                              width={200}
                              height={200}
                              innerRadius={60}
                              outerRadius={80}
                              barSize={10}
                              startAngle={0}
                              endAngle={360}
                            >
                              <PolarRadiusAxis
                                tick={false}
                                axisLine={false}
                                domain={[0, 10]}
                              />
                              <RadialBar
                                dataKey="quality"
                                background
                                fill={metric.fill}
                                cornerRadius={5}
                              />
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-foreground text-lg font-bold"
                              >
                                {metric.value}
                              </text>
                            </RadialBarChart>
                          </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 font-medium leading-none">
                            Current Grade: {metric.grade}
                          </div>
                          <div className="text-wrap leading-none text-muted-foreground ">
                            Based on {metric.description.toLowerCase()}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <InferredBehaviors
                      satisfaction={satisfaction}
                      taskCompletionRate={tasksCompleted / totalTasks}
                      timeEfficiency={completionTimePercentage}
                    />
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </motion.div>
  );
}