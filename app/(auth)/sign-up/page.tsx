"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignInSchema } from '@/Schema/SignIn.Schema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"
export default function page() {
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof SignInSchema>>({resolver:zodResolver(SignInSchema),defaultValues:{identifier:'',password:''}
  })

  const onSubmit=async(data:z.infer<typeof SignInSchema>)=>{
    setIsLoading(true)
 try {
   const result =  await signIn('credentials',{
     redirect:false,
     identifier:data.identifier,
     password:data.password 
    })
    if(result?.error)
    {
     if(result?.error =="CredentialsSignin")
     {
       toast('Login Failed',{description:"Incorrect username or password"})
     }
     else{
       toast('Error',{description:result?.error})
 
     }
    }
    if(result?.url)
    {
 router.replace("/dashboard")
    }
 } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
          let errorMessage = axiosError?.response?.data.message
          toast('Sign-up failed',{description:errorMessage,})
          setIsLoading(false)
   }finally{
   setIsLoading(false)

 }
  }
  return (
     <>
         <div className='w-screen h-screen bg-white p-5 text-black flex justify-center items-center'>
      <div className="div w-1/3 h-[23rem] rounded-xl flex p-2 flex-col justify-center items-center border-2 border-black">
      <h1 className="text-center my-5 text-4xl font-semibold">True Feedback Sign Up</h1>
      
        <div className="div   w-full h-full p-5 flex-col justify-center items-center">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter the username/Email" {...field}  onChange={(e)=>{field.onChange(e)}}  />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="Enter the password" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isLoading == true ?( <Loader2 className="mr-2 h-4 w-4 animate-spin" >Please Wait..</Loader2>):("Submit")}
        </Button>
      </form>
    </Form>
       </div>
      </div>
    </div>
     </>
  )
}
