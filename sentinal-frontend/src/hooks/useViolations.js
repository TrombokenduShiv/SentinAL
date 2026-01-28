import { useEffect, useState } from "react";
import { fetchViolations } from "../services/api";

export default function useViolations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchViolations();
        if (isMounted) {
          setViolations(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    load(); // initial fetch
    const interval = setInterval(load, 2000); // poll every 2s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { violations, loading, error };
}
