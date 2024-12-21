import axios from "axios";

export async function signUp(data: {
  email: string;
  password: string;
  username: string;
}): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const response = await axios({
      method: "POST",
      url: "/api/signup",
      data: {
        email: data.email,
        password: data.password,
        name: data.username,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
