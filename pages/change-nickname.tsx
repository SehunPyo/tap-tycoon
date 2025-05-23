// pages/change-nickname.tsx

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import type { User } from '@supabase/supabase-js'

export default function ChangeNickname() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  /**
   * 닉네임을 가져오는 함수
   *
   * @param userId - 사용자 ID
   * @returns 닉네임 문자열 또는 null
   */
  const fetchNicknameForUser = async (userId: string): Promise<string | null> => {
    console.log('fetchNicknameForUser 호출됨')
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('닉네임 가져오기 실패:', error.message)
      setError('닉네임 정보를 불러오는 데 실패했습니다.')
      return null
    }

    return data.nickname
  }

  useEffect(() => {
    const getInitialData = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser()
      console.log('getInitialData: initialUser', initialUser?.id)

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
      setLoading(false)
      return
    }

    if (!newNickname || newNickname.trim().length < 2 || newNickname.length > 10) {
      setError('닉네임은 2자 이상 10자 이하로 입력해주세요.')
      return
    }

    if (newNickname.trim() === currentNickname) {
      setError('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.')
      return
    }

    setLoading(true)

    const { data: existCheck, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', newNickname.trim())
      .maybeSingle()

    if (checkError) {
      console.error('닉네임 중복 확인 중 오류:', checkError.message)
      setError('닉네임 중복 확인 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    if (existCheck) {
      setError('이미 사용 중인 닉네임입니다.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname: newNickname.trim() })
      .eq('id', user.id)

    if (updateError) {
      console.error('닉네임 변경 실패:', updateError.message)
      setError('닉네임 변경 중 오류가 발생했습니다.')
    } else {
      alert('닉네임이 성공적으로 변경되었습니다!')
      setCurrentNickname(newNickname.trim())
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
