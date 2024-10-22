import { create } from "zustand";
import { Flight } from "../ui/get-flights";

interface UsePlanesStore {
  selectedFlight: Flight | null;
}

export const usePlanesStore = create<UsePlanesStore>((set) => ({
  selectedFlight: null,
}));
