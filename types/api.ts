export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CreateUserRequest {
  mobile: string;
  name?: string;
  email?: string;
  // Property details
  address: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms?: number;
  bathrooms?: number;
  hasLivingArea?: boolean;
  hasDiningArea?: boolean;
  hasKitchen?: boolean;
  hasUtility?: boolean;
  hasGarden?: boolean;
  hasPowderRoom?: boolean;
  propertyType?: string;
  area?: number;
  floor?: number;
  totalFloors?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  isActive?: boolean;
  propertyId?: string;
}

export interface SendOTPRequest {
  mobile: string;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
}

export interface CreateComplaintRequest {
  title?: string;
  description: string;
  category: string;
  issueImages?: string[];
  issueVideos?: string[];
}

export interface UpdateComplaintRequest {
  workDescription?: string;
  materialsUsed?: string;
  workNotes?: string;
  beforeImages?: string[];
  afterImages?: string[];
  beforeVideos?: string[];
  afterVideos?: string[];
  status?: string;
}
