'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from 'lucide-react'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')

  const handleModeChange = useCallback(() => {
    switch (mode) {
      case 'work':
        setMode('shortBreak')
        setTimeLeft(5 * 60)
        break
      case 'shortBreak':
        setMode('longBreak')
        setTimeLeft(15 * 60)
        break
      case 'longBreak':
        setMode('work')
        setTimeLeft(25 * 60)
        break
      default:
        setMode('work')
        setTimeLeft(25 * 60)
        break
    }
    setIsActive(false)
  }, [mode]) // Add mode as a dependency

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 0) {
            handleModeChange()
            return prevTimeLeft
          }
          return prevTimeLeft - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, handleModeChange]) // handleModeChange is now stable

  const resetTimer = () => {
    setIsActive(false)
    setMode('work')
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full h-fit max-w-md mx-auto shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl font-bold text-center">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-bold text-center mb-4">
          {formatTime(timeLeft)}
        </div>
        <div className="w-full flex flex-col space-y-2 mb-4">
          <Button 
            variant={mode === 'work' ? 'default' : 'outline'}
            onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
          >
            Work
          </Button>
          <Button 
            variant={mode === 'shortBreak' ? 'default' : 'outline'}
            onClick={() => { setMode('shortBreak'); setTimeLeft(5 * 60); setIsActive(false); }}
          >
            Short Break
          </Button>
          <Button 
            variant={mode === 'longBreak' ? 'default' : 'outline'}
            onClick={() => { setMode('longBreak'); setTimeLeft(15 * 60); setIsActive(false); }}
          >
            Long Break
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <Button onClick={() => setIsActive(!isActive)}>
          {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}