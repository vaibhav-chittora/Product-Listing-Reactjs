import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export const searchProducts = async (search = "", page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/search?search=${search}&page=${page}&limit=${limit}`,
      {
        headers: {
          "x-api-key": `${import.meta.env.VITE_API_KEY}`,
        },
      }
    );
    console.log("Response data: ", response.data);

    if (!response.data) {
      return {
        status: 404,
        message: "No products found",
      };
    }

    return response.data;
  } catch (error) {
    console.log("Error in searchProducts: ", error);
    throw error;
  }
};
