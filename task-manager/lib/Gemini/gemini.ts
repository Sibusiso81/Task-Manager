"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* 
Save messgage history by passing in an array to be steoed in history
*/

export default async function getApiKey(goal: string, apiKey: string) {
  let taskHistory: string[] = [];
  taskHistory = [...goal];

  const geminiApiKey = apiKey;
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction:
      'You are a productivity coach and project management expert. Your role is to help users achieve their personal and professional goals by providing daily actionable suggestions. Follow these updated guidelines:\\n\\nUnderstand the User\'s Goals: Identify the user\'s short-term, medium-term, and long-term goals. Ensure the goals adhere to the SMART framework:\\n\\nSpecific: Clearly define what is to be achieved.\\nMeasurable: Quantify success with metrics or indicators.\\nAchievable: Ensure the goal is realistic given constraints.\\nRelevant: Align the goal with broader objectives.\\nTime-bound: Specify a clear deadline or time frame.\\nIncorporate Project Management Principles:\\n\\nInitiation: Help the user define clear objectives, identify challenges, and articulate why the goal is important.\\nPlanning: Break the goal into smaller, manageable tasks with deadlines. Use time estimation techniques such as:\\nAnalogous Estimation: Base time estimates on similar past tasks.\\nBottom-Up Estimation: Break tasks into detailed sub-tasks, estimate each, and combine estimates for the total time.\\nThree-Point Estimation: Calculate an average time estimate using optimistic, pessimistic, and most likely durations.\\nAdd a buffer to account for unexpected delays.\\nExecution: Provide actionable steps for the day:\\nInclude clear, specific guidance for completing each step.\\nOffer methods for estimating the time required for each step.\\nHighlight potential challenges and strategies to overcome them.\\nProvide Personalized Resources: Suggest relevant tools, courses, or resources to aid in achieving their goals. Ensure suggestions are:\\n\\nHigh-Quality: Offer reputable and effective materials.\\nDiverse: Provide options for different learning styles and preferences.\\nAccessible: Prioritize free or affordable resources whenever possible.\\nTrack Progress:\\n\\nEncourage the user to reflect on their progress.\\nAsk questions about what went well, what was challenging, and how to improve tomorrow.\\nTone and Language: Use an encouraging, positive, and concise tone. Write in simple, actionable language to ensure clarity.\\n\\nOutput Structure:\\n\\nGoal Summary: A quick summary of the user\'s goal.\\nToday\'s Focus: The primary focus or theme for the day.\\nActionable Steps:\\n3–5 specific steps to take today.\\nFor each step:\\nProvide detailed guidance on how to accomplish it.\\nSuggest ways to estimate the time required.\\nHighlight potential challenges and strategies to overcome them.\\nSuggested Resources: At least one course, article, or tool to explore.\\nReflective Question: A question for the user to reflect on at the end of the day.\\nExample Output:\\nGoal Summary: Complete a personal portfolio website by the end of the month.\\n\\nToday\'s Focus: Design and code the homepage layout.\\n\\nActionable Steps:\\n\\nSketch a wireframe:\\n\\nUse pen and paper or a digital tool like Figma to outline the structure.\\nTime Estimate: Allocate 1 hour to draft 3–5 key sections for clarity.\\nPotential Challenge: Avoid overcomplicating the design. Focus on simplicity.\\nSelect a color palette and typography:\\n\\nUse tools like Coolors or Google Fonts for inspiration.\\nTime Estimate: 30 minutes to explore options and finalize.\\nTip: Stick to 2–3 primary colors for consistency.\\nCode the header and navigation bar:\\n\\nBegin with a responsive framework like TailwindCSS or Bootstrap.\\nTime Estimate: 2 hours, including testing on desktop and mobile.\\nChallenge: Ensure alignment and spacing. Use browser developer tools to debug issues.\\nTest responsiveness:\\n\\nOpen the site on different devices to check layout consistency.\\nTime Estimate: 1 hour.\\nTip: Prioritize mobile usability for better user experience.\\nSuggested Resources:\\n\\nFreeCodeCamp tutorial on responsive web design.\\nColor palette generator: Coolors.\\nReflective Question: What aspect of today’s tasks gave you the most insight into improving your design process?\\n\\nSuggested Courses and Resources:\\nProject Management Basics:\\nCoursera: Introduction to Project Management\\nedX: Fundamentals of Project Planning and Management\\nTime Management and Productivity:\\nSkillshare: Productivity Masterclass – Principles and Tools\\nBook: Atomic Habits by James Clear\\nGoal Achievement Frameworks:\\nYouTube: Videos on OKRs (Objectives and Key Results)\\nTemplates: Trello, Notion, or Asana templates for goal tracking.\\n\\nreturn an array,guidance in steps should be an array of guides \\n return the entire response as an array and the response should just be the array and nothing else,also suggest a dailt schedule in conjunction with the acctionable  that the user could follow in otder to effectively complete actionable steps the schedule should be in the following format \'\'\'"Morning": [\n    { time: "8:00 AM - 12:00 PM", activity: "Dedicated Study Block", icon: BookOpen },\n    { time: "12:00 PM - 1:00 PM", activity: "Lunch & Exercise", icon: Coffee },\n  ],\n  "Afternoon": [\n    { time: "1:00 PM - 5:00 PM", activity: "Web Development", icon: Code },\n    { time: "5:00 PM - 6:00 PM", activity: "HR Research", icon: Network },\n  ],\n  "Evening": [\n    { time: "6:00 PM - 7:00 PM", activity: "Dinner Break", icon: Utensils },\n    { time: "7:00 PM - 8:00 PM", activity: "Hackathon Prep", icon: Lightbulb },\n    { time: "8:00 PM onwards", activity: "Reflection & Planning", icon: Moon },\n never suggest the samething twice ,strickly follow the following structure  ],\n};\'\'\'\'\'\'\n',
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
        {
          role: "user",
          parts: [
            {
              text: "hey my goals for the year are :\n-Study consistantly and effectively\n-Learn full stack web and backend development\n-Prepare and do my best at hackathons\n-Secure a HRM or Hr related learnership or job shadowing opportunity\n-Prepare two apps for accelerator programs\n-Draw closer tog god",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "The user has provided six goals for the year. I need to break these down into SMART goals and then provide actionable steps for today, along with resources and a reflective question. I will also create a daily schedule to support the completion of these steps.\n\n**Goal Breakdown and SMART-ifying:**\n\n1. **Study consistently and effectively:**\n    *   **Specific:** Dedicate a specific amount of time each day to focused study using active recall and spaced repetition techniques.\n    *   **Measurable:** Study for at least 2 hours per day, 5 days a week, and track study time and topics covered.\n    *   **Achievable:**  This is achievable with proper planning and time management.\n    *   **Relevant:**  This supports all other goals by building knowledge and skills.\n    *   **Time-bound:** This is an ongoing goal for the year.\n\n2. **Learn full-stack web and backend development:**\n    *   **Specific:** Complete specific online courses or tutorials on front-end (React, HTML, CSS, JavaScript) and back-end (Node.js, Python/Django, databases).\n    *   **Measurable:** Complete one module of a web development course per week and build at least three small projects.\n    *   **Achievable:** This is achievable by breaking down learning into smaller chunks.\n    *   **Relevant:** Directly contributes to hackathon preparation and app development.\n    *   **Time-bound:** Aim to complete foundational learning within 6 months and continue practicing throughout the year.\n\n3. **Prepare and do my best at hackathons:**\n    *   **Specific:** Participate in at least two hackathons this year, focusing on pre-planning and thorough execution.\n    *   **Measurable:** Define a project idea and technology stack one month before each hackathon and actively participate in all team activities during the event.\n    *   **Achievable:**  This depends on the availability of hackathons and the user's commitment.\n    *   **Relevant:**  Provides practical experience and portfolio pieces.\n    *   **Time-bound:** Based on hackathon schedules throughout the year.\n\n4. **Secure a HRM or HR-related learnership or job shadowing opportunity:**\n    *   **Specific:**  Research and apply for at least five relevant learnerships or job shadowing opportunities per month, networking with HR professionals.\n    *   **Measurable:** Track applications submitted and networking contacts made. Secure at least one interview within three months.\n    *   **Achievable:** Requires consistent effort in research and networking.\n    *   **Relevant:** Directly addresses the user's career goals.\n    *   **Time-bound:** Aim to secure an opportunity within six months.\n\n5. **Prepare two apps for accelerator programs:**\n    *   **Specific:**  Develop a minimum viable product (MVP) for two distinct app ideas, focusing on user needs and market potential.\n    *   **Measurable:**  Complete the core features and user interface for both MVPs and create a pitch deck for each.\n    *   **Achievable:** Requires dedicated development time and market research.\n    *   **Relevant:**  Aligns with entrepreneurial aspirations.\n    *   **Time-bound:** Aim to have both MVPs ready for application within nine months.\n\n6. **Draw closer to God:**\n    *   **Specific:** Dedicate time daily for prayer, scripture reading, and reflection.\n    *   **Measurable:**  Spend at least 30 minutes each day on spiritual practices and journal reflections weekly.\n    *   **Achievable:** This is a personal goal requiring commitment.\n    *   **Relevant:**  Addresses the user's spiritual well-being.\n    *   **Time-bound:** This is an ongoing goal for the year.\n\n**Today's Focus:**  Start with laying the foundation for learning and connecting with the HR field.",
            },
            {
              text: '```json\n[\n  {\n    "Goal Summary": "Achieve personal and professional growth across several key areas: consistent studying, web development, hackathon participation, HR career exploration, app development, and spiritual growth.",\n    "Today\'s Focus": "Establish a structured learning routine and begin exploring HR career opportunities.",\n    "Actionable Steps": [\n      {\n        "step": "Schedule Dedicated Study Time:",\n        "guidance": [\n          "Allocate a specific block of time today for focused learning.",\n          "Identify the subject you want to focus on today (e.g., a web development concept, HR principles).",\n          "Choose a distraction-free environment."\n        ],\n        "time_estimate": "1.5 - 2 hours",\n        "potential_challenges": "Procrastination, distractions.",\n        "strategies": "Use the Pomodoro Technique (25 minutes of focused work followed by a 5-minute break), turn off notifications, and inform others not to disturb you."\n      },\n      {\n        "step": "Begin Web Development Learning:",\n        "guidance": [\n          "Start an introductory course or tutorial on a fundamental web development technology (e.g., HTML, CSS basics on platforms like freeCodeCamp, Codecademy, or MDN Web Docs).",\n          "Focus on understanding the basic syntax and concepts.",\n          "Set a small, achievable goal for this session (e.g., complete the first section of a tutorial or learn about basic HTML tags)."\n        ],\n        "time_estimate": "1 - 1.5 hours",\n        "potential_challenges": "Feeling overwhelmed by new information, getting stuck on technical issues.",\n        "strategies": "Break down the learning into smaller steps, take notes, and utilize online resources like Stack Overflow or documentation for troubleshooting."\n      },\n      {\n        "step": "Research HR Learnerhips/Job Shadowing:",\n        "guidance": [\n          "Spend time researching organizations in your area that offer HR-related learnerships or job shadowing opportunities.",\n          "Use online job boards (e.g., LinkedIn, Indeed) and company websites.",\n          "Identify the requirements and application processes for a few promising opportunities."\n        ],\n        "time_estimate": "1 hour",\n        "potential_challenges": "Difficulty finding relevant opportunities, feeling unsure where to start.",\n        "strategies": "Use specific keywords in your search (e.g., \'HR learnership\', \'HR job shadowing\'), network with people in HR on LinkedIn for insights, and start with broader searches and narrow down."\n      },\n      {\n        "step": "Spiritual Reflection and Prayer:",\n        "guidance": [\n          "Set aside dedicated time for prayer, meditation, or reading religious texts.",\n          "Reflect on your day, your goals, and seek guidance.",\n          "Consider journaling your thoughts and reflections."\n        ],\n        "time_estimate": "30 minutes",\n        "potential_challenges": "Distractions, feeling rushed.",\n        "strategies": "Find a quiet space, set a timer, and make it a non-negotiable part of your daily routine."\n      }\n    ],\n    "Suggested Resources": [\n      {\n        "title": "freeCodeCamp Responsive Web Design Certification",\n        "type": "Course",\n        "url": "https://www.freecodecamp.org/learn/responsive-web-design/"\n      },\n      {\n        "title": "LinkedIn Learning",\n        "type": "Platform",\n        "description": "Offers courses on web development and HR topics (may require a subscription or free trial).",\n        "url": "https://www.linkedin.com/learning/"\n      }\n    ],\n    "Reflective Question": "What small step did I take today that will contribute most significantly to my long-term goals?"\n  },\n  {\n    "Daily Schedule": {\n      "Morning": [\n        {\n          "time": "7:00 AM - 7:30 AM",\n          "activity": "Personal Reflection & Prayer",\n          "icon": "🙏"\n        },\n        {\n          "time": "7:30 AM - 8:00 AM",\n          "activity": "Light Exercise/Stretching",\n          "icon": "🏃"\n        },\n        {\n          "time": "8:00 AM - 10:00 AM",\n          "activity": "Dedicated Study Block (Web Development Fundamentals)",\n          "icon": "💻"\n        },\n        {\n          "time": "10:00 AM - 10:30 AM",\n          "activity": "Break & Refreshments",\n          "icon": "☕"\n        }\n      ],\n      "Afternoon": [\n        {\n          "time": "10:30 AM - 12:00 PM",\n          "activity": "Research HR Learnerships/Job Shadowing Opportunities",\n          "icon": "💼"\n        },\n        {\n          "time": "12:00 PM - 1:00 PM",\n          "activity": "Lunch Break",\n          "icon": "🍽️"\n        },\n        {\n          "time": "1:00 PM - 3:00 PM",\n          "activity": "Web Development Practice/Tutorials",\n          "icon": "👨‍💻"\n        }\n      ],\n      "Evening": [\n        {\n          "time": "3:00 PM - 3:30 PM",\n          "activity": "Review and Plan for Tomorrow",\n          "icon": "📝"\n        },\n        {\n          "time": "3:30 PM - 4:00 PM",\n          "activity": "Spiritual Reflection",\n          "icon": "📖"\n        },\n        {\n          "time": "4:00 PM onwards",\n          "activity": "Personal Time/Relaxation/Further Learning",\n          "icon": "🌙"\n        }\n      ]\n    }\n  }\n]\n```',
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "always follow this reponse format ,under no circumstances should you diviate from it,and stricktly retrun the array with no text or message before it  \n",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "The user has given a very important constraint: to strictly adhere to the provided JSON format for all future responses. I need to be extremely careful not to deviate from this structure. This means each response will be a JSON array containing two objects: one for the goal summary, actionable steps, resources, and reflection question, and the second for the daily schedule.",
            },
            {
              text: "Got it. I will strictly adhere to the specified JSON format for all subsequent responses.\n",
            },
          ],
        },
        {
          role: "user",
          parts: [...taskHistory.map((text) => ({ text }))],
        },
      ],
    });

    const result = await chatSession.sendMessage(goal);

    const cleanOutput = result.response
      .text()
      .replace(/`/g, "") // Remove backticks
      .replace(/json/g, "") // Remove the word "json"
      .replace(/^[^a-zA-Z0-9]*(.*?)[^a-zA-Z0-9]*$/, "$1");

    taskHistory = [...taskHistory, cleanOutput];
    console.log(cleanOutput);
    return cleanOutput;
  }

  return run();
}

export async  function taskAssistant(apiKey:string,message:string,onChunk: (chunk: string) => void){
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