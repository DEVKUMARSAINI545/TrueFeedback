"use client"
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
 
import { VerifySchema } from '@/Schema/Verify.Schema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z  from 'zod'
export default function page() {
    const router = useRouter()
    const params= useParams<{username:string}>()
    console.log(params.username);
    

     const form = useForm<z.infer<typeof VerifySchema>>({
       resolver:zodResolver(VerifySchema),
       defaultValues:{
        code:''
       }
     })

    const onSubmit= async(data:z.infer<typeof VerifySchema>)=>{
try {
    const response = await axios.post(`/api/verify-code`,{username:params.username,code:data.code})
    toast('Success',{description:response.data.message})
    router.replace('/sign-up')
} catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
          let errorMessage = axiosError?.response?.data.message
          toast('Verification Email failed',{description:errorMessage,})
}
    }
  return (
    <div className='w-screen h-screen bg-white p-5 text-black flex justify-center items-center'>
      <div className="div w-1/3 h-[23rem] rounded-xl flex p-2 flex-col justify-center items-center border-2 border-black">
        <h1 className='text-3xl font-bold mb-2'>Verify Your Account</h1>
        <p>Enter the Verification code send to your email</p>
        <div className="div   w-full h-full p-5 flex-col justify-center items-center">
        <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       
  {/* email */}
<FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>code</FormLabel>
              <FormControl>
                <Input placeholder="Enter the code" 
                {...field}
                 
                 />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
 
 <Button type="submit"  >
          Verify
        </Button>
        </form>
        </Form>
       </div>
      </div>
    </div>
  )
}
