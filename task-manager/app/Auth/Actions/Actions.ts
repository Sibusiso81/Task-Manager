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
    console.log(error);
    redirect('/Auth/Error');
    return;
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
    console.log(error);
    redirect('/Auth/Error');
    return;
  }

  revalidatePath('/', 'layout')
  redirect('/')
};
export default async function logout(){
    const supabase  = await createClient();
    const {error} =  await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect('/Auth/Error');
        return;
      }
    
  
}
export async function resetPassword(formData:FormData){
  const data = formData.get('email') as string ;
  if (!data) {
    console.log('Email is required');
    redirect('/Auth/Error');
    return;
  }
  const supabase  = await createClient();
 await supabase.auth.resetPasswordForEmail(data,{
redirectTo:'http://localhost:3000/Auth/ChangePassword'
  })
}

export async function changePassword(formData:FormData){
  const data = formData.get('password') as string
  if(!data){
    console.log('Passowrd is required');
    redirect('/Auth/Error');
    return;
  }
  const supabase  = await createClient();
  await supabase.auth.updateUser({ password: data })
  redirect('/Auth/Login')
}