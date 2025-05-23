import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function ChangeNickname() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentNickname, setCurrentNickname] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const fetchUserAndNickname = async (u: any) => {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', u.id)
      .single()

    if (error) {
      console.error('닉네임 가져오기 실패:', error.message)
      setError('닉네임 정보를 불러오는 데 실패했습니다.')
      return
    }

    setCurrentNickname(data.nickname || '')
  }

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser()

      if (initialUser) {
        setUser(initialUser)
        await fetchUserAndNickname(initialUser)
      }
      setPageLoading(false)
    }

    getInitialUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchUserAndNickname(session.user)
      } else {
        setUser(null)
        setCurrentNickname('')
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, []) // ✅ 빈 배열로 수정하여 단 1회만 실행

  const handleChangeNickname = async () => {
    setError('')
    if (!newNickname || newNickname.trim().length < 2 || newNickname.length > 10) {
      setError('닉네임은 2자 이상 10자 이하로 입력해주세요.')
      return
    }

    setLoading(true)

    const { data: existCheck, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', newNickname.trim())
      .maybeSingle()

    if (checkError) {
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
