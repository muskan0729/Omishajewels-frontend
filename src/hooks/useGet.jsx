import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useGet(endpoint) {
  // console.log("useGet rendered with endpoint:", endpoint); // ← watch how often & if value stable
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",    
          Authorization: `Bearer h7LVWhVhV6peADVYLlVnKAx1OroXxvDsvQ0uHb78c949a0e7`,
        },
      });
      //  console.log("fetch succeeded → setting data");
      setData(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint]); // ✅ stable unless endpoint changes

  useEffect(() => {
    // console.log("useEffect triggered → calling fetchData");
    fetchData();
  }, [fetchData]); // ✅ correct dependency

  return { data, loading, error, refetch: fetchData };
}
