// pages/signup.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link'; // 뒤로가기 링크용

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 닉네임 유효성 검사 및 중복 확인 함수
  const validateAndCheckNickname = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNicknameError('닉네임을 입력해주세요.');
      return false; // 유효하지 않음 (진행 불가)
    }
    if (trimmedName.length < 2 || trimmedName.length > 10) {
      setNicknameError('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return false; // 유효하지 않음 (진행 불가)
    }
    // 특수문자 금지 등 추가적인 유효성 검사 가능

    setNicknameError(''); // 이전 오류 메시지 초기화

    setLoading(true); // 닉네임 확인 시작
    const { data, error: fetchError } = await supabase
      .from('users') // 실제 Supabase의 users 테이블명
      .select('nickname')
      .eq('nickname', trimmedName)
      .maybeSingle();
    setLoading(false); // 닉네임 확인 완료

    if (fetchError) {
      console.error('닉네임 확인 중 오류:', fetchError.message);
      setNicknameError('닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false; // 오류 발생 시 진행 불가
    }

    if (data) { // data가 null이 아니면 (즉, 해당 닉네임의 레코드가 있으면) 중복
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return false; // 중복 (진행 불가)
    }

    return true; // 유효하고 중복되지 않음 (진행 가능)
  };

  // Supabase Auth 오류 한글 처리 함수
  const handleAuthError = (authError: any) => {
    let message = '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'; // 기본 메시지
    if (authError && authError.message) {
      console.error("Auth Error Raw: ", authError.message); // 개발용 로그
      if (authError.message.includes('User already registered')) {
        message = '이미 가입된 이메일입니다.';
      } else if (authError.message.includes('Password should be at least 6 characters')) {
        message = '비밀번호는 6자 이상이어야 합니다.';
      } else if (authError.message.includes('Unable to validate email address: invalid format')) {
        message = '유효하지 않은 이메일 형식입니다.';
      }
      // ... 기타 Supabase 오류 메시지에 대한 한글 매핑 추가 ...
    }
    setError(message);
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 기본 제출 방지 (필요시)
    setError('');
    setNicknameError('');
    setLoading(true);

    // 0. 닉네임 유효성 검사 및 중복 확인
    const isNicknameValid = await validateAndCheckNickname(nickname);
    if (!isNicknameValid) {
      setLoading(false);
      return;
    }

    // 1. Supabase Auth에 사용자 생성
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      handleAuthError(signUpError);
      setLoading(false);
      return;
    }

    // 2. users 테이블에 닉네임 및 기타 정보 저장
    if (signUpData?.user) {
      const userId = signUpData.user.id;
      const userEmail = signUpData.user.email; // auth에서 반환된 이메일 사용

      const { error: insertError } = await supabase.from('users').insert([
        {
          id: userId,
          email: userEmail, // users 테이블에 email도 저장
          nickname: nickname.trim(), // 닉네임 저장 (공백 제거)
          coins: 0,
          total_taps: 0,
        },
      ]);

      if (insertError) {
        console.error('users 테이블 insert 실패:', insertError.message);
        // 이 경우 auth.users에는 사용자가 생성되었지만, users 테이블에는 정보가 없는 상태.
        // 이상적으로는 auth에 생성된 사용자도 롤백(삭제)해야 하지만 클라이언트에서는 admin 권한이 없음.
        // 서버리스 함수를 사용하면 트랜잭션 처리가 용이함.
        setError(
          '회원가입은 성공했으나, 사용자 프로필 정보 저장에 실패했습니다. 다시 시도하거나 관리자에게 문의해주세요.'
        );
        // 여기서 이미 생성된 auth 사용자를 어떻게 처리할지 결정 필요.
        // 예를 들어, 사용자에게 이메일로 이 상황을 알리고 수동 처리를 안내하거나,
        // (고급) 클라이언트에서 특정 플래그를 남겨 다음 로그인 시 프로필 생성을 유도할 수 있음.
        setLoading(false);
        return;
      }

      // 모든 과정 성공
      alert('회원가입 성공! 프로그램을 다운받아 실행해주세요!');
      router.push('/download'); // 다운로드 페이지로 이동
    } else {
      // signUpData.user가 없는 경우 (이론적으로는 signUpError가 먼저 발생해야 함)
      setError('알 수 없는 오류로 회원가입에 실패했습니다. (사용자 정보 없음)');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={(e) => e.preventDefault()}> {/* Enter키로 인한 기본 제출 방지 */}
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
              onBlur={() => nickname && validateAndCheckNickname(nickname)} // 포커스 아웃 시 닉네임 유효성/중복 검사
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
            {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading} // 로딩 중 버튼 비활성화
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