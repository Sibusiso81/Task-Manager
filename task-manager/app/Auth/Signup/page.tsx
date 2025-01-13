"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signup } from "../Actions/Actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";


const formSchema = z.object({
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters long." })
    .max(50, { message: "Password must be no longer than 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must be no longer than 100 characters." }),
});

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  function sendConfirmation(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (email && password) {
      // Add your logic here
      toast.success('Confirmation email sent')
      
    }
    else {
      toast.error('Provide valid name / email')
    }
  }
  return (
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

        <div className="flex flex-col  max-w-screen-sm space-y-2">
          <Toaster position="top-right" />
         <Link href={'/Auth/ChangePassword'} className="place-self-end">
         <button className="p-1  text-sm">
            <span className="text-muted-foreground ">Forgot Password ?</span>
          </button>
         </Link>
            <Button 
            variant={"default"} 
            onClick={form.handleSubmit((data) => {
              const formData = new FormData();
              formData.append('email', data.email);
              formData.append('password', data.password);
              sendConfirmation(formData);
              signup(formData)
            })} 
            formAction={signup}
            >
            Sign up
            </Button>

          <div className="flex flex-row space-x-2 items-center">
            <div className="border w-full bg-neutral-900"></div>
            <p className="text-center text-muted-foreground">or</p>
            <div className="border w-full bg-neutral-900"></div>
          </div>
          <Link href={"/Auth/Login"}>
            
            <Button variant={'default'} className="w-full">Log in</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}

function page() {
  return (
    <section className="max-w-screen-md h-screen flex flex-col -4 space-y-6 mx-auto justify-center items-center">
      <h1 className="text-2xl font-bold text-blue-600">Aspire ®</h1>
      <div className="w-full md:w-1/2  space-y-4 justify-center items-center lg:flex-row p">
        <h1 className="text-xl font-semibold text-center">Sign up</h1>

        <ProfileForm />
      </div>
    </section>
  );
}

export default page;
