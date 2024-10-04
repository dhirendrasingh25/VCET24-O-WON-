import React from 'react'
import LandingPage from './landing/page'
import Navbar from '@/components/landingComponents/Navbar'
import Footer from '@/components/landingComponents/Footer'

const page = () => {
  return (
    <div className='h-full overflow-hidden'>
        <Navbar />
        <LandingPage/>
        <Footer/>
    </div>
  )
}

export default page