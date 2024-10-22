import { FlightActivity } from './flight-activity';
import { clx } from '../utils/clx';

export function FlightChunkDetail({ flight }: { flight: FlightActivity }) {
  return (
    <div className="flex gap-2 items-stretch">
      <div className="w-[2rem] flex items-center flex-col">
        <div
          className={clx(
            'border border-white rounded-full w-[1rem] h-[1rem] shrink-0',
            {
              'bg-white opacity-50 w-[0.7rem] h-[0.7rem] my-[0.15rem]':
                flight.status !== 'active',
            },
          )}
        ></div>
        <div className="border-l-[1px] my-2 opacity-50 border-white h-full grow"></div>
      </div>
      <div className="pb-2">
        <div className="uppercase opacity-50 font-mono font-bold leading-none">
          {flight.arrival.iata}
        </div>
        <div className="my-2 pb-8">
          <p className="text-lg font-bold">
            {flight.departure.airport} to {flight.arrival.airport}
          </p>
          <p className="uppercase opacity-50 font-mono text-sm">
            {flight.statusString}
          </p>
        </div>
      </div>
    </div>
  );
}
