"use client";

import { useCallback, useEffect, useState } from "react";

const LOCATION_API_URL = "https://countriesnow.space/api/v0.1/countries";

export interface CountryOption {
  country: string;
  iso2: string;
  iso3?: string;
}

interface CountriesResponse {
  error: boolean;
  msg: string;
  data: CountryOption[];
}

interface StatesResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    states: { name: string; state_code?: string }[];
  };
}

interface CitiesResponse {
  error: boolean;
  msg: string;
  data: string[];
}

interface LocationOptions {
  countries: CountryOption[];
  states: string[];
  cities: string[];
  isLoadingCountries: boolean;
  isLoadingStates: boolean;
  isLoadingCities: boolean;
  error: string;
  fetchStates: (country: string) => Promise<void>;
  fetchCities: (country: string, state: string) => Promise<void>;
  clearStates: () => void;
  clearCities: () => void;
}

async function fetchLocationData<T>(
  endpoint: string,
  body?: object,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${LOCATION_API_URL}${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load location options. Please try again.");
  }

  return (await response.json()) as T;
}

export default function useLocationOptions(): LocationOptions {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        setIsLoadingCountries(true);
        setError("");

        const response = await fetchLocationData<CountriesResponse>(
          "",
          undefined,
          controller.signal,
        );

        if (response.error) {
          throw new Error(response.msg || "Unable to load countries.");
        }

        setCountries(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Unable to load countries.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    }

    void loadCountries();

    return () => controller.abort();
  }, []);

  const fetchStates = useCallback(async (country: string) => {
    setStates([]);
    setCities([]);

    if (!country) return;

    try {
      setIsLoadingStates(true);
      setError("");

      const response = await fetchLocationData<StatesResponse>(
        "/states",
        { country },
      );

      if (response.error) {
        throw new Error(response.msg || "Unable to load states.");
      }

      setStates(response.data.states.map((state) => state.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load states.");
    } finally {
      setIsLoadingStates(false);
    }
  }, []);

  const fetchCities = useCallback(async (country: string, state: string) => {
    setCities([]);

    if (!country || !state) return;

    try {
      setIsLoadingCities(true);
      setError("");

      const response = await fetchLocationData<CitiesResponse>(
        "/cities",
        { country, state },
      );

      if (response.error) {
        throw new Error(response.msg || "Unable to load cities.");
      }

      setCities(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cities.");
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  const clearStates = useCallback(() => {
    setStates([]);
    setCities([]);
  }, []);

  const clearCities = useCallback(() => {
    setCities([]);
  }, []);

  return {
    countries,
    states,
    cities,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    error,
    fetchStates,
    fetchCities,
    clearStates,
    clearCities,
  };
}
