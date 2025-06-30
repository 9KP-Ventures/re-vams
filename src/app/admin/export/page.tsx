'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Navbar from '@/components/revams/navbar'
import { Search, X } from 'lucide-react'

/**
 * Export Events Page Component
 * 
 * Displays a table of events with export functionality
 * Features search, filter, sort, and pagination
 */
const ExportEventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Sample events data
  const events = [
    {
      id: 1,
      name: "Graduation day",
      dateTime: "July 25, 2025 | 8:00 AM - 5:00 PM",
      host: "USSC VSU Main"
    },
    {
      id: 2,
      name: "Graduation day",
      dateTime: "July 25, 2025 | 8:00 AM - 5:00 PM",
      host: "USSC VSU Main"
    },
    {
      id: 3,
      name: "Graduation day",
      dateTime: "July 25, 2025 | 8:00 AM - 5:00 PM",
      host: "USSC VSU Main"
    },
    {
      id: 4,
      name: "Graduation day",
      dateTime: "July 25, 2025 | 8:00 AM - 5:00 PM",
      host: "USSC VSU Main"
    },
    {
      id: 5,
      name: "Graduation day",
      dateTime: "July 25, 2025 | 8:00 AM - 5:00 PM",
      host: "USSC VSU Main"
    }
  ]

  const handleExport = (eventId: number) => {
    console.log(`Exporting event ${eventId}`)
    // Implement export logic here
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Implement search logic here
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Navigation */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary mb-6">
          Export events
        </h1>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex items-center flex-1 max-w-md border border-primary rounded-full px-4 py-2">
            <Search className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 bg-transparent text-sm font-normal placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Filter Button */}
          <Button
            variant="outline"
            className="h-[42px] px-6 rounded-full text-sm font-normal border-primary text-primary hover:bg-primary/5"
          >
            Filter
          </Button>
          
          {/* Sort Button */}
          <Button
            variant="outline"
            className="h-[42px] px-6 rounded-full text-sm font-normal border-primary text-primary hover:bg-primary/5"
          >
            Sort
          </Button>
        </div>
        
        {/* Events Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="w-full h-[66px] flex items-center px-6 rounded-t-[24px] bg-primary">
            <div className="flex justify-between items-center w-full max-w-[1142px] mx-auto">
              <div className="text-primary-foreground font-semibold text-base">
                Name
              </div>
              <div className="text-primary-foreground font-semibold text-base">
                Date and Time
              </div>
              <div className="text-primary-foreground font-semibold text-base">
                Host
              </div>
              <div className="text-primary-foreground font-semibold text-base">
                Actions
              </div>
            </div>
          </div>
          
          {/* Table Rows */}
          {events.map((event, index) => (
            <div
              key={event.id}
              className="w-full h-[66px] flex items-center px-6 rounded-lg bg-primary/10 shadow-sm mt-4"
            >
              <div className="flex justify-between items-center w-full max-w-[1142px] mx-auto">
                <div className="text-primary text-base font-normal">
                  {event.name}
                </div>
                <div className="text-primary text-base font-normal">
                  {event.dateTime}
                </div>
                <div className="text-primary text-base font-normal">
                  {event.host}
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => handleExport(event.id)}
                    className="h-[36px] px-[18px] rounded-lg text-xs bg-primary/20 text-primary hover:bg-primary/30 border-0"
                    variant="secondary"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="w-full flex justify-end mt-16 mb-8">
          <div className="[&>nav]:!justify-end [&>nav]:!mx-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                  />
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(1)
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === 2}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(2)
                    }}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === 3}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(3)
                    }}
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(9)
                    }}
                  >
                    9
                  </PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(10)
                    }}
                  >
                    10
                  </PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < 10) setCurrentPage(currentPage + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportEventsPage