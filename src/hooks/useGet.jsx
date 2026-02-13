import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useGet(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;

    let isMounted = true; // prevent state update after unmount

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]); // ✅ only depends on endpoint

  return { data, loading, error };
}
