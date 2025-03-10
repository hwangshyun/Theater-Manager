import { supabase } from '../utils/supabaseClient';

export const signUpWithProfile = async (email: string, password: string, nickname: string, avatarFile?: File) => {
  // 1. Supabase Auth 회원가입 요청
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`회원가입 실패: ${error.message}`);
  }

  const user = data.user;
  if (!user) {
    throw new Error('회원가입이 완료되었지만 사용자 정보가 없습니다.');
  }

  let avatarUrl = null;

  // 2. 프로필 이미지 업로드
  if (avatarFile) {
    avatarUrl = await uploadAvatar(avatarFile, user.id);
  }

  // 3. profiles 테이블에 닉네임과 프로필 저장
  const { error: profileError } = await supabase.from('profiles').upsert([
    {
      id: user.id,
      nickname,
      avatar_url: avatarUrl || null,
    },
  ], { onConflict: 'id' });

  if (profileError) {
    throw new Error(`프로필 저장 실패: ${profileError.message}`);
  }

  return { success: true, userId: user.id };
};

export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop(); // 확장자 추출
  const filePath = `avatars/${userId}.${fileExt}`; // 올바른 파일 경로 지정

  // 파일 업로드
  const { data, error } = await supabase.storage.from('avatars').upload(filePath, file);

  if (error) {
    throw new Error(`프로필 이미지 업로드 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('파일 업로드 후 데이터가 반환되지 않았습니다.');
  }

  // ✅ `data.path`를 사용하여 getPublicUrl() 호출
  const publicUrl = supabase.storage.from('avatars').getPublicUrl(data.path);

  return publicUrl.data.publicUrl; // ✅ 올바른 Public URL 반환
};

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", error.message);
    return null; // 오류가 발생하면 `null` 반환
  }

  console.log("유저 정보:", data?.user); 
  return data?.user // 유저 정보 반환
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`로그아웃 실패: ${error.message}`);
  }
};