import Image from 'next/image';

import BackgroundGlow from './assets/backgruond-glow.svg';
import Plane from './assets/plane.svg';
import Stars from './assets/stars.svg';

async function getPlaneDetails(id: string) {
  // Hard code ACME plane
  // Pick a nice model and source information
  return {
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
  };
}

export async function PlaneDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const plane = await getPlaneDetails(id);

  return (
    <div className="text-white">
      <div className="relative aspect-video">
        <div className="absolute left-0 top-0 w-full h-full">
          <Image
            className="absolute inset-0 object-cover"
            src={BackgroundGlow}
            alt=""
            fill
          />
          <Image
            className="absolute inset-0 mix-blend-lighten object-contain"
            src={Stars}
            alt="starts"
            fill
          />
          <div className="absolute inset-4">
            <Image
              className="absolute inset-0 object-contain"
              src={Plane}
              alt="plane"
              fill
            />
          </div>
        </div>
        <div className="relative p-4 text-lg font-bold">
          <h1 className="relative">
            {plane.model_name}/{plane.registration_number}
          </h1>
          <p>{plane.airline.name}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-4 leading-tight text-sm opacity-70">
          <div className="shrink-0">
            <p className="leading-none">{plane.plane_age} years old</p>
            <p className="leading-none">{plane.miles_flown} miles</p>
          </div>
          <p className="text-pretty">{plane.description}</p>
        </div>
      </div>
    </div>
  );
}
