'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/revams/navbar'
import { 
  ArrowLeft,
  ArrowRight,
  QrCode
} from 'lucide-react'

interface CollectionDetailPageProps {
  params: {
    name: string
  }
}

interface FeeItem {
  id: number
  title: string
  academicYear: string
  amount: number
  isChecked: boolean
}

interface StudentData {
  name: string
  studentId: string
  email: string
  degree: string
  totalPaid: number
  totalUnpaid: number
}

const CollectionDetailPage = ({ params }: CollectionDetailPageProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Fees')

  // In a real app, you'd fetch student data based on params.name
  const studentData: StudentData = {
    name: "Rene Angelo D. Tubigon",
    studentId: "21-1-01000",
    email: "21-1-0100@vsu.edu.ph", 
    degree: "Bachelor of Science in Computer Science",
    totalPaid: 350.00,
    totalUnpaid: 50.00
  }

  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    {
      id: 1,
      title: "Membership Fee",
      academicYear: "AY 2024-2025",
      amount: 50.00,
      isChecked: false
    },
    {
      id: 2,
      title: "Membership Fee", 
      academicYear: "AY 2024-2025",
      amount: 50.00,
      isChecked: false
    },
    {
      id: 3,
      title: "Membership Fee",
      academicYear: "AY 2024-2025", 
      amount: 50.00,
      isChecked: false
    },
    {
      id: 4,
      title: "Membership Fee",
      academicYear: "AY 2024-2025",
      amount: 50.00,
      isChecked: false
    },
    {
      id: 5,
      title: "Membership Fee",
      academicYear: "AY 2024-2025",
      amount: 50.00,
      isChecked: false
    }
  ])

  const handleBack = () => {
    router.push('/admin/collections')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleFeeToggle = (id: number) => {
    setFeeItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    )
  }

  const tabs = ['Fees', 'Fines', 'Summary']

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Navigation */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-normal">Back</span>
        </button>

        {/* Student Header */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {studentData.name}
          </h1>
          <Button
            variant="default" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-1 rounded-full text-xs"
          >
            Pending
            <ArrowRight className="w-3 h-3 ml-1 rotate-90" />
          </Button>
        </div>
        <p className="text-sm text-foreground mb-6">
          {studentData.studentId} | BSCS-4
        </p>

        {/* Tab Navigation */}
        <div className="w-full h-20 bg-secondary/20 rounded-2xl mb-6 relative">
          {/* Fees Tab */}
          <div className="absolute left-3 top-3 bottom-3">
            {activeTab === 'Fees' ? (
              <div className="bg-primary h-full w-80 rounded-s-lg flex items-center justify-center gap-1 shadow-md relative">
                <span className="text-primary-foreground font-normal">Fees</span>
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
                {/* Arrow pointing right - full height */}
                <div className="absolute -right-3 top-0 w-0 h-0 border-l-[12px] border-l-primary border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent"></div>
              </div>
            ) : (
              <button
                onClick={() => handleTabChange('Fees')}
                className="h-full w-80 flex items-center justify-center text-base font-normal text-foreground/50 hover:text-foreground/70 transition-colors"
              >
                Fees
              </button>
            )}
          </div>
          
          {/* Fines Tab */}
          <div className="absolute left-1/2 top-3 bottom-3 transform -translate-x-1/2">
            {activeTab === 'Fines' ? (
              <div className="bg-primary h-full w-80 rounded-s-lg flex items-center justify-center gap-1 shadow-md relative">
                <span className="text-primary-foreground font-normal">Fines</span>
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
                {/* Arrow pointing right - full height */}
                <div className="absolute -right-3 top-0 w-0 h-0 border-l-[12px] border-l-primary border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent"></div>
              </div>
            ) : (
              <button
                onClick={() => handleTabChange('Fines')}
                className="h-full w-80 flex items-center justify-center text-base font-normal text-foreground/50 hover:text-foreground/70 transition-colors"
              >
                Fines
              </button>
            )}
          </div>
          
          {/* Summary Tab */}
          <div className="absolute right-3 top-3 bottom-3">
            {activeTab === 'Summary' ? (
              <div className="bg-primary h-full w-80 rounded-lg flex items-center justify-center gap-1 shadow-md relative">
                <span className="text-primary-foreground font-normal">Summary</span>
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
                {/* Arrow pointing right - full height */}
              </div>
            ) : (
              <button
                onClick={() => handleTabChange('Summary')}
                className="h-full w-80 flex items-center justify-center text-base font-normal text-foreground/50 hover:text-foreground/70 transition-colors"
              >
                Summary
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Fee Items */}
          <div className="flex-1">
            <div className="space-y-6">
              {feeItems.map((item) => (
                <Card key={item.id} className="border border-border shadow-lg">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <button
                          onClick={() => handleFeeToggle(item.id)}
                          className={`w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center transition-colors ${
                            item.isChecked ? 'bg-primary' : 'bg-transparent'
                          }`}
                        >
                          {item.isChecked && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </button>
                        
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-sm text-foreground">
                            {item.academicYear}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-base font-normal text-foreground">
                        ₱{item.amount.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Student Info & Summary */}
          <div className="w-[355px] space-y-6">
            {/* Student Info Card */}
            <Card className="border border-border shadow-lg">
              <CardContent>
                <h3 className="text-base font-bold text-foreground mb-6">
                  {studentData.name}
                </h3>
                <div className="space-y-3 text-sm text-foreground">
                  <p>{studentData.email}</p>
                  <p>{studentData.degree}</p>
                </div>
                
                {/* QR Code Placeholder */}
                <div className="mt-8 flex justify-center">
                  <div className="w-40 h-40 bg-secondary/50 rounded-lg flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Fees Summary */}
            <Card className="border border-border shadow-lg">
              <CardContent>
                <h3 className="text-base font-bold text-foreground mb-6">
                  Total fees
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Paid</span>
                    <span className="text-sm text-foreground">₱{studentData.totalPaid.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Unpaid</span>
                    <span className="text-sm text-foreground">₱{studentData.totalUnpaid.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailPage