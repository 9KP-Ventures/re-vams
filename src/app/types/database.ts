export interface User {
    id: string;
    created_at: string;
    full_name: string;
    student_id: string;
    role: 'admin' | 'student';
  }
  
  export interface Student {
    created_at: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email_address: string;
    student_id_number: string;
    degree: string;
    year: number;
    program: string;
    major?: string;
    organization_id: string;
  }
  
  export interface Organization {
    id: string;
    created_at: string;
    name: string;
  }
  
  export interface Event {
    id: string;
    created_at: string;
    name: string;
    date: string;
    custom_email_subject?: string;
    max_attendance_link?: string;
    organization_id: string;
  }
  
  export interface AttendanceRecord {
    id: string;
    created_at: string;
    event_id: string;
    recorded_time: string;
    student_id: string;
    attendance_type: 'present' | 'absent' | 'late';
  }
  
  export interface AttendanceSlot {
    id: string;
    created_at: string;
    event_id: string;
    fine_amount: number;
    updated_at: string;
    register_time: string;
    type: 'morning' | 'afternoon' | 'evening';
  }
  
  export interface Payable {
    id: string;
    created_at: string;
    student_id: string;
    type: 'fee' | 'fine';
    amount: number;
    is_paid: boolean;
    due_date: string;
  }
  
  export interface Receipt {
    id: string;
    created_at: string;
    paid_amount: number;
    paid_on: string;
    remarks?: string;
    payable_id: string;
  }
  
  export interface Fine {
    id: string;
    payable_id: string;
    slot_id: string;
  }
  
  export interface Fee {
    id: string;
    name: string;
    payable_id: string;
    description?: string;
    organization_id: string;
  }
  
  export interface SelfAttendanceCode {
    id: string;
    created_at: string;
    link_text: string;
  }