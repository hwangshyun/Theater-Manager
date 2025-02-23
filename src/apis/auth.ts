import { supabase } from '../utils/supabaseClient';
import { Tables } from '../types/supabase';

type UserRow = Tables<'users'>;

export async function loginWithIdAndPassword(userId: string, password: string) {
  // 1. ID와 비밀번호로 사용자 조회
  const { data: user, error } = await supabase
    .from('users')
    .select('*') // 모든 필드를 선택
    .eq('username', userId) // ID 일치
    .eq('password', password) // 비밀번호 일치
    .single<UserRow>(); // 단일 결과 반환

  // 2. 오류 처리
  if (error || !user) {
    throw new Error('Invalid ID or password');
  }

  // 3. 사용자 정보 반환
  return user;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", error.message);
    return null; // 오류가 발생하면 `null` 반환
  }

  console.log("유저 정보:", data?.user); 
  return data?.user // 유저 정보 반환
}