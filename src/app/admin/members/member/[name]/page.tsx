'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/revams/navbar'
import { MoreHorizontal, Check, User, ArrowLeft } from 'lucide-react'

/**
 * Specific Member Detail Page Component
 * 
 * Displays detailed information about a specific member
 * Including personal info, academic details, payment history, and recent activity
 * 
 * @param params - Dynamic route parameters
 */
interface MemberDetailPageProps {
  params: {
    studentId: string
  }
}

const MemberDetailPage = ({ params }: MemberDetailPageProps) => {
  const router = useRouter()
  
  // In a real app, you'd fetch member data based on params.studentId
  // For now, we'll simulate fetching data
  const memberData = {
    name: "Ma Christian Barte",
    studentId: params.studentId || "21-1-01000",
    firstName: "Ma",
    middleName: "Christian", 
    lastName: "Barte",
    yearLevel: "Year 5",
    degreeProgram: "BS Computer Science",
    major: "N/A"
  }

  const paymentHistory = [
    {
      id: 1,
      date: "June 15, 2025",
      description: "Membership Fee (First Semester, AY 2024-2025)",
      amount: "₱ 50.00",
      status: "Paid",
      statusColor: "#52CB8C",
      statusTextColor: "#146939",
      backgroundColor: "rgba(16, 147, 79, 0.12)"
    },
    {
      id: 2,
      date: "January 05, 2025", 
      description: "Membership Fee (First Semester, AY 2023-2025)",
      amount: "₱ 25.00",
      status: "Partially Paid",
      statusColor: "rgba(255, 185, 0, 0.5)",
      statusTextColor: "#DB7C15",
      backgroundColor: "rgba(254, 197, 46, 0.12)"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: "Payment Confirmed",
      time: "2 hours ago",
      icon: Check,
      color: "#52CB8C"
    },
    {
      id: 2,
      title: "Profile Updated", 
      time: "1 week ago",
      icon: User,
      color: "#52CB8C"
    }
  ]

  const handleGoBack = () => {
    router.push('/admin/members')
  }

  const handleMoreOptions = () => {
    console.log('More options for member:', memberData.studentId)
    // Implement more options logic here
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Navigation */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2 text-primary border-primary hover:bg-primary/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Button>
        </div>

        {/* Member Header Card */}
        <Card className="border border-border shadow-sm rounded-lg">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                {/* Breadcrumb */}
                <p className="text-sm text-primary/50 mb-2">
                  Members / {memberData.name}
                </p>
                
                {/* Member Name */}
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {memberData.name}
                </h1>
                
                {/* Student ID */}
                <p className="text-base font-medium text-primary/50">
                  Student ID: {memberData.studentId}
                </p>
              </div>
              
              {/* More Options Button */}
              <button 
                onClick={handleMoreOptions}
                className="p-2 border border-primary/50 rounded hover:bg-primary/5 transition-colors"
              >
                <MoreHorizontal className="w-6 h-6 text-primary/50" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Personal and Academic Information Card */}
        <Card className="border border-border shadow-sm rounded-lg">
          <CardContent className="p-8">
            <h2 className="text-4xl font-semibold text-primary mb-8">
              Personal and Academic Information
            </h2>
            
            {/* Divider Line */}
            <div className="w-full h-px bg-primary/50 mb-8"></div>
            
            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {/* First Name */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  FIRST NAME
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.firstName}
                </p>
              </div>
              
              {/* Last Name */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  LAST NAME
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.lastName}
                </p>
              </div>
              
              {/* Middle Name */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  MIDDLE NAME
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.middleName}
                </p>
              </div>
              
              {/* Degree Program */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  DEGREE PROGRAM
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.degreeProgram}
                </p>
              </div>
              
              {/* Year Level */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  YEAR LEVEL
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.yearLevel}
                </p>
              </div>
              
              {/* Major */}
              <div>
                <h3 className="text-xl font-medium text-primary/50 mb-2">
                  MAJOR
                </h3>
                <p className="text-2xl text-primary">
                  {memberData.major}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card className="border border-border shadow-sm rounded-lg">
          <CardContent className="p-8">
            <h2 className="text-4xl font-semibold text-primary mb-8">
              Payment History
            </h2>
            
            {/* Payment Table */}
            <div className="w-full">
              {/* Table Header */}
              <div className="w-full h-[66px] flex items-center px-6 bg-primary rounded-t-lg">
                <div className="flex justify-between items-center w-full">
                  <div className="text-primary-foreground font-semibold text-base w-[150px] text-center">
                    Date
                  </div>
                  <div className="text-primary-foreground font-semibold text-base flex-1 text-center">
                    Description
                  </div>
                  <div className="text-primary-foreground font-semibold text-base w-[120px] text-center">
                    Amount
                  </div>
                  <div className="text-primary-foreground font-semibold text-base w-[120px] text-center">
                    Status
                  </div>
                </div>
              </div>
              
              {/* Payment Rows */}
              {paymentHistory.map((payment, index) => (
                <div
                  key={payment.id}
                  className="w-full h-[66px] flex items-center px-6 rounded-lg shadow-sm mt-4"
                  style={{ background: payment.backgroundColor }}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="text-primary text-base font-normal w-[150px] text-center">
                      {payment.date}
                    </div>
                    <div className="text-primary text-base font-normal flex-1 text-center">
                      {payment.description}
                    </div>
                    <div className="text-primary text-base font-normal w-[120px] text-center">
                      {payment.amount}
                    </div>
                    <div className="w-[120px] flex justify-center">
                      <div
                        className="px-3 py-1 rounded text-sm font-medium text-center"
                        style={{ 
                          background: payment.statusColor,
                          color: payment.statusTextColor
                        }}
                      >
                        {payment.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* No payments message */}
              {paymentHistory.length === 0 && (
                <div className="w-full h-[100px] flex items-center justify-center bg-primary/5 rounded-b-lg">
                  <p className="text-primary/50 text-lg">No payment history available.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border border-border shadow-sm rounded-lg">
          <CardContent className="p-8">
            <h2 className="text-4xl font-semibold text-primary mb-8">
              Recent Activity
            </h2>
            
            {/* Activity Timeline */}
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="relative flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: activity.color }}
                  >
                    <activity.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-medium text-primary mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-xl text-primary/50">
                      {activity.time}
                    </p>
                  </div>
                  
                  {/* Timeline Line (except for last item) */}
                  {index < recentActivity.length - 1 && (
                    <div 
                      className="absolute left-6 top-12 w-0.5 h-16 bg-primary/20"
                      style={{ transform: 'translateX(-50%)' }}
                    ></div>
                  )}
                </div>
              ))}
              
              {/* No activity message */}
              {recentActivity.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-primary/50 text-lg">No recent activity.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MemberDetailPage