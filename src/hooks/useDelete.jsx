import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useDelete(endpoint = "") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeDelete = async (id, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // const token = localStorage.getItem("token"); // or however you store it
      const token="XrL6wbmvvP6KbKRjpMJOJcfnC8MkpRMk3vVM5QsSd7227509";
      
      const response = await axios.delete(
        `${BASE_URL}${endpoint}/${id}`,
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
