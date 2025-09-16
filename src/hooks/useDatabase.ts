// src/hooks/useDatabase.ts

import { useState, useEffect, useCallback } from 'react';
import type { ElectronAPI } from '../types/models';

type DbMethodName = keyof ElectronAPI;

interface UseDatabaseResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetch: (...args: unknown[]) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>; // Allow direct data manipulation
}

/**
 * Custom hook to interact with the Electron main process database API.
 * Provides loading and error states, and a refetch mechanism.
 * 
 * @param methodName The name of the IPC method to call on `window.db`.
 * @param initialArgs Initial arguments for the method call. Can be updated via `fetch`.
 * @param skip If true, the initial fetch will be skipped.
 * @returns An object containing data, loading state, error, and a fetch function.
 */
export function useDatabase<T>(methodName: DbMethodName, initialArgs: unknown[] = [], skip: boolean = false): UseDatabaseResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (...args: unknown[]) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure window.db exists and the method is callable
      if (!window.db || typeof window.db[methodName] !== 'function') {
        throw new Error(`Electron API method '${String(methodName)}' not found or not a function.`);
      }
      
      // Call the IPC method with provided arguments
      const result = await (window.db[methodName] as (...args: unknown[]) => Promise<T>)(...args);
      setData(result);
    } catch (err) {
      console.error(`Error calling ${String(methodName)}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [methodName]);

  // Initial fetch when component mounts or methodName/initialArgs change
  // 将不稳定的 initialArgs 数组转换为一个稳定的 JSON 字符串
  const stringifiedArgs = JSON.stringify(initialArgs);

  // Initial fetch when component mounts or methodName/initialArgs change
  useEffect(() => {
    if (!skip) {
      // 注意：这里我们仍然将原始的 initialArgs 数组传递给 fetch 函数
      fetch(...initialArgs);
    }
    // 在依赖项数组中，我们使用稳定化的字符串来进行比较
  }, [fetch, stringifiedArgs, skip]);

  return { data, loading, error, fetch, setData };
}
