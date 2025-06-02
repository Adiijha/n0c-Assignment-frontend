import axios from "axios";

const USER_URL = process.env.NEXT_PUBLIC_API_USER_URL;


interface LoginResponse {
  message: {
      user: any; accessToken: any; refreshToken: any; 
};
  data: {
    accessToken: string; 
    refreshToken: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  message: string;
}

interface UserProfile {
  name: string;
}

type DataFetchResponse = {
  timestamp: string;
  averageTemperature: string;
  averagePressure: string;
}[];



export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${USER_URL}/user/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );

    const { accessToken, refreshToken } = response.data.message;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data; 
  } catch (error: any) {
    console.error("Login API Error:", error.response || error.message);

    const message =
      error?.response?.data?.message ||
      error.message ||
      "An unexpected error occurred while logging in";

    throw new Error(message);
  }
};

export const logoutUser = async (token: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${USER_URL}/user/logout`,
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` }, 
        withCredentials: true, 
      }
    );

    return response.data.message; 
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Error logging out.";
    throw new Error(message);
  }
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    const response = await axios.get<{ status: number; data: UserProfile }>(
      `${USER_URL}/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    const message =
      error.response?.data?.message || error.message || "Failed to fetch user profile.";
    throw new Error(message);
  }
};


export const registerUser = async (
  input: RegisterUserInput
): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post<RegisterUserResponse>(`${USER_URL}/user/register`, input);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Error registering user.";
    throw new Error(message);
  }
};


export const dataFetch = async (): Promise<DataFetchResponse> => {
  try {
    const response = await axios.get<DataFetchResponse>(`${USER_URL}/data/average`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    const message =
      error.response?.data?.message || error.message || "Failed to fetch data.";
    throw new Error(message);
  }
}


