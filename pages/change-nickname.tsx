// pages/change-nickname.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { User, AuthError } from '@supabase/supabase-js';

export default function ChangeNicknamePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentNickname, setCurrentNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        console.error('세션 가져오기 오류 또는 사용자 없음:', sessionError?.message);
        router.push('/signin'); // 로그인 페이지로 리디렉션 (또는 홈으로)
        return;
      }
      setUser(session.user);

      // 현재 닉네임 가져오기
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('현재 닉네임 가져오기 오류:', userError.message);
        setNicknameError('현재 닉네임 정보를 가져오는데 실패했습니다.');
      } else if (userData) {
        setCurrentNickname(userData.nickname);
      }
      setPageLoading(false);
    };

    fetchUser();
  }, [router]);

  const validateAndCheckNewNickname = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNicknameError('새 닉네임을 입력해주세요.');
      return false;
    }
    if (trimmedName.length < 2 || trimmedName.length > 10) {
      setNicknameError('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return false;
    }
    if (trimmedName === currentNickname) {
      setNicknameError('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.');
      return false;
    }

    setNicknameError('');
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('nickname')
      .eq('nickname', trimmedName)
      .neq('id', user?.id) // 자기 자신은 중복 체크에서 제외 (만약의 경우)
      .maybeSingle();
    setLoading(false);

    if (fetchError) {
      console.error('닉네임 중복 확인 중 오류:', fetchError.message);
      setNicknameError('닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    }

    if (data) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return false;
    }
    return true;
  };

  const handleNicknameChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setNicknameError('');
    setLoading(true);

    const isNicknameValid = await validateAndCheckNewNickname(newNickname);
    if (!isNicknameValid) {
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname: newNickname.trim() })
      .eq('id', user.id);

    if (updateError) {
      console.error('닉네임 업데이트 오류:', updateError.message);
      setNicknameError('닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    } else {
      setSuccessMessage('닉네임이 성공적으로 변경되었습니다!');
      setCurrentNickname(newNickname.trim()); // UI에 현재 닉네임 업데이트
      setNewNickname(''); // 입력 필드 초기화
      // 필요하다면, 앱의 다른 부분(예: 네비게이션 바의 사용자 이름)도 업데이트하는 로직 추가
    }
    setLoading(false);
  };

  // Auth 오류 처리를 위한 간단한 setError 함수 (signup.tsx의 handleAuthError와 유사하게 확장 가능)
  const setError = (message: string) => {
    setNicknameError(message); // 닉네임 관련 오류 필드에 통합 표시
  }


  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
        <p>사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
     // useEffect에서 리디렉션하므로 이 부분은 거의 도달하지 않음
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
            <p>로그인이 필요합니다.</p>
            <Link href="/signin" className="text-blue-600 hover:underline mt-2">로그인 페이지로 이동</Link>
        </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">닉네임 변경</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">현재 닉네임: <strong>{currentNickname || '정보 없음'}</strong></p>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="newNicknameInput" className="block text-sm font-medium text-gray-700 mb-1">새 닉네임</label>
            <input
              id="newNicknameInput"
              type="text"
              placeholder="2~10자 (한글, 영문, 숫자)"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              onBlur={() => newNickname && validateAndCheckNewNickname(newNickname)}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
            {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
          </div>

          {successMessage && <p className="text-green-600 text-sm mb-4 text-center">{successMessage}</p>}

          <button
            onClick={handleNicknameChange}
            disabled={loading || !newNickname || !!nicknameError} // 새 닉네임이 없거나, 에러가 있거나, 로딩 중이면 비활성화
            className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 disabled:bg-gray-400 transition duration-150 ease-in-out"
          >
            {loading ? '변경 중...' : '닉네임 변경하기'}
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}