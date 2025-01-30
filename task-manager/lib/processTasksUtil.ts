export interface ActionableStep {
    step: string
    guidance: string[]
    time_estimate: string
    potential_challenges: string
    strategies: string
  }
  
  export interface Resource {
    title: string
    type: string
    url: string
    description?: string
  }
  
  export interface DailyScheduleActivity {
    time: string
    activity: string
    icon: string
  }
  
  export interface TaskContent {
    "Today's Focus": string
    "Goal Summary": string
    "Actionable Steps": ActionableStep[]
    "Suggested Resources": Resource[]
    "Daily Schedule"?: {
      [key: string]: DailyScheduleActivity[]
    }
  }
  
  export interface ProcessedTask {
    date: string
    tasks: TaskContent[]
  }
  
  interface RawTask {
    id: number
    user_id: string
    tasks: string[]
    api_key: string | null
    created_at: string
    updated_at: string | null
    name: string | null
  }
  
  export function processTasksHistory(rawTasks: RawTask[]): ProcessedTask[] {
    const taskMap: { [key: string]: TaskContent[] } = {}
  
    rawTasks.forEach((task) => {
      const date = task.created_at.split("T")[0]
      if (!taskMap[date]) {
        taskMap[date] = []
      }
  
      task.tasks.forEach((taskString) => {
        try {
          const parsedTask = JSON.parse(taskString) as TaskContent;
        const filteredTask: TaskContent = {
          "Today's Focus": parsedTask["Today's Focus"],
          "Goal Summary": parsedTask["Goal Summary"], // Optional field
          "Actionable Steps": parsedTask["Actionable Steps"],
          "Suggested Resources": parsedTask["Suggested Resources"],
        }
        taskMap[date].push(filteredTask);

        } catch (error) {
          console.error(`Error parsing task for id ${task.id}:`, error)
        }
      })
    })
  console.log(taskMap)
    return Object.entries(taskMap).map(([date, tasks]) => ({
      date,
      tasks,
    }))
  }
  
  