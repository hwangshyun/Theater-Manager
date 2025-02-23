import { create } from "zustand";
import { supabase } from "@/utils/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null; // 현재 로그인된 사용자 정보
  fetchUser: () => Promise<void>; // 세션 초기화 함수
  login: (email: string, password: string) => Promise<void>; // 로그인 함수
  logout: () => Promise<void>; // 로그아웃 함수
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // 세션 초기화 함수
  fetchUser: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session?.user) {
      set({ user: data.session.user });
      console.log("User session restored:", data.session.user);
    } else {
      set({ user: null });
      console.error("Failed to restore session:", error);
    }
  },

  // 로그인 함수
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    set({ user: data.user });
  },

  // 로그아웃 함수
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    set({ user: null });
  },
}));
