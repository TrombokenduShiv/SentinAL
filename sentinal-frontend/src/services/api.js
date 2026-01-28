const USE_MOCK = true;

export async function fetchViolations() {
  if (USE_MOCK) {
    return [
      {
        id: 1,
        asset_name: "Avengers: Endgame",
        location: "Russia (RU)",
        status: "TERRITORY_BREACH",
        location_code: "RU",
        timestamp: "2026-01-28T10:30:00Z",
      },
      {
        id: 2,
        asset_name: "Avengers: Endgame",
        location: "China (CN)",
        status: "PIRACY",
        location_code: "CN",
        timestamp: "2026-01-28T10:31:12Z",
      },
    ];
  }

  const res = await fetch("http://localhost:8000/api/violations/");
  if (!res.ok) throw new Error("Failed to fetch violations");
  return res.json();
}

export async function enforceViolation(id) {
  if (USE_MOCK) {
    return new Blob(["FAKE PDF"], { type: "application/pdf" });
  }

  const res = await fetch(`http://localhost:8000/api/enforce/${id}/`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to enforce violation");
  return res.blob();
}
