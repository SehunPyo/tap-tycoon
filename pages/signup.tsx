// pages/signup.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
    } else {
      const userId = signUpData?.user?.id

      if (userId) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: userId,
            email: email,
            coins: 0,
            total_taps: 0,
          },
        ])

        if (insertError) {
          console.error('users 테이블 insert 실패:', insertError.message)
          setError('회원가입은 되었지만 사용자 정보 저장에 실패했어요. 관리자에게 문의해주세요.')
          return
        }
      }

      alert('회원가입 성공! 프로그램을 다운받아 실행해주세요!')
      router.push('/download')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 p-2 border border-gray-300 rounded w-full max-w-sm"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3 p-2 border border-gray-300 rounded w-full max-w-sm"
      />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button
        onClick={handleSignup}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        가입하기
      </button>
    </div>
  )
}
