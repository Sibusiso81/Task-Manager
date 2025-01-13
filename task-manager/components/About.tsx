import { Calendar, CheckCircle, Target, TrendingUp } from 'lucide-react'
import React from 'react'

function About() {
  return (
    <section className="w-screen  h-fit lg:h-screen bg-white md:p-10  " id="About">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-wrap items-end justify-center mb-16">
        <div className="w-full lg:w-5/12 xl:w-5/12 text-left mb-8 lg:mb-0">
          <div className="inline-flex items-center mb-5  rounded-full px-6 py-2">
            <Target className="w-6 h-6 text-neutral-950 mr-3" />
            <span className="text-lg font-medium ">
              Transform Your Goals
            </span>
          </div>
          <h2 className="text-4xl font-bold  leading-tight">
            Transform Big Dreams into Daily Victories
          </h2>
        </div>
        <div className="w-full lg:w-6/12 xl:w-6/12 lg:ml-auto text-left">
          <span className="block text-xl font-semibold text-black mb-2">
            Your path to success, one step at a time
          </span>
          <p className="text-muted-foreground lg:w-4/5">
            We help you break down your ambitious goals into manageable
            daily actions, making the path to success clear and achievable.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {[
          {
        
            icon: <Target className="h-8 w-8" />,
            title: "Set Clear Goals",
            description:
              "Define your long-term objectives with clarity and purpose",
            stat: "Goal Setting",
          },
          {
            icon: <Calendar className="h-8 w-8" />,
            title: "Daily Actions",
            description:
              "Get personalized daily tasks that lead to your bigger goals",
            stat: "Daily Tasks",
          },
          {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Track Progress",
            description:
              "Monitor your advancement with intuitive progress tracking",
            stat: "Success Rate",
          },
          {
            icon: <TrendingUp className="h-8 w-8" />,
            title: "Achieve More",
            description:
              "Watch your consistent efforts compound into major achievements",
            stat: "Achievement",
          },
        ].map((item, index) => (
          <div key={index} className="relative last:border-r-0">
            <div className="p-8 text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto relative z-10 text">
                  <div className="text-blue-600">{item.icon}</div>
                </div>
              </div>
              <span className="text-xl font-semibold text-gray-900 block mb-2">
                {item.title}
              </span>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-col w-full">
                <div className="py-3 text-sm font-bold uppercase">
                  <span>{item.stat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  </section>
  )
}

export default About