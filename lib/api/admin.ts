// lib/api/admin.ts - Admin Dashboard API Functions
import axios, { AxiosResponse } from "axios";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  property: Property;
  _count: {
    complaints: number;
  };
}

export interface UserDetailsResponse {
  // User information
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Property information
  property: {
    id: string;
    address: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    bedrooms: number;
    bathrooms: number;
    hasLivingArea: boolean;
    hasDiningArea: boolean;
    hasKitchen: boolean;
    hasUtility: boolean;
    hasGarden: boolean;
    hasPowderRoom: boolean;
    propertyType?: string;
    area?: number;
    floor?: number;
    totalFloors?: number;
    createdAt: string;
    updatedAt: string;
  };

  // Complaint statistics
  complaintStats: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    cancelled: number;
  };

  // Recent complaints
  recentComplaints: Array<{
    id: string;
    title?: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  }>;

  // All complaints
  allComplaints: Array<{
    id: string;
    title?: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  }>;

  // Additional metrics
  metrics: {
    avgResolutionTimeMs: number;
    avgResolutionTimeDays: number;
    memberSince: string;
    lastComplaint?: string;
  };
}

export interface Property {
  id: string;
  address: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  hasLivingArea: boolean;
  hasDiningArea: boolean;
  hasKitchen: boolean;
  hasUtility: boolean;
  hasGarden: boolean;
  hasPowderRoom: boolean;
  propertyType?: string;
  area?: number;
  floor?: number;
  totalFloors?: number;
}

export interface Complaint {
  id: string;
  title?: string;
  description: string;
  category:
    | "ELECTRICAL"
    | "PLUMBING"
    | "ELECTRONICS"
    | "CARPENTRY"
    | "STRUCTURAL"
    | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  issueImages: string[];
  issueVideos: string[];
  beforeImages: string[];
  afterImages: string[];
  beforeVideos: string[];
  afterVideos: string[];
  workDescription?: string;
  materialsUsed?: string;
  workNotes?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  user: {
    id: string;
    name?: string;
    mobile: string;
  };
  property: Property;
}

export interface CreateUserWithPropertyData {
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

export interface UpdateUserData {
  name?: string;
  email?: string;
  isActive?: boolean;
  propertyId?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalComplaints: number;
  complaintsByStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export interface UsersResponse {
  users: User[];
  totalUsers: number;
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// USER MANAGEMENT FUNCTIONS

/**
 * Get all users with their properties and complaint counts
 */
export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response: AxiosResponse<ApiResponse<UsersResponse>> = await api.get(
      "/api/users"
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch users");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUserWithProperty = async (
  userData: CreateUserWithPropertyData
): Promise<User> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.post(
      "/api/users",
      userData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to create user and property"
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create user and property"
      );
    }
    throw error;
  }
};

/**
 * Update a specific user
 */
export const updateUser = async (
  userId: string,
  userData: UpdateUserData
): Promise<User> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(
      `/api/users/${userId}`,
      userData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to update user");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
    throw error;
  }
};

/**
 * Get a specific user
 */

export const getUserById = async (
  userId: string
): Promise<UserDetailsResponse> => {
  try {
    const response: AxiosResponse<ApiResponse<UserDetailsResponse>> =
      await api.get(`/api/users/${userId}/details`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch user details");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
    throw error;
  }
};
/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.delete(
      `/api/users/${userId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete user");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
    throw error;
  }
};

// COMPLAINT MANAGEMENT FUNCTIONS

/**
 * Get all complaints (admin view)
 */
export const getAllComplaints = async (): Promise<Complaint[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Complaint[]>> = await api.get(
      "/api/complaints?supervisor=true"
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch complaints");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch complaints"
      );
    }
    throw error;
  }
};

/**
 * Get pending complaints (OPEN, IN_PROGRESS, RESOLVED - not CLOSED)
 */
export const getPendingComplaints = async (): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter(
      (complaint) =>
        complaint.status !== "CLOSED" && complaint.status !== "CANCELLED"
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific complaint by ID
 */
export const getComplaintById = async (
  complaintId: string
): Promise<Complaint> => {
  try {
    const response: AxiosResponse<ApiResponse<Complaint>> = await api.get(
      `/api/complaints/${complaintId}?supervisor=true`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch complaint");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch complaint"
      );
    }
    throw error;
  }
};

/**
 * Close a resolved complaint (Admin action)
 */
export const closeComplaint = async (
  complaintId: string
): Promise<Complaint> => {
  try {
    const response: AxiosResponse<ApiResponse<Complaint>> = await api.put(
      `/api/complaints/${complaintId}/close`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to close complaint");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to close complaint"
      );
    }
    throw error;
  }
};

/**
 * Cancel a complaint (Admin action)
 */
export const cancelComplaint = async (
  complaintId: string
): Promise<Complaint> => {
  try {
    const response: AxiosResponse<ApiResponse<Complaint>> = await api.put(
      `/api/complaints/${complaintId}/update`,
      { status: "CANCELLED" }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to cancel complaint");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel complaint"
      );
    }
    throw error;
  }
};

// PROPERTY MANAGEMENT FUNCTIONS

/**
 * Get all properties
 */
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Property[]>> = await api.get(
      "/api/properties"
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch properties");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
    throw error;
  }
};

// DASHBOARD ANALYTICS FUNCTIONS

/**
 * Get dashboard statistics and metrics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get(
      "/api/dashboard/stats"
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch dashboard stats"
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
    throw error;
  }
};

// UTILITY FUNCTIONS

/**
 * Get complaints by status
 */
export const getComplaintsByStatus = async (
  status: Complaint["status"]
): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter((complaint) => complaint.status === status);
  } catch (error) {
    throw error;
  }
};

/**
 * Get complaints by category
 */
export const getComplaintsByCategory = async (
  category: Complaint["category"]
): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter((complaint) => complaint.category === category);
  } catch (error) {
    throw error;
  }
};

/**
 * Get complaints by priority
 */
export const getComplaintsByPriority = async (
  priority: Complaint["priority"]
): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter((complaint) => complaint.priority === priority);
  } catch (error) {
    throw error;
  }
};

/**
 * Get complaints for a specific property
 */
export const getComplaintsByProperty = async (
  propertyId: string
): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter(
      (complaint) => complaint.property.id === propertyId
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get complaints for a specific user
 */
export const getComplaintsByUser = async (
  userId: string
): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    return allComplaints.filter((complaint) => complaint.user.id === userId);
  } catch (error) {
    throw error;
  }
};

/**
 * Search complaints by description or title
 */
export const searchComplaints = async (query: string): Promise<Complaint[]> => {
  try {
    const allComplaints = await getAllComplaints();
    const searchQuery = query.toLowerCase();

    return allComplaints.filter(
      (complaint) =>
        complaint.description.toLowerCase().includes(searchQuery) ||
        (complaint.title &&
          complaint.title.toLowerCase().includes(searchQuery)) ||
        complaint.user.name?.toLowerCase().includes(searchQuery) ||
        complaint.user.mobile.includes(searchQuery) ||
        complaint.property.address.toLowerCase().includes(searchQuery)
    );
  } catch (error) {
    throw error;
  }
};

// BULK OPERATIONS

/**
 * Update priority for multiple complaints
 */
export const updateComplaintsPriority = async (
  complaintIds: string[],
  priority: Complaint["priority"]
): Promise<void> => {
  try {
    const updatePromises = complaintIds.map((id) =>
      api.put(`/api/complaints/${id}/update`, { priority })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Failed to update complaints priority");
    }
    throw error;
  }
};

/**
 * Close multiple resolved complaints
 */
export const closeMultipleComplaints = async (
  complaintIds: string[]
): Promise<void> => {
  try {
    const closePromises = complaintIds.map((id) => closeComplaint(id));
    await Promise.all(closePromises);
  } catch (error) {
    throw new Error("Failed to close multiple complaints");
  }
};

// EXPORT ALL FUNCTIONS
export const adminApi = {
  // Users
  getAllUsers,
  createUserWithProperty,
  getUserById,
  updateUser,
  deleteUser,

  // Complaints
    getAllComplaints,
    getPendingComplaints,
    getComplaintById,
    closeComplaint,
    cancelComplaint,
    getComplaintsByStatus,
    getComplaintsByCategory,
    getComplaintsByPriority,
    getComplaintsByProperty,
    getComplaintsByUser,
    searchComplaints,

  // Properties
  getAllProperties,

  // Dashboard
  getDashboardStats,

  // Bulk operations
  updateComplaintsPriority,
  closeMultipleComplaints,
};
