
import { PlaneDetailsType } from "../ui/types";
import { planeDetailsEndpoint } from "./constants";

export async function getPlaneDetails(id: string) {
  "use cache"
  return await fetch(`${planeDetailsEndpoint}/${id}`).then<PlaneDetailsType>(
    (x) => x.json(),
  );
}