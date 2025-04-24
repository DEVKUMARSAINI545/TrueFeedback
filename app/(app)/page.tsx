"use client"
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from "../../Data/messages.json"
import AutoPlay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function home() {
  return (
 <>
 <div className="div w-full text-white h-[87%] bg-[#0e1c2a] flex flex-col justify-center items-center">
  <h1 className="text-5xl font-bold  ">Dive into the World of Anonymous Feedback</h1>
  <p className="mt-2 tracking-tight">True Feedback: Where your identify remains a secret.</p>
   
  <Carousel plugins={[AutoPlay({delay:3000})]} className=" flex justify-center   px-10   w-full  max-w-2xl   mt-10 ">
    
  <CarouselContent >
    {message.map((message,index)=>(

      <CarouselItem key={index} >
        <div className="p-1">
          <Card className="  max-w-xl h-40 gap-2">
            <CardHeader className="text-2xl font-bold">{message.title}</CardHeader>
            <CardContent className="flex flex-col  h-10 aspect-square items-start justify-center p-6">
              <span className="text-lg font-semibold">💌 {message.content}</span>
              <span className="text-sm font-semibold ml-10"> {message.received}minutes ago</span>

            </CardContent>
          </Card>
        </div>
      </CarouselItem>
  ))}
  </CarouselContent>
  {/* <CarouselPrevious />
  <CarouselNext /> */}
</Carousel>
  </div>

 </>
  );
}
