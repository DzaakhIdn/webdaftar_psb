import { useEffect } from "react";
import { showAllData } from "../show-all-data";

export function fetchData(
  table: string,
  datas: any,
  setName: any,
  showError: any
) {
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await showAllData(table);
        setName(data as any[]);
      } catch (error) {
        console.error(`Error loading data from ${table}:`, error);
        showError(`Failed to load ${table} data`);
      }
    };

    loadData();
  }, [table, showError, setName]);
}
