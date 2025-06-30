'use client'

import React from 'react'
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings
} from 'lucide-react'

/**
 * ReVAMS Navigation Bar Component
 * 
 * A reusable navbar component with golden gradient background and navigation icons.
 * Features a centered logo with elliptical design and symmetrical icon layout.
 * 
 * @returns JSX.Element - The rendered navbar component
 */
const Navbar = () => {
  return (
    <div className="w-full flex justify-center px-4 mb-8">
      {/* Main Navbar Container */}
      <div className="relative w-[700px] h-[130px]">
        {/* Base Background with gradient */}
        <div 
          className="absolute w-[700px] h-[91px] top-[39px] left-0 rounded-[48px]"
          style={{
            background: 'linear-gradient(183.19deg, rgba(251, 216, 60, 0.4) 2.64%, #FEC52E 97.36%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}
        />
        
        {/* Secondary Background */}
        <div 
          className="absolute w-[700px] h-[91px] top-[39px] left-0 rounded-[48px]"
          style={{ background: '#FBD83C' }}
        />
        
        {/* Logo Area */}
        <div className="absolute left-1/2 top-[15px] transform -translate-x-1/2">
          {/* Outer Ellipse */}
          <div 
            className="w-[112px] h-[111px] rounded-full relative"
            style={{ background: '#D9D9D9' }}
          >
            {/* Inner Ellipse */}
            <div 
              className="absolute w-[88px] h-[88px] rounded-full top-[12px] left-[12px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 244, 244, 0.8) 23%, rgba(251, 216, 60, 0.2) 100%)',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Logo Container */}
              <div className="w-[45px] h-[48px] flex items-center justify-center">
                {/* Try to load image, fallback to text */}
                <div 
                  className="w-full h-full bg-contain bg-no-repeat bg-center"
                  style={{ 
                    backgroundImage: "url('/logo-revams.png')",
                  }}
                >
                  {/* Fallback text if image doesn't load */}
                  <div 
                    className="w-full h-full flex items-center justify-center font-bold text-2xl"
                    style={{ color: '#26442C' }}
                  >
                    R
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Left Icons Frame */}
        <div className="absolute left-[117px] top-[67px] flex flex-row items-center gap-[48px]">
          <button 
            className="w-[36px] h-[36px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="People"
          >
            <Users 
              className="w-[24px] h-[24px]" 
              style={{ color: '#26442C' }}
            />
          </button>
          <button 
            className="w-[27px] h-[27px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Calendar Events"
          >
            <Calendar 
              className="w-[20px] h-[20px]" 
              style={{ color: '#26442C' }}
            />
          </button>
        </div>
        
        {/* Right Icons Frame */}
        <div className="absolute right-[117px] top-[67px] flex flex-row items-center gap-[48px]">
          <button 
            className="w-[43px] h-[43px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Export/Reports"
          >
            <FileText 
              className="w-[28px] h-[28px]" 
              style={{ color: '#26442C' }}
            />
          </button>
          <button 
            className="w-[32px] h-[32px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Collection/Settings"
          >
            <Settings 
              className="w-[24px] h-[24px]" 
              style={{ color: '#26442C' }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar