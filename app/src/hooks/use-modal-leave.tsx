import { create } from "zustand";

interface LeaveVoting {
  isOpen: boolean;
  close: () => void;
  open: (state: boolean) => void;
}

export const useModalLeave = create<LeaveVoting>()((set) => ({
  isOpen: false,
  close: () => set(() => ({ isOpen: false })),
  open: (state) => set(() => ({ isOpen: state })),
}));
