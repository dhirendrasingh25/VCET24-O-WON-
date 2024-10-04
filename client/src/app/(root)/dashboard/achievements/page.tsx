'use client'

import React, { useEffect, useState } from 'react'
import { Trophy, CheckCircle, XCircle, Ticket, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'

// Mock data to simulate backend API response for initial loading
const mockUserData = {
  totalTransactions: 0,
  totalAmount: 0,
  streakDays: 0,
  savingsAmount: 0,
  monthlyBudgetAdherence: 0,
  investmentAmount: 0,
}

const achievements = [
  { id: 1, name: "Savings Starter", description: "Save your first ₹1,000", target: 1000, type: 'savings', score: 10 },
  { id: 2, name: "Budget Master", description: "Stick to your monthly budget for 30 days", target: 30, type: 'budgetAdherence', score: 20 },
  { id: 3, name: "Investment Initiator", description: "Make your first investment", target: 1, type: 'investment', score: 15 },
  { id: 4, name: "Frugal Fortune", description: "Save ₹10,000 in total", target: 10000, type: 'savings', score: 25 },
  { id: 5, name: "Transaction Tamer", description: "Complete 100 transactions", target: 100, type: 'transactions', score: 20 },
  { id: 6, name: "Savings Sage", description: "Save 20% of your income for 3 consecutive months", target: 3, type: 'savingsStreak', score: 30 },
  { id: 7, name: "Diverse Portfolio", description: "Invest in 3 different types of assets", target: 3, type: 'investmentDiversity', score: 40 },
  { id: 8, name: "Expense Eliminator", description: "Reduce monthly expenses by 15%", target: 15, type: 'expenseReduction', score: 30 },
  { id: 9, name: "Financial Freedom Fighter", description: "Save 6 months worth of expenses", target: 6, type: 'emergencyFund', score: 50 },
]

const coupons = [
  { id: 1, name: "10% off next investment", code: "INVEST10", minScore: 50 },
  { id: 2, name: "Free financial consultation", code: "CONSULT2023", minScore: 100 },
  { id: 3, name: "₹500 bonus on ₹10,000 savings", code: "SAVE500", minScore: 150 },
  { id: 4, name: "Premium features free for 1 month", code: "PREMIUM1MONTH", minScore: 200 },
]

const AchievementsPage = () => {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState(mockUserData)
  const [totalScore, setTotalScore] = useState(0)
  const [completedPercentage, setCompletedPercentage] = useState(0)

  useEffect(() => {
    if (session && session.user?.email) {
      fetchUserData(session.user.email)
    }
  }, [session])

  const fetchUserData = async (email: string) => {
    console.log(email);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-transactions-summary?email_id=${email}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data);
      
      if (data.success) {
        // Assuming data.summary contains arrays of transactions
        setUserData({
          totalTransactions: data.summary.yearly.length, // Example mapping
          totalAmount: calculateTotalAmount(data.summary.yearly), // Function to calculate total amount from transactions
          streakDays: calculateStreakDays(data.summary.weekly), // Function to calculate streak days from transactions
          savingsAmount: calculateSavings(data.summary.monthly), // Custom logic to calculate savings
          monthlyBudgetAdherence: calculateBudgetAdherence(data.summary.monthly), // Custom logic to calculate budget adherence
          investmentAmount: calculateInvestmentAmount(data.summary.yearly) // Custom logic to calculate investment amount
        });
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  // Example helper functions:
  const calculateTotalAmount = (transactions:any) => {
    // Calculate the total amount from the transactions array
    return transactions.reduce((acc:any, transaction:any) => acc + transaction.amount, 0);
  };
  
  const calculateStreakDays = (transactions:any) => {
    // Custom logic to calculate the streak of transactions
    return transactions.length;
  };
  
  const calculateSavings = (transaction:any) => {
    // Example custom logic for savings calculation
    return transaction.reduce((acc:any, transaction:any) => acc + transaction.savings, 0);
  };
  
  const calculateBudgetAdherence = (transactions:any) => {
    // Custom logic to calculate budget adherence percentage
    return (transactions.filter(t => t.withinBudget).length / transactions.length) * 100;
  };
  
  const calculateInvestmentAmount = (transactions:any) => {
    // Example custom logic for calculating investment
    return transactions.reduce((acc:any, transaction:any) => acc + (transaction.isInvestment ? transaction.amount : 0), 0);
  };
  

  useEffect(() => {
    const completed = achievements.filter(a => isAchievementCompleted(a))
    const score = completed.reduce((sum, a) => sum + a.score, 0)
    setTotalScore(score)
    setCompletedPercentage((completed.length / achievements.length) * 100)
  }, [userData])

  const isAchievementCompleted = (achievement:any) => {
    switch (achievement.type) {
      case 'savings':
        return userData?.savingsAmount >= achievement.target
      case 'budgetAdherence':
        return userData?.monthlyBudgetAdherence >= achievement.target
      case 'investment':
        return userData?.investmentAmount > 0
      case 'transactions':
        return userData?.totalTransactions >= achievement.target
      case 'savingsStreak':
      case 'budgetStreak':
      case 'investmentDiversity':
      case 'expenseReduction':
      case 'emergencyFund':
        return false
      default:
        return false
    }
  }

  const isCouponUnlocked = (coupon:any) => {
    return totalScore >= coupon.minScore
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
        <p className='text-center mt-2'>Total Score: {totalScore}</p>
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
        <h2 className='text-2xl font-semibold mb-4'>Available Coupons</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {coupons.map((coupon) => (
            <div key={coupon.id} className={`border rounded-lg p-4 flex items-center ${isCouponUnlocked(coupon) ? 'border-green-500' : 'border-gray-300'}`}>
              {isCouponUnlocked(coupon) ? (
                <Ticket className='w-8 h-8 text-green-500 mr-4' />
              ) : (
                <Lock className='w-8 h-8 text-gray-400 mr-4' />
              )}
              <div>
                <h3 className='font-semibold'>{coupon.name}</h3>
                {isCouponUnlocked(coupon) ? (
                  <p className='text-sm text-gray-600'>Code: {coupon.code}</p>
                ) : (
                  <p className='text-sm text-gray-600'>Unlock at {coupon.minScore} points</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AchievementsPage
