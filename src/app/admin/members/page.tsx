'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
  X, 
  Calendar, 
  Users, 
  Plus, 
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import EditMemberModal from '@/components/revams/editMemberModal'

interface Member {
  id: number
  studentId: string
  name: string
  degreeProgram: string
  yearLevel: string
  firstName?: string
  middleName?: string
  lastName?: string
  major?: string
}

/**
 * Members Management Page Component
 * 
 * Displays member statistics, search functionality, and member table
 * Features RFID generation, export, and member management actions
 */
const MembersManagementPage = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  // Sample members data
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      studentId: "21-1-01000",
      name: "Ma Christian Barte",
      degreeProgram: "BS Computer Science",
      yearLevel: "Year 5",
      firstName: "Ma",
      middleName: "Christian",
      lastName: "Barte",
      major: "N/A"
    },
    {
      id: 2,
      studentId: "21-1-01001",
      name: "John Doe Smith",
      degreeProgram: "BS Information Technology",
      yearLevel: "Year 3",
      firstName: "John",
      middleName: "Doe",
      lastName: "Smith",
      major: "Software Development"
    },
    {
      id: 3,
      studentId: "21-1-01002",
      name: "Jane Marie Santos",
      degreeProgram: "BS Computer Engineering",
      yearLevel: "Year 4",
      firstName: "Jane",
      middleName: "Marie",
      lastName: "Santos",
      major: "Hardware Engineering"
    },
    {
      id: 4,
      studentId: "21-1-01003",
      name: "Carlos Miguel Reyes",
      degreeProgram: "BS Computer Science",
      yearLevel: "Year 2",
      firstName: "Carlos",
      middleName: "Miguel",
      lastName: "Reyes",
      major: "N/A"
    },
    {
      id: 5,
      studentId: "21-1-01004",
      name: "Maria Elena Cruz",
      degreeProgram: "BS Information Systems",
      yearLevel: "Year 1",
      firstName: "Maria",
      middleName: "Elena",
      lastName: "Cruz",
      major: "N/A"
    },
    {
      id: 6,
      studentId: "21-1-01005",
      name: "Robert James Lee",
      degreeProgram: "BS Computer Science",
      yearLevel: "Year 5",
      firstName: "Robert",
      middleName: "James",
      lastName: "Lee",
      major: "Artificial Intelligence"
    }
  ])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Implement search logic here
    console.log('Searching for:', value)
  }

  const handleViewMember = (member: Member) => {
    console.log(`Viewing member ${member.studentId}`)
    // Navigate to member detail page
    router.push(`/admin/members/member/${member.studentId}`)
  }

  const handleEditMember = (member: Member) => {
    console.log(`Editing member ${member.studentId}`)
    setEditingMember(member)
    setEditModalOpen(true)
  }

  const handleMoreOptions = (memberId: number) => {
    console.log(`More options for member ${memberId}`)
    // Implement more options logic here (dropdown menu, etc.)
  }

  const handleGenerateRFID = () => {
    console.log('Generating RFID')
    // Implement RFID generation logic here
  }

  const handleSaveMember = (updatedMember: Member) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === updatedMember.id ? updatedMember : member
      )
    )
    console.log('Member updated:', updatedMember)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditingMember(null)
  }

  const handleExport = () => {
    console.log('Exporting members')
    // Implement export logic here
  }

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.studentId.includes(searchQuery) ||
    member.degreeProgram.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Navigation */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-primary mb-8">
          Members
        </h1>
        
        {/* Statistics Cards */}
        <Card className="mb-8 bg-primary/10 border-0 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex justify-center items-center gap-[400px]">
              {/* New Members This Month */}
              <div className="flex flex-col items-center gap-4">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-base text-primary text-center">
                  23 New This Month
                </span>
              </div>
              
              {/* Total Members */}
              <div className="flex flex-col items-center gap-4">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-base text-primary text-center">
                  1,247 Total Members
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex items-center max-w-md border border-primary rounded-full px-4 py-2">
              <Search className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members..."
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
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Export Button */}
            <Button
              onClick={handleExport}
              variant="outline"
              className="h-[49px] px-6 rounded-lg text-sm font-normal border border-border bg-card hover:bg-accent"
            >
              <Download className="w-6 h-6 mr-2" />
              Export
            </Button>
            
            {/* Generate RFID Button */}
            <Button
              onClick={handleGenerateRFID}
              className="h-[49px] px-6 rounded-lg text-sm font-normal bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3 h-3 mr-2" />
              Generate RFID
            </Button>
          </div>
        </div>
        
        {/* Members Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="w-full h-[66px] flex items-center px-6 rounded-t-[24px] bg-primary">
            <div className="flex justify-between items-center w-full">
              <div className="text-primary-foreground font-semibold text-base w-[120px] text-center">
                Student ID
              </div>
              <div className="text-primary-foreground font-semibold text-base w-[200px] text-center">
                Name
              </div>
              <div className="text-primary-foreground font-semibold text-base w-[200px] text-center">
                Degree Program
              </div>
              <div className="text-primary-foreground font-semibold text-base w-[120px] text-center">
                Year Level
              </div>
              <div className="text-primary-foreground font-semibold text-base w-[100px] text-center">
                Actions
              </div>
            </div>
          </div>
          
          {/* Table Rows */}
          {currentMembers.map((member, index) => (
            <div
              key={member.id}
              className="w-full h-[66px] flex items-center px-6 rounded-lg bg-primary/10 shadow-sm mt-4"
            >
              <div className="flex justify-between items-center w-full">
                <div className="text-primary text-base font-normal w-[120px] text-center">
                  {member.studentId}
                </div>
                <div className="text-primary text-base font-normal w-[200px] text-center">
                  {member.name}
                </div>
                <div className="text-primary text-base font-normal w-[200px] text-center">
                  {member.degreeProgram}
                </div>
                <div className="text-primary text-base font-normal w-[120px] text-center">
                  {member.yearLevel}
                </div>
                <div className="w-[100px] flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleViewMember(member)}
                    className="p-1 hover:bg-primary/20 rounded"
                    title="View member details"
                  >
                    <Eye className="w-6 h-6 text-primary" />
                  </button>
                  <button
                    onClick={() => handleEditMember(member)}
                    className="p-1 hover:bg-primary/20 rounded"
                    title="Edit member"
                  >
                    <Edit className="w-6 h-6 text-primary" />
                  </button>
                  <button
                    onClick={() => handleMoreOptions(member.id)}
                    className="p-1 hover:bg-primary/20 rounded"
                    title="More options"
                  >
                    <MoreHorizontal className="w-6 h-6 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* No results message */}
          {currentMembers.length === 0 && (
            <div className="w-full h-[200px] flex items-center justify-center bg-primary/5 rounded-lg mt-4">
              <p className="text-primary/50 text-lg">No members found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Results Counter and Pagination */}
        {filteredMembers.length > 0 && (
          <div className="flex justify-between items-center mt-16 mb-8">
            <div className="text-primary font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} results
            </div>
            
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
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                          }}
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
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      {/* Edit Member Modal - THIS WAS MISSING! */}
      <EditMemberModal
        isOpen={editModalOpen}
        member={editingMember}
        onClose={handleCloseEditModal}
        onSave={handleSaveMember}
      />
    </div>
  )
}

export default MembersManagementPage