'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { 
  Search, 
  ScanLine,
  ChevronDown,
  FileText
} from 'lucide-react'

interface CollectionRecord {
  id: number
  idNumber: string
  name: string
  degreeYear: string
  totalFees: number
  totalFines: number
  totalCollectibles: number
  accountBalanceDue: number
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue'
}

/**
 * Collections Management Page Component
 * 
 * Displays collection records, search functionality, and financial data
 * Features report generation and payment status tracking
 */
const CollectionsManagementPage = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAllFilter, setShowAllFilter] = useState('Show all')

  // Sample collections data
  const [collections, setCollections] = useState<CollectionRecord[]>([
    {
      id: 1,
      idNumber: "21-1-0100",
      name: "Rene Angelo D. Tubigon",
      degreeYear: "BS Computer Science - Year 4",
      totalFees: 1500.00,
      totalFines: 200.00,
      totalCollectibles: 1700.00,
      accountBalanceDue: 850.00,
      paymentStatus: 'Partially Paid'
    },
    {
      id: 2,
      idNumber: "21-1-0101",
      name: "Maria Elena Santos",
      degreeYear: "BS Information Technology - Year 3",
      totalFees: 1500.00,
      totalFines: 0.00,
      totalCollectibles: 1500.00,
      accountBalanceDue: 0.00,
      paymentStatus: 'Paid'
    },
    {
      id: 3,
      idNumber: "21-1-0102",
      name: "Carlos Miguel Reyes",
      degreeYear: "BS Computer Engineering - Year 2",
      totalFees: 1500.00,
      totalFines: 500.00,
      totalCollectibles: 2000.00,
      accountBalanceDue: 2000.00,
      paymentStatus: 'Unpaid'
    },
    {
      id: 4,
      idNumber: "21-1-0103",
      name: "Jane Marie Cruz",
      degreeYear: "BS Information Systems - Year 1",
      totalFees: 1500.00,
      totalFines: 750.00,
      totalCollectibles: 2250.00,
      accountBalanceDue: 2250.00,
      paymentStatus: 'Overdue'
    },
    {
      id: 5,
      idNumber: "21-1-0104",
      name: "Robert James Lee",
      degreeYear: "BS Computer Science - Year 5",
      totalFees: 1500.00,
      totalFines: 100.00,
      totalCollectibles: 1600.00,
      accountBalanceDue: 400.00,
      paymentStatus: 'Partially Paid'
    }
  ])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    console.log('Searching for:', value)
  }

  const handleScanQR = () => {
    console.log('Scanning QR code')
    // Implement QR/barcode scanning logic here
  }

  const handleGenerateReport = () => {
    console.log('Generating collection report')
    // Implement report generation logic here
  }

  const handleStudentClick = (record: CollectionRecord) => {
    console.log(`Viewing collection for ${record.name}`)
    // Navigate to collection detail page using student name as route parameter
    const nameParam = record.name.replace(/\s+/g, '-').toLowerCase()
    router.push(`/admin/collections/${nameParam}`)
  }

  const handleFilterChange = (filter: string) => {
    setShowAllFilter(filter)
    console.log('Filter changed to:', filter)
    // Implement filtering logic here
  }

  const getPaymentStatusClasses = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Partially Paid':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Unpaid':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Overdue':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Filter collections based on search query
  const filteredCollections = collections.filter(record =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.idNumber.includes(searchQuery) ||
    record.degreeYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCollections = filteredCollections.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Navigation */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Collection
        </h1>
        
        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            {/* Search Bar with Scan */}
            <div className="relative flex items-center w-[398px] border border-primary rounded-full px-4 py-2 bg-card">
              <Search className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-0 bg-transparent text-sm font-normal placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
              />
              <button
                onClick={handleScanQR}
                className="ml-2 p-1 hover:bg-primary/10 rounded transition-colors"
                title="Scan QR Code"
              >
                <ScanLine className="w-5 h-5 text-primary" />
              </button>
            </div>
            
            {/* Show All Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                className="h-[42px] px-7 rounded-full text-sm font-normal border-primary text-primary hover:bg-primary/5 flex items-center gap-2"
              >
                {showAllFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Filter Button */}
            <Button
              variant="outline"
              className="h-[42px] px-7 rounded-full text-sm font-normal border-primary text-primary hover:bg-primary/5"
            >
              Filter
            </Button>
            
            {/* Sort Button */}
            <Button
              variant="outline"
              className="h-[42px] px-7 rounded-full text-sm font-normal border-primary text-primary hover:bg-primary/5 flex items-center gap-2"
            >
              Sort
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Generate Report Button */}
          <Button
            onClick={handleGenerateReport}
            className="h-[42px] px-5 rounded-lg text-sm font-normal bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
          >
            <FileText className="w-[18px] h-[18px]" />
            Generate report
          </Button>
        </div>
        
        {/* Collections Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="w-full h-[66px] flex items-center px-6 rounded-t-[24px] bg-secondary/50">
            <div className="flex justify-between items-center w-full text-secondary-foreground font-semibold text-base">
              <div className="w-[100px] text-center">ID Number</div>
              <div className="w-[180px] text-center">Name</div>
              <div className="w-[200px] text-center">Degree & Year</div>
              <div className="w-[100px] text-center">Total Fees</div>
              <div className="w-[100px] text-center">Total Fines</div>
              <div className="w-[120px] text-center">Total Collectibles</div>
              <div className="w-[140px] text-center">Account Balance Due</div>
              <div className="w-[120px] text-center">Payment Status</div>
            </div>
          </div>
          
          {/* Table Rows */}
          {currentCollections.map((record, index) => (
            <div
              key={record.id}
              onClick={() => handleStudentClick(record)}
              className="w-full h-[66px] flex items-center px-6 bg-card shadow-sm mt-2 rounded-lg border border-border cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-center w-full text-foreground text-base font-normal">
                <div className="w-[100px] text-center">{record.idNumber}</div>
                <div className="w-[180px] text-center">{record.name}</div>
                <div className="w-[200px] text-center">{record.degreeYear}</div>
                <div className="w-[100px] text-center">₱{record.totalFees.toFixed(2)}</div>
                <div className="w-[100px] text-center">₱{record.totalFines.toFixed(2)}</div>
                <div className="w-[120px] text-center">₱{record.totalCollectibles.toFixed(2)}</div>
                <div className="w-[140px] text-center">₱{record.accountBalanceDue.toFixed(2)}</div>
                <div className="w-[120px] flex justify-center">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium text-center border ${getPaymentStatusClasses(record.paymentStatus)}`}
                  >
                    {record.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* No results message */}
          {currentCollections.length === 0 && (
            <div className="w-full h-[200px] flex items-center justify-center bg-muted rounded-lg mt-4">
              <p className="text-muted-foreground text-lg">No collection records found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredCollections.length > 0 && (
          <div className="flex justify-center mt-16 mb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className="border-primary text-primary hover:bg-primary/5"
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNum)
                        }}
                        className={currentPage === pageNum 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "border-primary text-primary hover:bg-primary/5"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis className="text-primary" />
                    </PaginationItem>
                    
                    <PaginationItem>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(totalPages)
                        }}
                        className="border-primary text-primary hover:bg-primary/5"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className="border-primary text-primary hover:bg-primary/5"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionsManagementPage