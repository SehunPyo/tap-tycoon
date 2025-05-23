// pages/index.tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUserData();
  }, []); // ✅ 무한 루프 방지

  useEffect(() => {
    const fetchNickname = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('닉네임 조회 실패:', error.message);
        } else {
          setNickname(data.nickname);
        }
      }
    };

    fetchNickname();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.reload();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tap Tycoon 메인 페이지</h1>

      {nickname ? (
        <p>👋 안녕하세요, <strong>{nickname}</strong>님!</p>
      ) : (
        <p>⏳ 사용자 정보를 불러오는 중입니다...</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link href="/change-nickname">
          <button style={{ marginRight: '10px' }}>닉네임 변경</button>
        </Link>

        <Link href="/download">
          <button style={{ marginRight: '10px' }}>프로그램 다운로드</button>
        </Link>

        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
}
