import React from 'react'
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
  type MessageDetail={
    message:Message,
    onMessageDelete:(messageId:string)=>void
  }
const MessageCard = ({message,onMessageDelete}:MessageDetail) => {

    const handleDeleteCard=async()=>{
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast(response.data.message)
            onMessageDelete(message?.id)
        } catch (error) {
            
        }
    }
  return (
     <>
     <Card>
  <CardHeader>
    <CardTitle>Chai or Code Videos</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCard}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>March 13 2024 2:06 AM</CardDescription>
  </CardHeader>
 
 
</Card>

     </>
  )
}

export default MessageCard
