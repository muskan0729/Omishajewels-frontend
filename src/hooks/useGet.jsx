import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useGet(endpoint) {
  // console.log("useGet rendered with endpoint:", endpoint); // ← watch how often & if value stable
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = useCallback(async () => {
    const start = performance.now();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      //console.log("✅ API RESPONSE:", response.data);
      setData(response.data);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    } finally {
      const end = performance.now();
      // console.log(
      //   `⏱ API TIME (${endpoint}):`,
      //   (end - start).toFixed(2),
      //   "ms"
      // );

      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    // console.log("useEffect triggered → calling fetchData");
    if (!endpoint) return;
    fetchData();
  }, [fetchData, endpoint]); // ✅ correct dependency

  return { data, loading, error, refetch: fetchData };
}
