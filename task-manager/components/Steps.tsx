import React from "react";

function Steps() {
  return (
    <section
      id="Steps"
      className="flex flex-col justify-center w-screen h-fit md:h-screen p-6 md:p-10 lg:p-20 space-y-10 "
    >
      <h1 className="text-2xl font-bold place-self-start">How it works </h1>
      <div className="grid grid-cols-3 gap-4 gap-y-6">
        {[
          {
            stepNumber: "01",
            heading: "Create a Aspire acccount ",
            description: "Click on the get started button and sign up ",
          },
          {
            stepNumber: "02",
            heading: "Set your goals",
            description:
              "Define your long-term objectives with clarity and purpose",
          },
          {
            stepNumber: "03",
            heading: " Head to your dashboard  ",
            description:
              "Find daily actionable tasks on your dashboard that will help you achive your goals",
          },
          {
            stepNumber: "04",
            heading: "Track your progress",
            description:
              "Based on your tasks complition ,a set of analytics will be generated to assess your performance on your tasks an a review provided ",
          },
        ].map((step, index) => (
          <div
            key={index}
            className="  col-span-3  md:col-span-1 space-y-2 pl-3"
          >
            <h1 className="text-blue-600">{step.stepNumber}</h1>
            <h2 className="text-lg font-medium">{step.heading}</h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Steps;
