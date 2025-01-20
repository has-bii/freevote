import { create } from "zustand";

interface AddNomination {
  state: boolean;
  close: () => void;
  open: (state: boolean) => void;
}

export const useAddNomination = create<AddNomination>()((set) => ({
  state: false,
  close: () => set(() => ({ state: false })),
  open: (state) => set(() => ({ state })),
}));
