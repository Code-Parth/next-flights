export async function GET(request: Request) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  return Response.json({
    registration_number: 'N152FE',
    model_name: 'Airbus A320',
    model_code: 'A320',
    miles_flown: '300k',
    engines_count: '2',
    engines_type: 'Turbofan',
    plane_age: '10',
    plane_status: 'active',
    description:
      'The Airbus A320 is one of the most popular commercial aircraft models in the world, often used for short to medium-haul flights.',
    airline: {
      name: 'ACME Airways',
      code: 'ACME',
      country: 'USA',
    },
  })

}
