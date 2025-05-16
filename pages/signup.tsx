// pages/signup.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { AuthError } from '@supabase/supabase-js'; // ★★★ AuthError 타입 임포트 ★★★

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateAndCheckNickname = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNicknameError('닉네임을 입력해주세요.');
      return false;
    }
    if (trimmedName.length < 2 || trimmedName.length > 10) {
      setNicknameError('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return false;
    }

    setNicknameError('');
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('nickname')
      .eq('nickname', trimmedName)
      .maybeSingle();
    setLoading(false);

    if (fetchError) {
      console.error('닉네임 확인 중 오류:', fetchError.message);
      setNicknameError('닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    }

    if (data) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return false;
    }
    return true;
  };

  // Supabase Auth 오류 한글 처리 함수
  const handleAuthError = (authError: AuthError | null) => { // ★★★ 타입 'any'에서 'AuthError | null'로 변경 ★★★
    let message = '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
    if (authError && authError.message) {
      console.error("Auth Error Raw: ", authError.message);
      if (authError.message.includes('User already registered')) {
        message = '이미 가입된 이메일입니다.';
      } else if (authError.message.includes('Password should be at least 6 characters')) {
        message = '비밀번호는 6자 이상이어야 합니다.';
      } else if (authError.message.includes('Unable to validate email address: invalid format')) {
        message = '유효하지 않은 이메일 형식입니다.';
      }
      // 여기에 더 많은 Supabase 오류 메시지 패턴과 한글 메시지를 추가할 수 있습니다.
      // 예: else if (authError.name === 'AuthApiError' && authError.status === 400) { ... }
    }
    setError(message);
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setNicknameError('');
    setLoading(true);

    const isNicknameValid = await validateAndCheckNickname(nickname);
    if (!isNicknameValid) {
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      handleAuthError(signUpError); // 수정된 타입의 함수 호출
      setLoading(false);
      return;
    }

    if (signUpData?.user) {
      const userId = signUpData.user.id;
      const userEmail = signUpData.user.email; 

      const { error: insertError } = await supabase.from('users').insert([
        {
          id: userId,
          email: userEmail,
          nickname: nickname.trim(),
          coins: 0,
          total_taps: 0,
        },
      ]);

      if (insertError) {
        console.error('users 테이블 insert 실패:', insertError.message);
        setError(
          '회원가입은 성공했으나, 사용자 프로필 정보 저장에 실패했습니다. 다시 시도하거나 관리자에게 문의해주세요.'
        );
        // 중요: 이 경우 auth.users에는 사용자가 생성되었지만, users 테이블에는 정보가 없는 상태가 됩니다.
        // 실제 프로덕션에서는 이 문제를 해결하기 위해 Supabase Edge Function (서버리스 함수)을 사용하여
        // auth 사용자 생성과 users 테이블 삽입을 하나의 트랜잭션으로 묶는 것이 좋습니다.
        // 또는, insertError 발생 시 생성된 auth 사용자를 삭제하는 로직을 (어드민 권한으로) 서버 측에서 호출해야 합니다.
        setLoading(false);
        return;
      }

      alert('회원가입 성공! 프로그램을 다운받아 실행해주세요!');
      router.push('/download');
    } else {
      setError('알 수 없는 오류로 회원가입에 실패했습니다. (사용자 정보 없음)');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              id="emailInput"
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              id="passwordInput"
              type="password"
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nicknameInput" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              id="nicknameInput"
              type="text"
              placeholder="2~10자 (한글, 영문, 숫자)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => nickname && validateAndCheckNickname(nickname)}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
            {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 disabled:bg-gray-400 transition duration-150 ease-in-out"
          >
            {loading ? '가입 처리 중...' : '가입하기'}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}