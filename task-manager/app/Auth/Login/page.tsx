"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "../Actions/Actions"



const formSchema = z.object({
     password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters long." })
    .max(50, { message: "Password must be no longer than 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must be no longer than 100 characters." }),
})

function ProfileForm(){
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            password:'',
            email:'',
        }
    });
        return(
            <Form {...form}>
            <form className="space-y-6 lg:space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="p-4"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="p-4"
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 ">
                <button className="p-2 rounded-md text-white bg-green-500 w-full" formAction={login}>Log in</button>


              </div>
            </form>
          </Form>
        )
}



function page() {
  return (
    <section className="max-w-screen-md h-screen flex flex-col lg:flex-row p-4 space-y-6 mx-auto justify-center items-center">
    
    <div className="w-full md:w-1/2 space-y-4 justify-center items-center">
      <h1 className="text-xl font-semibold text-center">Welcome</h1>
      <ProfileForm />
    
    </div>
  </section>
  )
}

export default page