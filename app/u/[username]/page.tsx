"use client"
import { usePathname } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
const page = () => {
  const [InputText,setInputText] = useState('')
  const [isLoading, setLoading] = useState(false); // Add loading state for button feedback
  const [isSendingLoader,setIsSendingLoader] = useState(false)
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");
    const pathname = usePathname(); // e.g., /profile/anjali
    const username = pathname?.split('/')[2]; // Adjust index as per your route
    const router = useRouter()
  const [Text,setText] = useState('')
    const handleSendMessage=async()=>{
      setIsSendingLoader(true)
      try {
        const response = await axios.post<ApiResponse>(`/api/send-message`,{username,content:Text})
        console.log(response.data.message);
        toast(response?.data?.message,{description:"Go and check your dashboard..."})
      
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast(axiosError.response?.data?.message,{description:"Failed to fetch message settings"})
        setIsSendingLoader(false)
      
      }finally{
        setIsSendingLoader(false)
      }
    }
  
    const fetchSuggestMessage = async () => {
      setLoading(true); // Set loading state while fetching the suggestions
      try {
        const response = await axios.get('/api/suggest-message');
        const firstMessage = response.data.messages?.[0] || "";
        setSuggestedMessage(firstMessage); // Save the suggested message
        // console.log(response.data.messages);
        // const randomMessage = suggestedMessage[Math.floor(Math.random() * suggestedMessage.length)];
        // setSuggestedMessage(randomMessage);
    
      } catch (error) {
        console.error(error);
        toast('Failed to fetch suggested messages');
      } finally {
        setLoading(false); // End loading once the request is complete
      }
    };

    const CopyClipBoard = (msg:string)=>{
      navigator.clipboard.writeText(msg)
      setText(msg)
      toast('Suggest Message Copy')
    }
     
  
  return (
    <div className="w-full h-full p-10 flex flex-col justify-start items-center">
    <h1 className="text-5xl font-bold  ">Public Profile Link</h1>
    <div className="div w-full   p-5  pl-52 h-auto ">
      <p className='font-semibold tracking-tight '>Send Anonymous Messge to @{username}</p>
    <Textarea defaultValue={Text}  onChange={(e)=>setText(e.target.value)} className='border-2 border-black mt-4 w-[50rem] h-40' placeholder='Write your anonymous message..' />
    <div className="div w-[50rem] flex justify-center items-center mt-2 h-10">
    <Button onClick={handleSendMessage}>{isSendingLoader == true ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Sending...</>):("Send")}</Button>
    </div>

    <Button onClick={fetchSuggestMessage}>
      {isLoading==true ? ( <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suggesting...
                  </>):('Suggest message')}

    </Button>
    <p className='mt-4'>Click on any message below to select it.</p>
    </div>
    <div className="div w-full   h-80   pl-52  p-10">
      <h1 className='text-xl font-semibold'>Messages</h1>
     {suggestedMessage.split("||").map((msg, idx) => (
  <Input onClick={()=>CopyClipBoard(msg)}
    key={idx}
    readOnly
    defaultValue={msg.trim() || "No Message Suggestion "}
    className="w-[70rem] mt-4 cursor-pointer "
  />
))}
        
      </div>
      <div className="div w-full flex flex-col justify-center items-center  mt-4 h-20">
        <p>Get Your Message Board</p>
        <Link href="/sign-in"><Button  className='mb-5 mt-2'>Create own account</Button></Link>
    </div>
    </div>
  )
}

export default page
