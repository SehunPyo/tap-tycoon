// pages/change-nickname.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import type { User, AuthError } from '@supabase/supabase-js'

export default function ChangeNickname() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  /**
   * 사용자 ID로 닉네임을 조회해서 문자열 혹은 null을 반환
   */
  const fetchNicknameForUser = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('닉네임 조회 실패:', error.message)
      setError('닉네임 정보를 불러오는 데 실패했습니다.')
      return null
    }
    return data.nickname
  }

  useEffect(() => {
    const getInitialData = async () => {
      // ──────────────────────────────────────────────
      // 1) getUser() 반환 타입을 명시적으로 선언
      type GetUserResult = {
        data: { user: User | null }
        error: AuthError | null
      }
      // 2) response 변수에 명시적 타입을 붙여서 any 추론 제거
      const response: GetUserResult = await supabase.auth.getUser()
      // 3) 이제 안전하게 user 꺼내쓰기
      const initialUser = response.data.user
      // ──────────────────────────────────────────────

      if (initialUser) {
        setUser(initialUser)
        const nickname = await fetchNicknameForUser(initialUser.id)
        if (nickname) {
          setCurrentNickname(nickname)
        }
      }

      setPageLoading(false)
    }

    getInitialData()
  }, [])

  const handleChangeNickname = async () => {
    setError('')
    if (!user) {
      setError('사용자 정보가 없어 닉네임을 변경할 수 없습니다. 다시 로그인 해주세요.')
      return
    }
    const trimmed = newNickname.trim()
    if (trimmed.length < 2 || trimmed.length > 10) {
      setError('닉네임은 2자 이상 10자 이하로 입력해주세요.')
      return
    }
    if (trimmed === currentNickname) {
      setError('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.')
      return
    }

    setLoading(true)
    // 닉네임 중복 확인
    const { data: existCheck, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', trimmed)
      .maybeSingle()

    if (checkError) {
      console.error('중복 확인 실패:', checkError.message)
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
    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname: trimmed })
      .eq('id', user.id)

    if (updateError) {
      console.error('변경 실패:', updateError.message)
      setError('닉네임 변경 중 오류가 발생했습니다.')
    } else {
      alert('닉네임이 성공적으로 변경되었습니다!')
      setCurrentNickname(trimmed)
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
        로그인된 사용자가 없습니다.
        <br />
        <button
          onClick={() => router.push('/')}
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
