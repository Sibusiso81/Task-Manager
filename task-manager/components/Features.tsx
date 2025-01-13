import React from 'react'
import { BarChart2, Calendar,  Target, TrendingUp,  Zap } from 'lucide-react';

function Features() {
  return (
    <section
         id="Features"
           className="h-fit  lg:w-h-screen w-screen flex flex-col items-center justify-center 
         space-y-16 p-6  md:space-y-10  md:p-10 lg:p-20 "/* w-screen h-screen p-4 space-y-4 md:space-y-10 */
         >
           <h1 className="text-3xl font-bold place-self-start">What can you expect ? </h1>
           <div className="grid grid-cols-4 gap-4 gap-y-10 md:gap-y-10 ">
             {/*   <div className="col-span-4 md: flex flex-col space-y-2">
               <h1 className="text-neutral-600">01</h1>
               <h2 className="text-lg font-medium">Create an Aspire account</h2>
               <p>Click on teh get started button to sign up and ,your done.</p>
             </div> */}
   
             {[
               {
                 icon: <Zap className="w-5 h-5"/>,
                 heading: "AI-Powered Task Generation ",
                 description: "Automatically generate personalized tasks based on your goals, timelines, and priorities.",
               },
               {
                 icon: <Target className="w-5 h-5"/>,
                 heading: "Smart Goal Planning",
                 description:
                   "Break down long-term goals into actionable milestones using project management principles.",
               },
               {
                 icon: <TrendingUp className="w-5 h-5"/>,
                 heading: " Dynamic Progress Tracking",
                 description:
                   "Visualize your progress with interactive charts, kanban boards, and task completion rates.",
               },
               {
                 icon: <Calendar className="w-5 h-5"/>,
                 heading: "Daily Actionable Suggestions",
                 description:
                   "Get tailored daily recommendations to stay on track and maximize productivity. ",
               },
               {
                 icon: <BarChart2 className="w-5 h-5"/>,
                 heading: "Performance Management Insights",
                 description:
                   "Based on your tasks complition ,a set of analytics will be generated to assess your performance on your tasks an a review provided ",
               }
             ].map((feature, index) => (
               <div
                 key={index}
                 className=" border-l-2 border-l-neutral-600/30 col-span-4 md:col-span-2 lg:col-span-1 space-y-2 pl-3"
               >
                 <h1 className="text-blue-600">{feature.icon}</h1>
                 <h2 className="text-lg font-medium">{feature.heading}</h2>
                 <p className="text-muted-foreground">{feature.description}</p>
               </div>
             ))}
           </div>
         </section>
  )
}

export default Features