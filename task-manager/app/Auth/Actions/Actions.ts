'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { domainToUnicode } from "url"


export async function login(formData:FormData) {
    const supabase = await createClient()

      // type-casting here for convenience
  // in practice, you should validate your inputs

  const data ={
    email:formData.get('email') as string,
    password:formData.get('password') as string

  }
  const {error} = await supabase.auth.signInWithPassword(data)
  if(error){
    console.log(error),
    redirect('/Auth/Error')
  }
  revalidatePath('/','layout')
  redirect('/Tasks')
}

export async function signup(formData:FormData){
    const supabase = await createClient();
    const data ={
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
};
export default async function logout(){
    const supabase  = await createClient();
    const {error} =  await supabase.auth.signOut();
    if (error) {
        console.log(error)
        redirect('/error')
      }
    
  
}
export  async function sendOtp(formData:FormData){
    const supabase  = await createClient();
    const phoneNumber  = formData.get('number') as string
    console.log(phoneNumber)
    const { data, error } = await supabase.auth.signInWithOtp({

        phone:phoneNumber,
      })
      if(error){
        console.log(error)
        redirect('/error')
      }
      console.log(data)
}

export async function verifyOtp(formData:FormData){
    const supabase  = await createClient();
    
    const {
        data:{session},
        error
    } = await supabase.auth.verifyOtp({
        phone: formData.get('number') as string,
        token: formData.get('code') as string,
        type:'sms',
    })
    if(error){
        console.log(error)
        redirect('/error')
      }

      console.log(session)
          revalidatePath('/', 'layout')
      redirect('/')
}