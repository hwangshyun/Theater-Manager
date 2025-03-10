import { signUpWithProfile } from '@/apis/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignUpFormInputs {
  email: string;
  password: string;
  nickname: string;
  avatar: FileList;
}

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data: SignUpFormInputs) => {
    setLoading(true);
    setMessage('');

    try {
      // 업로드할 프로필 이미지 파일 선택
      const avatarFile = data.avatar.length > 0 ? data.avatar[0] : undefined;

      await signUpWithProfile(data.email, data.password, data.nickname, avatarFile);
      setMessage('회원가입이 완료되었습니다! 이메일을 확인하세요.');
      alert('회원가입 완료');
    } catch (error) {
      setMessage((error as Error).message);
      alert('회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="이메일"
            {...register('email', { required: '이메일을 입력하세요' })}
            className="border p-2 w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            {...register('password', { required: '비밀번호를 입력하세요', minLength: { value: 6, message: '비밀번호는 최소 6자리 이상이어야 합니다.' } })}
            className="border p-2 w-full"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="닉네임"
            {...register('nickname', { required: '닉네임을 입력하세요' })}
            className="border p-2 w-full"
          />
          {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname.message}</p>}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            {...register('avatar')}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? '가입 중...' : '회원가입'}
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}