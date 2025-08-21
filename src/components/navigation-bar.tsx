"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, Calendar, FileText } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full flex justify-center px-4 mb-8">
      {/* Main Navbar Container */}
      <div className="relative w-[700px] h-[130px]">
        {/* Base Background with gradient */}
        <div
          className="absolute w-[700px] h-[91px] top-[39px] left-0 rounded-[48px]"
          style={{
            background:
              "linear-gradient(183.19deg, rgba(251, 216, 60, 0.4) 2.64%, #FEC52E 97.36%)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        />

        {/* Secondary Background */}
        <div
          className="absolute w-[700px] h-[91px] top-[39px] left-0 rounded-[48px]"
          style={{ background: "#FBD83C" }}
        />

        {/* Logo Area */}
        <div className="absolute left-1/2 top-[15px] transform -translate-x-1/2">
          {/* Outer Ellipse */}
          <div
            className="w-[112px] h-[111px] rounded-full relative cursor-pointer"
            style={{ background: "#D9D9D9" }}
            onClick={() => handleNavigation("/admin/dashboard")}
          >
            {/* Inner Ellipse */}
            <div
              className="absolute w-[88px] h-[88px] rounded-full top-[12px] left-[12px] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 244, 244, 0.8) 23%, rgba(251, 216, 60, 0.2) 100%)",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Logo Container */}
              <div className="w-[45px] h-[48px] flex items-center justify-center">
                {/* Try to load image, fallback to text */}
                <div
                  className="w-full h-full bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: "url('/re-vams-logo.png')",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Icons Frame */}
        <div className="absolute left-[117px] top-[67px] flex flex-row items-center gap-[48px]">
          <button
            className="w-[36px] h-[36px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Members"
            onClick={() => handleNavigation("/admin/members")}
          >
            <Users className="w-[24px] h-[24px]" style={{ color: "#26442C" }} />
          </button>
          <button
            className="w-[27px] h-[27px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Events"
            onClick={() => handleNavigation("/admin/events")}
          >
            <Calendar
              className="w-[20px] h-[20px]"
              style={{ color: "#26442C" }}
            />
          </button>
        </div>

        {/* Right Icons Frame */}
        <div className="absolute right-[117px] top-[67px] flex flex-row items-center gap-[48px]">
          <button
            className="w-[43px] h-[43px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Export"
            onClick={() => handleNavigation("/admin/export")}
          >
            <FileText
              className="w-[28px] h-[28px]"
              style={{ color: "#26442C" }}
            />
          </button>
          <button
            className="w-[32px] h-[32px] flex items-center justify-center hover:bg-black/10 rounded-full transition-colors duration-200"
            aria-label="Collections"
            onClick={() => handleNavigation("/admin/collections")}
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 3.16667C15.3333 3.16667 14.6667 3.42 14.12 3.95333L9.72 8.34L16 14.6067L22.28 8.34L17.88 3.95333C17.3333 3.42 16.6667 3.16667 16 3.16667ZM7.84 10.22L3.45333 14.62C2.4 15.66 2.4 17.34 3.45333 18.38L7.84 22.78L14.1067 16.5L7.84 10.22ZM24.16 10.22L17.8933 16.5L24.16 22.78L28.5467 18.38C29.6 17.34 29.6 15.66 28.5467 14.62L24.16 10.22ZM16 18.3933L9.72 24.66L14.12 29.0467C15.16 30.1 16.84 30.1 17.88 29.0467L22.28 24.66L16 18.3933Z"
                fill="#26442C"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
