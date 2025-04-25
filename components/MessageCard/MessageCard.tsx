import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import { Message } from '@/model/User.model'
import axios from 'axios'
import {format} from "date-fns"
  type MessageDetail={
    message:Message,
    onMessageDelete:(messageId:string)=>void
  }
const MessageCard = ({message,onMessageDelete}:MessageDetail) => {
 
    const handleDeleteCard=async()=>{
        try {
       
            console.log(message?._id);
            
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`)
            toast(response.data.message)
            onMessageDelete(message?.id)
            console.log(response.data.message);
            
        } catch (error) {
            
        }
    }
  return (
     <>
<Card className='w-[35rem]'>
  <CardHeader className="flex flex-col items-start gap-2">
    <div className="flex items-center gap-3 w-full">
      <CardTitle className=" w-96  text-xl">
        {message.content}
      </CardTitle>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-10 h-10">
            <X className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <CardDescription className="font-semibold text-black">
      {format(new Date(message.createAt), "dd MMM yyyy, hh:mm a")}
    </CardDescription>
  </CardHeader>
</Card>



     </>
  )
}

export default MessageCard
