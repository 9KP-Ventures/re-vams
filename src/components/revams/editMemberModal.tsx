'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { X, ChevronDown } from 'lucide-react'

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

interface EditMemberModalProps {
  isOpen: boolean
  member: Member | null
  onClose: () => void
  onSave: (updatedMember: Member) => void
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    degreeProgram: '',
    yearLevel: '',
    major: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({
    degreeProgram: false,
    yearLevel: false,
  })

  const degreeProgramOptions = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Computer Engineering',
    'BS Information Systems',
    'BS Software Engineering',
  ]

  const yearLevelOptions = [
    'Year 1',
    'Year 2',
    'Year 3',
    'Year 4',
    'Year 5',
  ]

  useEffect(() => {
    if (member) {
      // Parse the full name if firstName, middleName, lastName are not provided
      const nameParts = member.name.split(' ')
      setFormData({
        firstName: member.firstName || nameParts[0] || '',
        middleName: member.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : nameParts[1] || ''),
        lastName: member.lastName || nameParts[nameParts.length - 1] || '',
        degreeProgram: member.degreeProgram || '',
        yearLevel: member.yearLevel || '',
        major: member.major || 'N/A',
      })
    }
  }, [member])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDropdownSelect = (field: 'degreeProgram' | 'yearLevel', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    setDropdownOpen(prev => ({
      ...prev,
      [field]: false,
    }))
  }

  const handleSubmit = () => {
    if (!member) return

    const updatedMember: Member = {
      ...member,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.replace(/\s+/g, ' ').trim(),
      degreeProgram: formData.degreeProgram,
      yearLevel: formData.yearLevel,
      major: formData.major,
    }

    onSave(updatedMember)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <Card className="relative w-[465px] h-[630px] bg-gradient-to-br from-white/70 to-background border-0 rounded-[32px] shadow-2xl backdrop-blur-md">
        <CardContent className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Edit Member
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-normal text-primary mb-2">
                First Name
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full h-9 border border-black/50 rounded-lg bg-transparent text-primary focus:ring-0 focus:border-primary"
                placeholder="First Name"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-normal text-primary mb-2">
                Middle Name
              </label>
              <Input
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full h-9 border border-black/50 rounded-lg bg-transparent text-primary focus:ring-0 focus:border-primary"
                placeholder="Middle Name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-normal text-primary mb-2">
                Last Name
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full h-9 border border-black/50 rounded-lg bg-transparent text-primary focus:ring-0 focus:border-primary"
                placeholder="Last Name"
              />
            </div>

            {/* Degree Program */}
            <div className="relative">
              <label className="block text-sm font-normal text-primary mb-2">
                Degree Program
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(prev => ({ ...prev, degreeProgram: !prev.degreeProgram }))}
                  className="w-full h-9 px-3 border border-black/50 rounded-lg bg-transparent text-left text-primary flex items-center justify-between hover:border-primary focus:border-primary transition-colors"
                >
                  <span>{formData.degreeProgram || 'Select Degree Program'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {dropdownOpen.degreeProgram && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {degreeProgramOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDropdownSelect('degreeProgram', option)}
                        className="w-full px-3 py-2 text-left text-primary hover:bg-primary/10 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Year Level */}
            <div className="relative">
              <label className="block text-sm font-normal text-primary mb-2">
                Year Level
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(prev => ({ ...prev, yearLevel: !prev.yearLevel }))}
                  className="w-full h-9 px-3 border border-black/50 rounded-lg bg-transparent text-left text-primary flex items-center justify-between hover:border-primary focus:border-primary transition-colors"
                >
                  <span>{formData.yearLevel || 'Select Year Level'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {dropdownOpen.yearLevel && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {yearLevelOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDropdownSelect('yearLevel', option)}
                        className="w-full px-3 py-2 text-left text-primary hover:bg-primary/10 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Major */}
            <div>
              <label className="block text-sm font-normal text-primary mb-2">
                Major
              </label>
              <Input
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full h-9 border border-black/50 rounded-lg bg-transparent text-primary focus:ring-0 focus:border-primary"
                placeholder="Major"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-5 mt-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="h-8 px-4 bg-white/50 border border-black/50 text-primary text-xs hover:bg-primary/10 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="h-8 px-4 bg-primary text-white text-xs hover:bg-primary/90 transition-colors"
            >
              Save Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditMemberModal