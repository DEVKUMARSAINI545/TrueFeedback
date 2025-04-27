"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useSession,signIn,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { useRouter } from 'next/navigation'

const NavBar = () => {
    const {data:session} = useSession()
         return (
        <div className='  px-24   bg-indigo-950  overflow-hidden w-full  h-24 flex justify-between  items-center'>
      <h1 className=' text-2xl font-bold text-white'>True Feedback</h1>
      <p className='text-white text-xl'>{session && "Welcome, "+session?.user?.username}</p>
       {session? <Button onClick={()=>{signOut(),localStorage.removeItem("acceptMessages")}} variant="NavBarButton">Logout</Button> : <Link href={"/sign-up"}><Button variant="NavBarButton">Login</Button></Link> }
   
    </div>
  )

}

export default NavBar
