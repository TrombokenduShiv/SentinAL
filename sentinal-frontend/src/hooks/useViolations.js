import { useEffect, useState } from "react";
import { fetchViolations } from "../services/api";
import { MOCK_VIOLATIONS } from "../mocks/violations";

const USE_MOCK = true; // 🔥 flip to false when backend is ready

export default function useViolations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        let data;

        if (USE_MOCK) {
          data = MOCK_VIOLATIONS;
        } else {
          data = await fetchViolations();
        }

        if (isMounted) {
          setViolations(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // ⛑️ graceful fallback
          setViolations(MOCK_VIOLATIONS);
          setLoading(false);
          setError("Using demo data");
        }
      }
    }

    load();
    const interval = setInterval(load, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { violations, loading, error };
}
