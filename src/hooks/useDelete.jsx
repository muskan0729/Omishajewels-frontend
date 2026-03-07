import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL; // Has trailing slash: "https://omishajewels.com/Backend/api/"

export function useDelete() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeDelete = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Remove leading slash if exists
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      
      // Construct URL - BASE_URL already has trailing slash
      const url = `${BASE_URL}${cleanEndpoint}`;
      
      //console.log("Deleting from:", url); // Debug log
      
      const response = await axios.delete(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      options.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executeDelete };
}