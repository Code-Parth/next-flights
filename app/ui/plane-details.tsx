import Image from 'next/image';
import BackgroundGlow from './assets/background-glow.svg';
import Plane from './assets/plane.svg';
import Stars from './assets/stars.svg';
import { getPlaneDetails } from '../utils/get-plane-details';

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
          <div className="stars-container absolute inset-0 mix-blend-lighten opacity-60">
            <Image
              className="absolute inset-0 object-contain"
              src={Stars}
              alt="starts"
              fill
            />
            <Image
              className="absolute inset-0 object-contain -translate-x-full"
              src={Stars}
              alt="starts"
              fill
            />
          </div>
          <div className="absolute inset-4">
            <Image
              className="absolute inset-0 object-contain"
              src={Plane}
              alt="plane"
              fill
            />
            <div className="absolute left-[57%] top-[46%] -translate-x-1/2 -translate-y-1/2">
              <div className="plane-light" />
            </div>
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
            <p className="leading-tight">{plane.plane_age} years old</p>
            <p className="leading-tight">{plane.miles_flown} miles</p>
          </div>
          <p className="text-pretty">{plane.description}</p>
        </div>
      </div>
    </div>
  );
}
