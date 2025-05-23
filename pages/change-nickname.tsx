import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import type { User } from '@supabase/supabase-js' // User 타입 임포트

export default function ChangeNickname() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null) // User 또는 null 타입 명시
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // 닉네임을 가져오는 함수
  const fetchNicknameForUser = async (userId: string) => {
    console.log('fetchNicknameForUser 호출됨'); // 디버깅용
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('닉네임 가져오기 실패:', error.message)
      setError('닉네임 정보를 불러오는 데 실패했습니다.')
      return null; // 실패 시 null 반환
    }

    return data.nickname; // 성공 시 닉네임 반환
  }

  useEffect(() => {
    // 페이지 로드 시 초기 사용자 및 닉네임 가져오기
    const getInitialData = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      console.log('getInitialData: initialUser', initialUser?.id); // 디버깅용

      if (initialUser) {
        setUser(initialUser);
        const nickname = await fetchNicknameForUser(initialUser.id);
        if (nickname) {
          setCurrentNickname(nickname);
        }
      }
      setPageLoading(false);
    };

    getInitialData();

    // onAuthStateChange 리스너 제거됨 (이전 논의에서 불필요하다고 판단)
  }, []); // 빈 배열로 수정하여 단 1회만 실행

  const handleChangeNickname = async () => {
    setError('')
    // ★★★ user.id 에러 해결: 함수 시작 시 user가 null인지 다시 확인 ★★★
    if (!user) {
      setError('사용자 정보가 없어 닉네임을 변경할 수 없습니다. 다시 로그인 해주세요.');
      setLoading(false); // 로딩 상태가 true로 되어있을 수도 있으니 false로 설정
      return;
    }

    if (!newNickname || newNickname.trim().length < 2 || newNickname.length > 10) {
      setError('닉네임은 2자 이상 10자 이하로 입력해주세요.')
      return
    }
    if (newNickname.trim() === currentNickname) { // 현재 닉네임과 동일한 경우 변경 불필요
      setError('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.');
      return;
    }

    setLoading(true)

    // 닉네임 중복 확인
    const { data: existCheck, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', newNickname.trim())
      .maybeSingle()

    if (checkError) {
      console.error('닉네임 중복 확인 중 오류:', checkError.message);
      setError('닉네임 중복 확인 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    if (existCheck) {
      setError('이미 사용 중인 닉네임입니다.')
      setLoading(false)
      return
    }

    // 닉네임 업데이트
    // 이 시점에는 user가 null이 아님이 TypeScript에 명시적으로 알려졌으므로 user.id 사용 가능
    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname: newNickname.trim() })
      .eq('id', user.id) 

    if (updateError) {
      console.error('닉네임 변경 실패:', updateError.message)
      setError('닉네임 변경 중 오류가 발생했습니다.')
    } else {
      alert('닉네임이 성공적으로 변경되었습니다!')
      setCurrentNickname(newNickname.trim()) // UI 상태만 업데이트
      setNewNickname('')
    }

    setLoading(false)
  }

  if (pageLoading) {
    return <div className="text-center py-20">로딩 중...</div>
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        로그인된 사용자가 없습니다. <br />
        <button
          // ★★★ router 에러가 계속되면 아래처럼 변경해보세요.
          // onClick={() => router!.push('/')} 
          onClick={() => router.push('/')} // 일반적으로는 이대로 문제 없습니다.
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          홈으로 가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">닉네임 변경</h1>
        <p className="mb-4 text-sm text-center">
          현재 닉네임: <span className="font-semibold">{currentNickname}</span>
        </p>
        <input
          type="text"
          placeholder="새 닉네임 입력"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleChangeNickname}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? '변경 중...' : '닉네임 변경'}
        </button>
      </div>
    </div>
  )
}