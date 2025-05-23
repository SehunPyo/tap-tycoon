// pages/change-nickname.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User, AuthError } from '@supabase/supabase-js'

export default function ChangeNickname() {
  // 페이지 로딩 / 사용자 상태
  const [pageLoading, setPageLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // --- 로그인 폼 상태 ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // --- 닉네임 변경 폼 상태 ---
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [nickError, setNickError] = useState('')
  const [nickLoading, setNickLoading] = useState(false)

  // 1) 페이지 최초 로드 시 이미 세션이 있으면 user 세팅 + 닉네임 로드
  useEffect(() => {
    const init = async () => {
      type GetUserResult = { data: { user: User | null }; error: AuthError | null }
      const { data: { user: existingUser } } = (await supabase.auth.getUser()) as GetUserResult

      if (existingUser) {
        setUser(existingUser)
        // 기존 닉네임 가져오기
        const { data, error } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', existingUser.id)
          .single()
        if (!error && data.nickname) {
          setCurrentNickname(data.nickname)
        }
      }

      setPageLoading(false)
    }
    init()
  }, [])

  // 로그인 처리
  const handleLogin = async () => {
    setLoginError('')
    setLoginLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoginLoading(false)

    if (error) {
      setLoginError(error.message)
      return
    }
    if (data.user) {
      setUser(data.user)
      // 로그인 직후 닉네임 로드
      const { data: nickData, error: nickErr } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', data.user.id)
        .single()
      if (!nickErr && nickData.nickname) {
        setCurrentNickname(nickData.nickname)
      }
    }
  }

  // 닉네임 변경 처리
  const handleChangeNickname = async () => {
    setNickError('')
    const trimmed = newNickname.trim()

    if (trimmed.length < 2 || trimmed.length > 10) {
      setNickError('닉네임은 2~10자 사이여야 합니다.')
      return
    }
    if (trimmed === currentNickname) {
      setNickError('현재 닉네임과 동일합니다.')
      return
    }

    setNickLoading(true)
    // 중복 체크
    const { data: exist, error: chkErr } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', trimmed)
      .maybeSingle()

    if (chkErr) {
      setNickError('중복 확인 중 오류가 발생했습니다.')
      setNickLoading(false)
      return
    }
    if (exist) {
      setNickError('이미 사용 중인 닉네임입니다.')
      setNickLoading(false)
      return
    }

    // 실제 업데이트
    const { error: updErr } = await supabase
      .from('users')
      .update({ nickname: trimmed })
      .eq('id', user!.id)

    setNickLoading(false)
    if (updErr) {
      setNickError('닉네임 변경 중 오류가 발생했습니다.')
    } else {
      alert('닉네임이 성공적으로 변경되었습니다!')
      setCurrentNickname(trimmed)
      setNewNickname('')
    }
  }

  // 페이지 초기 로딩
  if (pageLoading) {
    return <div className="text-center py-20">로딩 중...</div>
  }

  // ① user가 없으면 로그인 폼 렌더
  if (!user) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 bg-gray-50 rounded shadow">
        <h2 className="text-center text-xl font-bold mb-4">로그인 후 이용</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
        <button
          onClick={handleLogin}
          disabled={loginLoading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loginLoading ? '로그인 중…' : '로그인'}
        </button>
      </div>
    )
  }

  // ② user가 있으면 닉네임 변경 폼 렌더
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="max-w-sm w-full bg-gray-50 p-6 rounded shadow">
        <h2 className="text-center text-xl font-bold mb-4">닉네임 변경</h2>
        <p className="mb-2">현재 닉네임: <strong>{currentNickname}</strong></p>
        <input
          type="text"
          placeholder="새 닉네임"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        {nickError && <p className="text-red-500 text-sm mb-2">{nickError}</p>}
        <button
          onClick={handleChangeNickname}
          disabled={nickLoading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {nickLoading ? '변경 중…' : '변경하기'}
        </button>
      </div>
    </div>
  )
}
