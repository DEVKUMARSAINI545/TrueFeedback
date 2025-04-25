"use client"
import MessageCard from "@/components/MessageCard/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message, User } from "@/model/User.model";
import { MessageAcceptSchema } from "@/Schema/MessageAccept.Schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Router } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {toast} from "sonner"
import * as z from "zod"
export default function dashboard() {
  const {data:session} = useSession()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);
  const username = session?.user?.username
  const [origin, setOrigin] = useState("");
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  const handleDeleteMessage=(messageId:string)=>{
    fetchMessages(true)
    setMessages(messages.filter((message)=>message._id !== messageId))
 
  }
  const form = useForm<z.infer<typeof MessageAcceptSchema>>({resolver:zodResolver(MessageAcceptSchema)})
  const {watch ,register,setValue } = useForm()
  const acceptMessages = watch('acceptMessages')
  const fetch = useCallback(async()=>{
    setIsSwitchLoading(true)
try {
 const response =  await axios.get<ApiResponse>("/api/accept-messages")
 setValue('acceptMessages',response.data.isAcceptingMessage)
} catch (error) {
  const axiosError = error as AxiosError<ApiResponse>
  toast('Error',{description:axiosError?.response?.data?.message || "Failed to fetch message settings"})
} finally{
  setIsSwitchLoading(false)
}
  },[setValue])


  const fetchMessages = useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>("/api/get-message")
      setMessages(response.data?.messages || []);
       
      
      
      if(refresh)
      {
        toast('Refresh Messages',{description:"Showing Latest messages"})
      } 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast('Error',{description:axiosError?.response?.data?.message || "Failed to fetch message settings"})
    
    }finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }

  },[setIsLoading,setMessages])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetch()
  },[session,setValue,fetchMessages,fetch])

  const handleSwitchChange = async()=>{
    try {
      
      const response = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessage:!acceptMessages})
      setValue('acceptMessages',!acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast('Error',{description:axiosError?.response?.data?.message || "Failed to fetch message settings"})
    
    }
  }
  

  const CopyToClipBoard = ()=>{
    // const data = document.body.querySelector(".BASEURL")
    if(inputRef.current)
    {

      navigator.clipboard.writeText(inputRef.current.value)
      toast('URL Copy',{description:"Profile URL has been copied to clipboard"})
    }
  }
  if(!session || !session.user)
  {
  <div>Please Login ....</div>
   
}

 

  
useEffect(() => {
  if (typeof window !== "undefined") {
    // Set the origin to window.location.origin on the client-side
    setOrigin(window.location.origin);
  }
}, []);
  return (
    <div className="   h-full w-full p-12   ">
      <h1 className="text-5xl my-1 font-bold">User Dashboard</h1>
      <p className="text-2xl mt-4 font-bold">Copy Your Unique Link</p>
      <div className="div gap-2  w-[80%] my-5 h-10 flex justify-between items-center">
      <Input ref={inputRef}
  readOnly
  defaultValue={origin && session?.user?.username ? `${origin}/u/${session.user.username}` : ""}
  className="BASEURL text-2xl font-bold"
/>
        <Button onClick={CopyToClipBoard}>Copy</Button>
      </div>
      <div className="div w-full   flex gap-3  items-center">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      className="mb-3" />
      <h1 className="mb-3 ">Accept message : {acceptMessages?"On":"Off"}</h1>
      </div>
      <Separator />
      <Button  className="mt-4" variant="outline" onClick={(e)=>{e.preventDefault();fetchMessages(true)}}>

        {isLoading?(<Loader2 className="h-4 w-4 animate-spin"/>):(<RefreshCcw className="h-4 w-4"/>)}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length>0 ?messages.map((message,index)=>{
         return <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage}/>
        }):(<p>No Message Display</p>)}
      </div>
    </div>
  );
}
