import React from "react";
import Temp from "@/components/common/temp";

import LandingPage from './landing/page'
import Navbar from '@/components/landingComponents/Navbar'
import Footer from '@/components/landingComponents/Footer'

export default function Page() {
  return (
    <div className='h-full overflow-hidden'>
        <Navbar />
        <LandingPage/>
        <Footer/>
        <div>
            <Temp /> 
        </div>
    </div>
  )
}
