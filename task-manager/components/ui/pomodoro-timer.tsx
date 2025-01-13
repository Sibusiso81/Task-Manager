import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface PomodoroTimerProps {
  colorTheme: string;
}

export function PomodoroTimer({ colorTheme }: PomodoroTimerProps) {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1)
      }, 1000)
    } else if (time === 0) {
      setIsBreak(!isBreak)
      setTime(isBreak ? 25 * 60 : 5 * 60)
      setIsActive(false)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, time, isBreak])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setTime(25 * 60)
    setIsActive(false)
    setIsBreak(false)
  }

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md border border-${colorTheme}-200`}>
      <h3 className={`text-lg font-semibold mb-4 text-${colorTheme}-700`}>Pomodoro Timer</h3>
      <Progress value={(1 - time / (25 * 60)) * 100} className={`bg-${colorTheme}-100`} />
      <div className={`text-4xl font-bold text-center my-4 text-${colorTheme}-600`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={toggleTimer} className={`bg-${colorTheme}-600 hover:bg-${colorTheme}-700 text-white`}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer} variant="outline" className={`text-${colorTheme}-600 border-${colorTheme}-300 hover:bg-${colorTheme}-50`}>
          Reset
        </Button>
      </div>
    </div>
  )
}

