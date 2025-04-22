"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {useDebounceCallback } from "usehooks-ts"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import {Loader2} from "lucide-react"
import axios, { AxiosError } from "axios"
import { SignUpSchema } from "@/Schema/SignUp.Schema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes"
 const page = () => {
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [CheckingUsername,setIsCheckingUsername]  = useState(false)
  const [isSubmitting,setSubmitting]= useState(false)
  const debounced  = useDebounceCallback(setUsername,100)
  const router = useRouter()
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver:zodResolver(SignUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:'',
    }
  })

  useEffect(()=>{
    const checkUniqueUsername = async ()=>{
      if(username)
      {
        setIsCheckingUsername(true)
        setMessage('')
        try {
        const respons =   await axios.get(`/api/check-username-unique?username=${username}`)
        console.log(respons.data.message);
        let message = respons.data.message
        setMessage(message)
        } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         setMessage(axiosError?.response?.data.message ?? "Error checking  username")
          
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUniqueUsername()
    console.log("working useEffect...");
    
  },[username])

  const onSubmit = async (data:z.infer<typeof SignUpSchema>)=>{
    setSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up",data)
      toast('Success', {
        description:  response.data.message,
      })
      router.replace(`/verify/${username}`)
      setSubmitting(false) 

    } catch (error) {
      // console.log("Error in sign up  of user",error.message)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError?.response?.data.message
      toast('Sign-up failed',{description:errorMessage,})
      setSubmitting(false)
    }
  }
   return (
     <div className="w-screen h-screen bg-white text-black border-2 border-black flex justify-center items-center">
       <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter the username" 
                {...field}
                onChange={(e)=>{field.onChange(e)
                   debounced(e.target.value)}}
                 />
              </FormControl>
           {CheckingUsername && <Loader2 className="animation-spin"/>}
           <p className={`text-sm ${message === "Username is unqiue"?'text-green-500':'text-red-500'}`}>test {message}</p>
              <FormMessage />
            </FormItem>
          )}
        />
  {/* email */}
<FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter the email" 
                {...field}
                 
                 />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter the password" 
                {...field}
                 
                 />
              </FormControl>
             {}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting?(
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait.
            </>
          ):('SignUp')}

        </Button>
        </form>
        </Form>
        <div className="text-center mt-4">
          <p>Already member?{''}
            <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">Sign In</Link>
            </p>
        </div>
     </div>
     
   )
 }
 
 export default page
 