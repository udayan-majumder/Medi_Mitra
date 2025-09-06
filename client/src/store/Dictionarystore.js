import { create } from "zustand";

export const LanguageStore = create((set) => ({
  Language: {
    english: {
      username: "username",
    },
    hindi: {
      username: "यूजरनेम",
    },
  },
}));