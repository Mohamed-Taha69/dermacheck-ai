import { AnalysisResult } from "../types";

// Backend API base URL - update this to match your FastAPI server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Check if backend is available
 */
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

export interface ScanResponse {
  status: string;
  diagnosis: string;
  image_url: string;
  report: {
    assessment: string;
    key_features: string[];
    recommendations: string[];
  };
}

export interface HistoryItemResponse {
  id: string;
  user_id: string;
  image_url: string;
  diagnosis: string;
  confidence: number;
  medical_advice: {
    assessment: string;
    key_features: string[];
    recommendations: string[];
  };
  created_at: string;
}

export interface ProfileResponse {
  id: string;
  full_name?: string;
  username?: string;
  website?: string;
  email?: string;
  age?: number | null;
  gender?: 'Male' | 'Female' | null;
  skin_type?: string | null;
  role?: string | null;
  phone?: string | null;
}

/**
 * Validate diagnosis type
 */
const validateDiagnosis = (diagnosis: string): 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal' => {
  const validDiagnoses: ('Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal')[] = 
    ['Monkeypox', 'Chickenpox', 'Measles', 'Normal'];
  
  if (validDiagnoses.includes(diagnosis as any)) {
    return diagnosis as 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal';
  }
  
  return 'Normal'; // Default fallback
};

/**
 * Scan an image using the FastAPI backend
 */
export const scanImage = async (file: File, userId: string): Promise<{ result: AnalysisResult; imageUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  try {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      body: formData,
    });

    // Handle network errors (backend not running, CORS, etc.)
    if (!response.ok) {
      let errorMessage = "Failed to connect to the backend server.";
      
      // Try to get error message from response
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.status || `Server error: ${response.status} ${response.statusText}`;
      } catch {
        // If response is not JSON, use status text
        if (response.status === 0) {
          errorMessage = `Cannot connect to backend at ${API_BASE_URL}. Please make sure the FastAPI server is running.`;
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data: ScanResponse = await response.json();

    if (data.status !== "success") {
      throw new Error(data.status || "Scan failed");
    }

    // Convert backend response to AnalysisResult format
    const result: AnalysisResult = {
      diagnosis: validateDiagnosis(data.diagnosis),
      assessment: data.report.assessment,
      keyFeatures: data.report.key_features,
      recommendations: data.report.recommendations,
      confidenceScore: 0.95, // Backend sets confidence to 0.95
    };

    return {
      result,
      imageUrl: data.image_url,
    };
  } catch (error: any) {
    // Handle network errors (fetch failed, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. ` +
        `Please make sure:\n` +
        `1. The FastAPI backend is running\n` +
        `2. The backend URL is correct in your .env file\n` +
        `3. CORS is properly configured on the backend`
      );
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Get user history from backend
 */
export const getUserHistory = async (userId: string): Promise<HistoryItemResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/history/${userId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to fetch history" }));
    throw new Error(error.message || "Failed to fetch history");
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Failed to fetch history");
  }

  return data.data || [];
};

/**
 * Get user profile from backend
 */
export const getUserProfile = async (userId: string): Promise<ProfileResponse | null> => {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to fetch profile" }));
    throw new Error(error.message || "Failed to fetch profile");
  }

  const data = await response.json();

  if (data.status !== "success") {
    return null;
  }

  return data.data || null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    full_name?: string;
    username?: string;
    website?: string;
    age?: number | null;
    gender?: 'Male' | 'Female' | null;
    skin_type?: string | null;
    role?: string | null;
    phone?: string | null;
  }
): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      ...updates,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to update profile" }));
    throw new Error(error.message || "Failed to update profile");
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.data?.[0] || null;
};

