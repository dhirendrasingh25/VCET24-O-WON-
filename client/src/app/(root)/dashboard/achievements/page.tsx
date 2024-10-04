'use client'

import React, { useEffect, useState } from 'react'
import { Trophy, CheckCircle, XCircle, Percent, Ticket } from 'lucide-react'

// Mock data to simulate backend API response
const mockUserData = {
  totalTransactions: 85,
  totalAmount: 75000,
  streakDays: 22,
  savingsAmount: 5000,
  monthlyBudgetAdherence: 90,
  investmentAmount: 10000,
}

const achievements = [
  { id: 1, name: "Savings Starter", description: "Save your first ₹1,000", target: 1000, type: 'savings', score: 10 },
  { id: 2, name: "Budget Master", description: "Stick to your monthly budget for 30 days", target: 30, type: 'budgetAdherence', score: 20 },
  { id: 3, name: "Investment Initiator", description: "Make your first investment", target: 1, type: 'investment', score: 15 },
  { id: 4, name: "Frugal Fortune", description: "Save ₹10,000 in total", target: 10000, type: 'savings', score: 25 },
  { id: 5, name: "Transaction Tamer", description: "Complete 100 transactions", target: 100, type: 'transactions', score: 20 },
  { id: 6, name: "Savings Sage", description: "Save 20% of your income for 3 consecutive months", target: 3, type: 'savingsStreak', score: 30 },
  { id: 7, name: "Budget Virtuoso", description: "Maintain 95% budget adherence for 2 months", target: 2, type: 'budgetStreak', score: 35 },
  { id:8, name: "Expense Eliminator", description: "Reduce monthly expenses by 15%", target: 15, type: 'expenseReduction', score: 30 },
  { id: 9, name: "Financial Freedom Fighter", description: "Save 6 months worth of expenses", target: 6, type: 'emergencyFund', score: 50 },
]

const coupons = [
  { id: 1, name: "10% off next investment", code: "INVEST10", minScore: 50 },
  { id: 2, name: "Free financial consultation", code: "CONSULT2023", minScore: 100 },
  { id: 3, name: "₹500 bonus on ₹10,000 savings", code: "SAVE500", minScore: 150 },
  { id: 4, name: "Premium features free for 1 month", code: "PREMIUM1MONTH", minScore: 200 },
]

const AchievementsPage = () => {
  const [userData, setUserData] = useState(mockUserData)
  const [totalScore, setTotalScore] = useState(0)
  const [completedPercentage, setCompletedPercentage] = useState(0)

  useEffect(() => {
    // Simulating API call to fetch user data
    const fetchUserData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserData(mockUserData)
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const completed = achievements.filter(a => isAchievementCompleted(a))
    const score = completed.reduce((sum, a) => sum + a.score, 0)
    setTotalScore(score)
    setCompletedPercentage((completed.length / achievements.length) * 100)
  }, [userData])

  const isAchievementCompleted = (achievement:any) => {
    switch (achievement.type) {
      case 'savings':
        return userData.savingsAmount >= achievement.target
      case 'budgetAdherence':
        return userData.monthlyBudgetAdherence >= achievement.target
      case 'investment':
        return userData.investmentAmount > 0
      case 'transactions':
        return userData.totalTransactions >= achievement.target
      // Add more cases for other achievement types
      default:
        return false
    }
  }

  const getValidCoupons = () => {
    return coupons.filter(coupon => totalScore >= coupon.minScore)
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>Your Financial Achievements</h1>
      
      <div className='mb-8 bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold mb-4'>Your Progress</h2>
        <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
          <div 
            className='bg-blue-600 h-4 rounded-full' 
            style={{ width: `${completedPercentage}%` }}
          ></div>
        </div>
        <p className='text-center'>{completedPercentage.toFixed(1)}% Completed</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {achievements.map((achievement) => (
          <div key={achievement.id} className='bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-all duration-300 hover:shadow-lg'>
            <Trophy className={`w-12 h-12 mb-4 ${isAchievementCompleted(achievement) ? 'text-yellow-400' : 'text-gray-400'}`} />
            <h2 className='text-xl font-semibold text-center mb-2'>{achievement.name}</h2>
            <p className='text-gray-600 text-center mb-4'>{achievement.description}</p>
            <p className='text-blue-600 font-semibold mb-4'>Score: {achievement.score}</p>
            <div className='mt-auto'>
              {isAchievementCompleted(achievement) ? (
                <div className='flex items-center text-green-500'>
                  <CheckCircle className='w-5 h-5 mr-2' />
                  <span>Completed</span>
                </div>
              ) : (
                <div className='flex items-center text-red-500'>
                  <XCircle className='w-5 h-5 mr-2' />
                  <span>Not Completed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Your Coupons</h2>
        {getValidCoupons().length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {getValidCoupons().map((coupon) => (
              <div key={coupon.id} className='border border-green-500 rounded-lg p-4 flex items-center'>
                <Ticket className='w-8 h-8 text-green-500 mr-4' />
                <div>
                  <h3 className='font-semibold'>{coupon.name}</h3>
                  <p className='text-sm text-gray-600'>Code: {coupon.code}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-600'>Complete more achievements to unlock coupons!</p>
        )}
      </div>
    </div>
  )
}

export default AchievementsPage