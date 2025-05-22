// pages/index.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react'; // useEffect, useState 임포트
import { supabase } from '../lib/supabaseClient'; // supabase 클라이언트 임포트
import type { User } from '@supabase/supabase-js'; // User 타입 임포트

export default function Home() {
  const [user, setUser] = useState<User | null>(null); // 사용자 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Welcome, Tap Tycoon</h1>
      {/* ... (기존 공지사항 내용) ... */}
      <p className="mb-4">--------------------------- 🧱 <b>버 전 관 리</b> 🧱 ---------------------------</p>
      <p></p>
      <p className="mb-4">ver 1.0.2</p>
      <p></p>
      <p className="mb-4">--------------------------- 🗽 <b>공 지 사 항</b> 🗽 ---------------------------</p>
      <p></p>
      <p className="mb-4">•   타자를 치고, 건물 구매 및 업그레이드, 펫 분양 등 다양한 아이템을 활용해 랭킹 경쟁에 참여하세요!</p>
      <p className="mb-4">•   보유 자산 / 보유 코인 / 보유 건물(레벨 포함) 등은 매월 1일에 초기화됩니다! 이번 달도 마음껏 즐겨주세요!</p>
      <p></p>
      <p className="mb-4">--------------------------- ✨ <b>주요 변경 및 신규 기능</b> ✨ ---------------------------</p>
      <p></p>
      <p className="mb-4">•  <b>[펫 시스템 대폭 강화]</b> 밥 주기, 간식 주기, 놀아주기, 잠재우기, 건강/관리용품 사용 등 다양한 상호작용이 가능해졌습니다.</p>
      <p className="mb-4">•  <b>[건물 업그레이드 및 시간당 수익]</b> 이제 보유한 건물을 클릭하여 업그레이드할 수 있습니다! 업그레이드된 건물은 시간당 일정량의 코인과 자산을 자동으로 벌어들입니다.</p>
      <p className="mb-4">•  <b>[상점 개편]</b> 펫 분양권, 다양한 펫 용품(사료, 간식, 장난감, 은신처, 관리용품) 및 특수 효과를 지닌 버닝 아이템을 구매할 수 있습니다.</p>
      <p className="mb-4">•  <b>[도박 기능 개선]</b> 배팅 옵션이 더욱 다양해지고, 1천원 배팅의 당첨 확률이 상향 조정되었습니다.</p>
      <p className="mb-4">•  <b>[버닝 아이템 효과 적용]</b> 버닝 아이템 사용이 실제로 가능해졌습니다.</p>
      <p className="mb-4">•  <b>[UI 및 편의성 개선]</b> 새로고침 버튼 클릭 시, 적립 중인 코인도 함께 저장됩니다.</p>
      <p className="mb-4">•  <b>[UI 및 편의성 개선]</b> 프로그램 종료 시 진행 중이던 데이터가 저장됩니다.</p>
      <p className="mb-4">•  <b>[버그 수정 및 안정화]</b> 펫 관련 팝업(가방, 활동)의 아이템 선택 및 사용 기능이 정상적으로 동작하도록 수정되었습니다.</p>
      <p className="mb-4">•  <b>[버그 수정 및 안정화]</b> 건물 외 구매 가능한 아이템 구매 시, 코인뿐만 아니라 총 자산도 함께 차감되도록 수정되었습니다.</p>
      <p className="mb-4">•  <b>[버그 수정 및 안정화]</b> 간헐적으로 발생하던 펫 아이템 구매 관련 오류(펫 없음 메시지, 수량 문제 등)가 개선되었습니다.</p>
      <p></p>
      <p className="mb-4">-----------------------------------------------------</p>
      <div className="flex gap-4">
        {/* --- [수정] 로그인 상태에 따라 버튼 표시 변경 --- */}
        {loading ? (
          <p>로딩 중...</p>
        ) : user ? (
          <>
            <Link href="/change-nickname" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              닉네임 변경
            </Link>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                // router.push('/'); // 필요시 로그아웃 후 홈으로 리디렉션
              }} 
              className="border border-gray-500 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              회원가입
            </Link>
            <Link href="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              로그인
            </Link>
          </>
        )}
        <Link href="/download" className="border border-black px-4 py-2 rounded hover:bg-gray-100">
          프로그램 다운로드
        </Link>
         {/* --- [수정 끝] --- */}
      </div>
    </main>
  )
}