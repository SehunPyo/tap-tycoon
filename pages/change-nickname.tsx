// pages/change-nickname.tsx
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import type { User } from '@supabase/supabase-js'

export default function ChangeNickname() {
  const router = useRouter()

  // 사용자 & 로딩 상태
  const [user, setUser] = useState<User | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  // 닉네임 상태
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 닉네임 가져오는 함수 (useCallback으로 메모이제이션)
  const fetchNicknameForUser = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()
    if (!error && data?.nickname) {
      setCurrentNickname(data.nickname)
    }
  }, [])

  useEffect(() => {
    // 1) 초기 세션 하나만 체크
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchNicknameForUser(session.user.id)
      }
      setPageLoading(false)
    })

    // 2) 이후 로그인/로그아웃 이벤트만 처리
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchNicknameForUser(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [fetchNicknameForUser])

  const handleChangeNickname = async () => {
    setError('')
    if (!user) return

    const trimmed = newNickname.trim()
    if (trimmed.length < 2 || trimmed.length > 10) {
      setError('닉네임은 2~10자 사이여야 합니다.')
      return
    }
    if (trimmed === currentNickname) {
      setError('현재 닉네임과 동일합니다.')
      return
    }

    setLoading(true)
    // 중복 확인
    const { data: exist, error: chkErr } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', trimmed)
      .maybeSingle()
    if (chkErr) {
      setError('중복 확인 중 오류')
      setLoading(false)
      return
    }
    if (exist) {
      setError('이미 사용 중인 닉네임입니다.')
      setLoading(false)
      return
    }

    // 업데이트
    const { error: updErr } = await supabase
      .from('users')
      .update({ nickname: trimmed })
      .eq('id', user.id)
    setLoading(false)

    if (updErr) {
      setError('변경 중 오류가 발생했습니다.')
    } else {
      alert('닉네임이 변경되었습니다!')
      setCurrentNickname(trimmed)
      setNewNickname('')
    }
  }

  // 로딩 중
  if (pageLoading) return <div className="text-center py-20">로딩 중...</div>
  // 로그인 안 된 경우 /login으로
  if (!user) {
    router.replace('/login')
    return null
  }

  // 닉네임 변경 폼
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="max-w-sm w-full bg-gray-50 p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-center">닉네임 변경</h1>
        <p className="mb-2">현재: <strong>{currentNickname}</strong></p>
        <input
          type="text"
          placeholder="새 닉네임"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleChangeNickname}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? '변경 중…' : '변경하기'}
        </button>
      </div>
    </div>
  )
}
