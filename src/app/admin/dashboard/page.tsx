import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/revams/navbar' // Updated import path
import { 
  ChevronDown, 
  DollarSign,
  Check,
  Calendar
} from 'lucide-react'

// Event Progress Card Component
const EventProgressCard = () => {
  const facultyData = [
    { name: "Faculty of Computing", percentage: 18, logo: "💻" },
    { name: "Faculty of Nursing", percentage: 89, logo: "🏥" },
    { name: "Faculty of Agriculture and Food Sciences", percentage: 48, logo: "🌾" },
    { name: "Faculty of Management and Economics", percentage: 36, logo: "💼" },
    { name: "Faculty of Forestry and Environmental Science", percentage: 74, logo: "🌳" },
    { name: "Faculty of Computing", percentage: 18, logo: "💻" },
    { name: "Faculty of Nursing", percentage: 89, logo: "🏥" },
    { name: "Faculty of Agriculture and Food Sciences", percentage: 48, logo: "🌾" },
    { name: "Faculty of Management and Economics", percentage: 36, logo: "💼" },
    { name: "Faculty of Forestry and Environmental Science", percentage: 74, logo: "🌳" }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold">
            Event Name
            <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
          </CardTitle>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Current
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {facultyData.map((faculty, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                  {faculty.logo}
                </div>
                <span className="text-sm font-medium">{faculty.name}</span>
              </div>
              <span className="text-sm font-semibold">{faculty.percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${faculty.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Events List Card Component
const EventsCard = () => {
  const events = [
    { name: "Active Event Name - 1st SEM, A.Y. 2025-2026", status: "active" },
    { name: "Past Event Lorem Ipsum Name - 1st SEM, A.Y. 2025-2026", status: "past" },
    { name: "Past Event Dolor Sit Amet Ber Name - 1st SEM, A.Y. 2025-2026", status: "past" },
    { name: "Past Event Ase Lka Ulum Name - 1st SEM, A.Y. 2025-2026", status: "past" },
    { name: "Past Event Name - 1st SEM, A.Y. 2025-2026", status: "past" },
    { name: "Past Event Lorem Dolor Sit Amet - 1st SEM, A.Y. 2025-2026", status: "past" }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              event.status === 'active' 
                ? 'bg-accent' 
                : 'bg-muted'
            }`}>
              {event.status === 'active' ? (
                <Calendar className="w-4 h-4 text-accent-foreground" />
              ) : (
                <Check className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${
                event.status === 'active' 
                  ? 'font-medium text-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {event.name}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Collection Card Component
const CollectionCard = () => {
  const collectionData = [
    { label: "Total Fees", amount: "₱678,238", icon: DollarSign },
    { label: "Total Fines", amount: "₱567,433", icon: DollarSign },
    { label: "Total Collectibles", amount: "₱1,245,671", icon: DollarSign }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Collection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {collectionData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-lg text-primary">{item.amount}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Recent Activity Card Component
const RecentActivityCard = () => {
  const activities = [
    {
      user: "Hanmykel",
      action: "created",
      target: "Event Name",
      timestamp: "06/15/2025 @ 8:15 PM"
    },
    {
      user: "AdminUser",
      action: "updated",
      target: "Collection Settings",
      timestamp: "06/15/2025 @ 7:30 PM"
    },
    {
      user: "JohnDoe",
      action: "deleted",
      target: "Past Event",
      timestamp: "06/15/2025 @ 6:45 PM"
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="p-3 border-l-4 border-secondary bg-muted/20 rounded-r-lg">
            <p className="text-sm">
              <span className="font-semibold text-primary">{activity.user}</span>
              <span className="text-muted-foreground"> {activity.action} </span>
              <span className="font-medium">"{activity.target}"</span>
              <span className="text-muted-foreground"> on </span>
              <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component (uses imported Navbar)
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Navbar />
        
        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Event Progress Card */}
          <div className="flex-1 lg:flex-[2]">
            <EventProgressCard />
          </div>
          
          {/* Right Side - Cards Column */}
          <div className="flex-1 space-y-6">
            <EventsCard />
            <CollectionCard />
            <RecentActivityCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard