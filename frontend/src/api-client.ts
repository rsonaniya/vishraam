import type { RegisterFormData } from "./pages/Register";
import type { SignInFormData } from "./pages/SignIn";
import type { HotelType } from "../../backend/src/models/hotel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const sendRegisterOtp = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/request-otp`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const verifyRegisterOtp = async (formData: RegisterFormData) => {
  const { email, otp } = formData;
  const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Token Invalid");
  return response.json();
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",

    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }
  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }
  return response.json();
};
