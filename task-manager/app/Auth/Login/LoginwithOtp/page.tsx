"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { useState } from "react";
import { sendOtp, verifyOtp } from "../../Actions/Actions";

const formSchema = z.object({
  number: z.string()
  .regex(/^0\d{9}$/, "Phone number must start with 0 and have 10 digits.")
  .refine((val) => val.length === 10, {
    message: "Phone number must be exactly 10 digits.",
  }),
  code: z.string(),
});

function ProfileForm() {
  const [useOTP, setUseOTP] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: '',
      code:'',
    },
  });
  return (
    <Form {...form}>
      <form className="space-y-6 lg:space-y-8">
        {useOTP ? (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    className="p-4"
                    placeholder="Enter your verification code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    className="p-4"
                    placeholder="Enter your phone number"
                
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 ">
          {useOTP ? (
            <button
              className="p-2 rounded-md text-white bg-green-500 w-full"
              formAction={verifyOtp}
             
            >
              Log in with OTP
            </button>
          ) : (
            <button
              className="p-2 rounded-md text-white bg-green-500 w-full"
              formAction={sendOtp}
              onClick={() => setUseOTP(true)}
            >
              Send OTP
            </button>
          )}
        </div>
      </form>
    </Form>
  );
}

function page() {
  return (
    <section className="max-w-screen-md h-screen flex flex-col lg:flex-row p-4 space-y-6 mx-auto justify-center items-center">
      <div className="w-full md:w-1/2 space-y-4 justify-center items-center">
        <h1 className="text-xl font-semibold text-center">Welcome</h1>
        <ProfileForm />
      </div>
    </section>
  );
}

export default page;
