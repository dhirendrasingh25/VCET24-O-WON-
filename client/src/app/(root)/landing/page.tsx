import Quiz from '@/components/landingComponents/Quiz'
import { Button } from '@/components/ui/button'
import React from 'react'

const LandingPage = () => {
  return (
    <main className='h-full'>
      <div id="home" className='h-screen'>
        Home section for marketting
      </div>
      <div id="quiz" className='h-screen'>
       <Quiz/>
       <div className='flex items-center justify-center py-6'>
        <Button>Join Us Today !</Button>
       </div>
      </div>
      <div id="testimonial" className='h-screen'>
        testimonial
      </div>
      <div id="about-us" className='h-screen'>
        about us
      </div>
    </main>
  )
}

export default LandingPage