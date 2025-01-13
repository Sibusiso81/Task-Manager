import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ReflectionModalProps {
  question: string;
  colorTheme: string;
}

export function ReflectionModal({ question, colorTheme }: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log('Reflection submitted:', reflection)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-full text-${colorTheme}-600 border-${colorTheme}-300 hover:bg-${colorTheme}-50`}>
          Daily Reflection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`text-${colorTheme}-700`}>Daily Reflection</DialogTitle>
          <DialogDescription>{question}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Your thoughts..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className={`border-${colorTheme}-300 focus:border-${colorTheme}-500`}
          />
        </div>
        <Button onClick={handleSubmit} className={`bg-${colorTheme}-600 hover:bg-${colorTheme}-700 text-white`}>
          Submit Reflection
        </Button>
      </DialogContent>
    </Dialog>
  )
}

