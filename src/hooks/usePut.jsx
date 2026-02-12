import React, { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export function usePut(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePut = async ({ id, data, formData }) => {
    setLoading(true);
    setError(null);

    const isFormData = formData instanceof FormData;

    try {

      // for (let [key, value] of formData?.entries()) {
      //   if (value instanceof File) {
      //     console.log(key, {
      //       name: value.name,
      //       size: value.size,
      //       type: value.type
      //     });
      //   } else {
      //     console.log(key, value);
      //   }
      // }

      console.log(localStorage.getItem("token"));

      const response = await axios.put(
        `${BASE_URL}${endpoint}${id ? `/${id}` : ""}`,
        isFormData ? formData : data,
        {
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            // Authorization: "Bearer " + localStorage.getItem("token"),
            Authorization: "Bearer " + "OTSSkQhHvNuFGrn4edvYcakRnAlinpOmffGDT4SZ4adecefd",
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Something went wrong";

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePut };
}
