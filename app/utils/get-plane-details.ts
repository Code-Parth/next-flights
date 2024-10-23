import type { PlaneDetailsType } from '../ui/types';
import { planeDetailsEndpoint } from './constants';

export async function getPlaneDetails(id: string) {
  return await fetch(`${planeDetailsEndpoint}/${id}`).then<PlaneDetailsType>(
    (data) => data.json(),
  );
}
