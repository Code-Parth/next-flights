async function getFlightActivity(id: string) {
  const baseUrl = 'https://api.aviationstack.com/v1/flights';
  const query = new URLSearchParams({
    access_key: process.env.AVIATIONSTACK_API_TOKEN!,
    flight_icao: id,
    limit: '5',
  });

  const response = await fetch(`${baseUrl}?${query}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch flight activity: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as AviationStackResponse;
  return data.data;
}

export async function FlightActivity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const activity = await getFlightActivity(id);

  return (
    <div className="text-white">
      <h2 className="text-4xl">Flights</h2>
      <pre>{JSON.stringify(activity, null, 2)}</pre>
    </div>
  );
}

type AviationStackResponse = {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Array<Flight>;
};

type Flight = {
  flight_date: string;
  flight_status: FlightStatus;
  departure: Airport & FlightTiming;
  arrival: Airport &
    FlightTiming & {
      baggage: string;
    };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: null;
  };
  aircraft: Aircraft;
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
    aircraft: Aircraft;
  };
};

type Airport = {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string;
  gate: string;
  delay: number;
  scheduled: string;
  estimated: string;
};

type FlightTiming = {
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
};

type FlightStatus =
  | 'scheduled'
  | 'active'
  | 'landed'
  | 'cancelled'
  | 'incident'
  | 'diverted';

type Aircraft = {
  registration: string;
  iata: string;
  icao: string;
  icao24: string;
};
