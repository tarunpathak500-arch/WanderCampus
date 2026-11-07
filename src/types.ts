export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  registration_number: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: UserRole;
  department?: string;
  password?: string;
  created_at: string;
}

export interface RegisterData {
  full_name: string;
  registration_number: string;
  email: string;
  phone_number: string;
  department: string;
  password: string;
}

export type ItemCategory =
  | 'Student ID Card'
  | 'Electronics & Gadgets'
  | 'Wallet/Purse'
  | 'Keys'
  | 'Documents/Notebooks'
  | 'Watches & Jewelry'
  | 'Clothing & Bags'
  | 'Other';

export type CampusBlock =
  // Academic Blocks
  | 'Block 34 (School of Computer Science & IT)'
  | 'Block 38 (Computer Applications & Robotics)'
  | 'Block 36 (Mechanical & Aerospace Engineering)'
  | 'Block 32 (Mittal School of Business)'
  | 'Block 31 (Commerce & Economics)'
  | 'Block 28 (Pharmaceutical Sciences)'
  | 'Block 29 (School of Fashion & Design)'
  | 'Block 25 (Bio-Engineering & Chemical Sciences)'
  | 'Block 14 (School of Law & Social Sciences)'
  | 'Block 55 (School of Agriculture & Polyhouse)'
  | 'Blocks 1-3 (Admission & Administration Complex)'
  // Central Amenities & Hubs
  | 'Uni-Mall & Multiplex Food Court'
  | 'Central Library (Blocks 13 & 14 Reading Commons)'
  | 'Baldev Raj Mittal Unipolis & Central Quad'
  | 'Shanti Devi Mittal Indoor Sports Complex'
  | 'Shanti Devi Mittal Auditorium (SDM)'
  | 'Uni-Hospital & Healthcare Centre'
  // Boys Hostels (BH)
  | 'Boys Hostel 1 (BH-1)'
  | 'Boys Hostel 2 (BH-2)'
  | 'Boys Hostel 3 (BH-3)'
  | 'Boys Hostel 4 (BH-4)'
  | 'Boys Hostel 5 (BH-5)'
  | 'Boys Hostel 6 (BH-6)'
  | 'Boys Hostel 7 (BH-7)'
  | 'Boys Hostel 8 (BH-8)'
  // Girls Hostels (GH)
  | 'Girls Hostel 1 (GH-1)'
  | 'Girls Hostel 2 (GH-2)'
  | 'Girls Hostel 3 (GH-3)'
  | 'Girls Hostel 4 (GH-4)'
  | 'Girls Hostel 5 (GH-5)'
  | 'Girls Hostel 6 (GH-6)'
  // Campus Gates & Transit
  | 'Main Gate 1 (GT Road Turnstiles & Security)'
  | 'Gate 2 (Law & Hospital Entrance)'
  | 'Gate 3 (Rear Transport Bay & Bus Terminal)'
  | 'Gate 4 (Perimeter Access)'
  // Sports & Recreation
  | 'Outdoor Olympic Athletics Track & Cricket Stadium'
  | 'Central Fountain Lawns & Kiosk Avenue';

export type CustodyDesk =
  | 'Central Security Office (Main Gate 1)'
  | 'Block 34 Helpdesk (CSE/IT)'
  | 'Central Library Reception (Block 13/14)'
  | 'Uni-Mall Security Control Desk'
  | 'Hostel Warden Office (Boys BH-1 to BH-8)'
  | 'Hostel Warden Office (Girls GH-1 to GH-6)'
  | 'Shanti Devi Mittal Sports Complex Desk'
  | 'Unipolis Events Security Desk'
  | 'Kept with Finder (Handover at Desk)';

export type ItemStatus = 'unclaimed' | 'claim_pending' | 'returned';

export interface FoundItem {
  id: string;
  tracking_code: string;
  title: string;
  category: ItemCategory;
  image_url: string;
  found_location_block: CampusBlock;
  found_location_details: string;
  custody_desk_location: CustodyDesk;
  finder_user_id: string;
  finder_name: string;
  finder_reg_no: string;
  finder_phone: string;
  additional_notes: string;
  secret_distinguishing_marks: string; // Only visible to admin & finder
  status: ItemStatus;
  created_at: string;
  active_claim_id?: string;
  returned_at?: string;
  returned_to_claimant?: string;
  handover_officer?: string;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  id: string;
  item_id: string;
  item_tracking_code: string;
  item_title: string;
  item_category: string;
  claimant_user_id: string;
  claimant_name: string;
  claimant_reg_no: string;
  claimant_phone: string;
  claimant_email: string;
  ownership_proof_description: string;
  proof_document_url?: string;
  proof_document_name?: string;
  pickup_scheduled_date: string;
  pickup_scheduled_time: string;
  pickup_desk: string;
  verification_status: VerificationStatus;
  admin_notes?: string;
  verified_by_admin?: string;
  resolved_at?: string;
  created_at: string;
}

export interface CampusStats {
  total_reported: number;
  unclaimed_count: number;
  claims_pending: number;
  returned_count: number;
  recovery_rate_percent: number;
  avg_resolution_hours: number;
  by_block: Record<string, number>;
  by_category: Record<string, number>;
}
