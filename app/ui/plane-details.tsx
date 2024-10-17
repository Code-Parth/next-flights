async function getPlaneDetails(id: string) {
  // Hard code ACME plane
  // Pick a nice model and source information
  return {
    registration_number: "N152FE",
    model_name: "Airbus A320",
    model_code: "A320",
    miles_flown: "100000",
    engines_count: "2",
    engines_type: "Turbofan",
    plane_age: "10",
    plane_status: "active",
    description: "...",
    airline: {
      name: "ACME Airline",
      code: "ACME",
      country: "USA",
    },
  }
}

export async function PlaneDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const plane = await getPlaneDetails(id)

  return (
    <div>
      <h2 className="text-4xl">Plane</h2>
      <h3>{plane.model_name}</h3>
      <h3>{plane.registration_number}</h3>
      <h3>{plane.airline.name}</h3>
      <h3>{plane.airline.code}</h3>
      <h3>{plane.airline.country}</h3>
      <h3>{plane.miles_flown}</h3>
      <h3>{plane.engines_count}</h3>
      <h3>{plane.engines_type}</h3>
      <h3>{plane.plane_age}</h3>
      <h3>{plane.plane_status}</h3>
      <p>{plane.description}</p>
    </div>
  )
}
