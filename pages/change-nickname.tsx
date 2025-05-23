// pages/change-nickname.tsx
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { User, AuthError } from '@supabase/supabase-js';

export default function ChangeNicknamePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // 로그인 폼 상태
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 닉네임 변경 폼 상태
  const [currentNickname, setCurrentNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [nicknameChangeError, setNicknameChangeError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [nicknameChangeLoading, setNicknameChangeLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const handleAuthError = (authError: AuthError | null, context: 'login' | 'signup' = 'login') => {
    let message = `${context === 'login' ? '로그인' : '처리'} 중 오류가 발생했습니다. 다시 시도해주세요.`;
    if (authError && authError.message) {
      console.error(`Auth Error (${context}): `, authError.message, authError);
      if (authError.message.includes('Invalid login credentials')) {
        message = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (authError.message.includes('Password should be at least 6 characters')) {
        message = '비밀번호는 6자 이상이어야 합니다.';
      } else if (authError.message.includes('Unable to validate email address: invalid format')) {
        message = '유효하지 않은 이메일 형식입니다.';
      } else if (authError.message.includes('User already registered')) {
        message = '이미 가입된 이메일입니다.';
      }
    }
    if (context === 'login') setLoginError(message);
    else setNicknameChangeError(message);
  };

  const fetchUserAndNickname = async (loggedInUser: User) => {
    setUser(loggedInUser);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', loggedInUser.id)
      .single();

    if (userError) {
      console.error('현재 닉네임 가져오기 오류:', userError.message);
      setNicknameChangeError('현재 닉네임 정보를 가져오는데 실패했습니다. 페이지를 새로고침 해주세요.');
    } else if (userData) {
      setCurrentNickname(userData.nickname);
    }
  };

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { user: initialUser }, error: initialUserError } = await supabase.auth.getUser();
      if (initialUserError) {
        console.error('초기 사용자 정보 가져오기 오류:', initialUserError.message);
      }
      if (initialUser) {
        await fetchUserAndNickname(initialUser);
      } else {
        setUser(null);
        setCurrentNickname('');
      }
      setPageLoading(false);
    };
    getInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user) {
        if (!user || user.id !== newSession.user.id) {
          setPageLoading(true);
          await fetchUserAndNickname(newSession.user);
          setPageLoading(false);
        }
      } else {
        setUser(null);
        setCurrentNickname('');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [user]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      handleAuthError(error, 'login');
    } else if (data.user) {
      setUser(data.user); // 로그인 성공 시 user 상태 업데이트
    } else {
      setLoginError('로그인에 실패했습니다. (사용자 정보 없음)');
    }
    setLoginLoading(false);
  };

  const validateAndCheckNewNickname = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNicknameChangeError('새 닉네임을 입력해주세요.');
      return false;
    }
    if (trimmedName.length < 2 || trimmedName.length > 10) {
      setNicknameChangeError('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return false;
    }
    if (trimmedName === currentNickname) {
      setNicknameChangeError('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.');
      return false;
    }

    setNicknameChangeError('');
    setNicknameChangeLoading(true);
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('nickname')
      .eq('nickname', trimmedName)
      .neq('id', user?.id)
      .maybeSingle();
    setNicknameChangeLoading(false);

    if (fetchError) {
      setNicknameChangeError('닉네임 확인 중 오류 발생.');
      return false;
    }
    if (data) {
      setNicknameChangeError('이미 사용 중인 닉네임입니다.');
      return false;
    }
    return true;
  };

  const handleNicknameChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setNicknameChangeError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }
    setSuccessMessage('');
    setNicknameChangeError('');
    setNicknameChangeLoading(true);

    const isNicknameValid = await validateAndCheckNewNickname(newNickname);
    if (!isNicknameValid) {
      setNicknameChangeLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname: newNickname.trim() })
      .eq('id', user.id);

    if (updateError) {
      setNicknameChangeError('닉네임 변경 중 오류가 발생했습니다.');
    } else {
      setSuccessMessage('닉네임이 성공적으로 변경되었습니다!');
      setCurrentNickname(newNickname.trim());
      setNewNickname('');
    }
    setNicknameChangeLoading(false);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">정보를 불러오는 중...</p>
      </div>
    );
  }

  // 로그인되지 않은 경우 로그인 폼 표시
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
        <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">로그인 (닉네임 변경)</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="loginEmailInput" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                id="loginEmailInput" type="email" placeholder="이메일 주소"
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full" required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="loginPasswordInput" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                id="loginPasswordInput" type="password" placeholder="비밀번호"
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full" required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
            <button
              type="submit" disabled={loginLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loginLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <p className="text-sm text-center mt-6">
            <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
          </p>
        </div>
      </div>
    );
  }

  // 로그인된 경우 닉네임 변경 폼 표시
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">닉네임 변경</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">현재 닉네임: <strong>{currentNickname || '정보 없음'}</strong></p>

        <form onSubmit={handleNicknameChange}>
          <div className="mb-4">
            <label htmlFor="newNicknameInput" className="block text-sm font-medium text-gray-700 mb-1">새 닉네임</label>
            <input
              id="newNicknameInput" type="text" placeholder="2~10자"
              value={newNickname} onChange={(e) => setNewNickname(e.target.value)}
              onBlur={() => newNickname && validateAndCheckNewNickname(newNickname)}
              className="p-2 border border-gray-300 rounded w-full" required
            />
            {nicknameChangeError && <p className="text-red-500 text-xs mt-1">{nicknameChangeError}</p>}
          </div>
          {successMessage && <p className="text-green-600 text-sm mb-4 text-center">{successMessage}</p>}
          <button
            type="submit" disabled={nicknameChangeLoading || !newNickname || !!nicknameChangeError}
            className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 disabled:bg-gray-400"
          >
            {nicknameChangeLoading ? '변경 중...' : '닉네임 변경하기'}
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}