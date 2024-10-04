import Quiz from '@/components/landingComponents/Quiz'
import React from 'react'

const LandingPage = () => {
  return (
    <main className='h-full'>
      <div id="home" className='h-screen'>
        Home section for marketting
      </div>
      <div id="quiz" className='h-screen'>
       <Quiz/>
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

export default LandingPage;
