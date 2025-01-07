'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



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
