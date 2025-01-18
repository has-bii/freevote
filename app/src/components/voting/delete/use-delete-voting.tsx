import { TVoting } from "@/types/model";
import { create } from "zustand";

interface DeleteVotingState {
  data: TVoting | null;
  close: () => void;
  open: (data: TVoting) => void;
}

export const useDeleteVoting = create<DeleteVotingState>()((set) => ({
  data: null,
  close: () => set(() => ({ data: null })),
  open: (voting) => set(() => ({ data: voting })),
}));
