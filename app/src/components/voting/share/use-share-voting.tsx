import { create } from "zustand";

interface ShareVotingState {
  id: string | null;
  close: () => void;
  open: (id: string) => void;
}

export const useShareVoting = create<ShareVotingState>()((set) => ({
  id: null,
  close: () => set(() => ({ id: null })),
  open: (voting) => set(() => ({ id: voting })),
}));
