"use client";

import { useEffect, useState } from "react";
import { api } from "@/routes/paths";

type Jalur = { 
  id: string; 
  trackCode: string;
  trackName: string; 
  quota: number;
  status: string;
};

export default function TestJalurPage() {
  const [jalur, setJalur] = useState<Jalur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJalur = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching jalur from:", api.user.jalur);
        
        const response = await fetch(api.user.jalur);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Jalur data received:", data);
        setJalur(data);
      } catch (error) {
        console.error("Error fetching jalur:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch jalur data");
      } finally {
        setLoading(false);
      }
    };

    fetchJalur();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Jalur API</h1>
      
      <div className="mb-4">
        <p><strong>API URL:</strong> {api.user.jalur}</p>
        <p><strong>Status:</strong> {loading ? "Loading..." : error ? "Error" : "Success"}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading jalur data...
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Jalur Data ({jalur.length} items):</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre>{JSON.stringify(jalur, null, 2)}</pre>
          </div>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Formatted List:</h3>
          <ul className="list-disc pl-6">
            {jalur.map((item) => (
              <li key={item.id}>
                <strong>{item.trackCode}</strong>: {item.trackName} (Quota: {item.quota}, Status: {item.status})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
