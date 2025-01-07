'use client'
import { Separator } from "@/components/ui/separator"
import { CircleX } from 'lucide-react'
import React from 'react'

function page() {
  return (
  <section className='w-screen h-screen flex flex-col items-center justify-center text-black dark:text-white  '>
    <div className='flex flex-row space-x-3 mx-auto my-auto'>
        <CircleX />
        <Separator orientation="vertical" className="bg-neutral-700"/>
        <p>Sorry somthing went wrong</p>
    </div>
    
  </section>
  )
}

export default page