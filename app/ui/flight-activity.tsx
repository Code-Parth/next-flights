import { FlightChunkDetail } from './flight-chunk-detail';

export interface FlightActivity {
  status: 'landed' | 'active';
  statusString: string;
  arrival: {
    airport: string;
    scheduled: string;
    iata: string;
    estimated: string;
  };
  departure: {
    airport: string;
    scheduled: string;
    iata: string;
    estimated: string;
  };
}

async function getFlightActivity(id: string) {
  const activity: FlightActivity[] = [
    {
      status: 'active',
      statusString: 'Landing in 1H 10M',
      arrival: {
        airport: 'San Francisco',
        scheduled: '2024-10-22',
        iata: 'SFO',
        estimated: '2024-10-22',
      },
      departure: {
        airport: 'New York',
        scheduled: '2024-10-22',
        iata: 'JFK',
        estimated: '2024-10-22',
      },
    },
    {
      status: 'landed',
      statusString: 'Landed at 10:30 AM',
      arrival: {
        airport: 'San Francisco',
        scheduled: '2024-10-22',
        iata: 'SFO',
        estimated: '2024-10-22',
      },
      departure: {
        airport: 'New York',
        scheduled: '2024-10-22',
        iata: 'JFK',
        estimated: '2024-10-22',
      },
    },
    {
      status: 'landed',
      statusString: 'Landed at 11:30 AM',
      arrival: {
        airport: 'San Francisco',
        scheduled: '2024-10-22',
        iata: 'SFO',
        estimated: '2024-10-22',
      },
      departure: {
        airport: 'New York',
        scheduled: '2024-10-22',
        iata: 'JFK',
        estimated: '2024-10-22',
      },
    },
    {
      status: 'landed',
      statusString: 'Landed at 10:30 AM',
      arrival: {
        airport: 'San Francisco',
        scheduled: '2024-10-22',
        iata: 'SFO',
        estimated: '2024-10-22',
      },
      departure: {
        airport: 'New York',
        scheduled: '2024-10-22',
        iata: 'JFK',
        estimated: '2024-10-22',
      },
    },
    {
      status: 'landed',
      statusString: 'Landed at 11:30 AM',
      arrival: {
        airport: 'San Francisco',
        scheduled: '2024-10-22',
        iata: 'SFO',
        estimated: '2024-10-22',
      },
      departure: {
        airport: 'New York',
        scheduled: '2024-10-22',
        iata: 'JFK',
        estimated: '2024-10-22',
      },
    },
  ];

  return activity;

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
      <h2 className="text-4xl p-4">Recent activity</h2>
      <div className="py-4 px-2">
        {activity.map((flight, i) => (
          <FlightChunkDetail key={i} flight={flight} />
        ))}
      </div>
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
  data: Array<FlightActivity>;
};

export type FlightActivityReal = {
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
