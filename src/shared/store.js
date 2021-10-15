import create from "zustand";

export const useStore = create((set) => ({
  currentUser: undefined,
  setCurrentUser: (user) => set({ currentUser: user }),
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
