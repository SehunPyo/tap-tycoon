import Link from 'next/link';
import { useState, ReactNode } from 'react';

// 재사용 가능한 아코디언 컴포넌트
interface AccordionItemProps {
  title: string;
  emoji?: string;
  children: ReactNode;
}

const AccordionItem = ({ title, emoji, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg"
      >
        <span className="flex items-center">
          {emoji && <span className="mr-2 text-2xl">{emoji}</span>}
          {title}
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="pt-2 pl-12 pb-6 text-gray-700 leading-relaxed">{children}</div>}
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">🎮 Tap Tycoon</h1>
        <p className="text-xl mb-8">타이핑으로 시작하는 비즈니스 제국. 코인을 모으고, 건물을 키워, 최고의 자리에 도전하세요!</p>
        <div className="space-x-4">
          <Link href="/download" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:scale-105 transform transition">
            다운로드
          </Link>
          <Link href="/signup" className="bg-transparent border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition">
            회원가입
          </Link>
        </div>
      </section>

      {/* System Overview */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6">시스템 소개</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <AccordionItem title="💰 자산 흐름" emoji="🪙">
            <table className="w-full text-sm mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">활동</th>
                  <th className="p-2">코인 변화</th>
                  <th className="p-2">총 자산 변화</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2">타이핑 수익</td><td className="p-2 text-green-600">+ 코인</td><td className="p-2 text-green-600">+ 자산</td></tr>
                <tr><td className="p-2">건물 구매/업그레이드</td><td className="p-2 text-red-600">- 코인</td><td className="p-2">-</td></tr>
                <tr><td className="p-2">건물 임대 수익</td><td className="p-2 text-green-600">+ 코인</td><td className="p-2 text-green-600">+ 자산</td></tr>
                <tr><td className="p-2">건물 매도 (수수료 20%)</td><td className="p-2 text-green-600">+80%</td><td className="p-2 text-red-600">-20%</td></tr>
                <tr><td className="p-2">상점 아이템 구매</td><td className="p-2 text-red-600">- 코인</td><td className="p-2 text-red-600">- 자산</td></tr>
              </tbody>
            </table>
            <p className="text-gray-600">* 매월 1일 코인·자산 초기화</p>
          </AccordionItem>

          <AccordionItem title="🛠️ 건물 업그레이드" emoji="🏢">
            <ul className="list-disc pl-5 space-y-2">
              <li><b>레벨 1 → 2:</b> 임대 수익 +10%</li>
              <li><b>레벨 2 → 3:</b> 임대 수익 +15%</li>
              <li>최대 레벨 5까지 업그레이드 가능</li>
              <li>업그레이드마다 필요 코인 및 소요 시간 표시</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="🎰 미니게임 확률 & 보상" emoji="🕹️">
            <ul className="list-disc pl-5 space-y-2">
              <li><b>배팅:</b> 성공 확률 50%, 배팅액 2배 보상</li>
              <li><b>낚시 (₩3,000):</b> 성공 60%, 일반 물고기 ₩5,000, 보물상자 최대 ₩100,000</li>
              <li><b>더블 or Nothing (₩3,000):</b> 첫 성공 70%, 이후 단계별 50%</li>
              <li><b>룰렛 (₩10,000):</b> 5명 참여 시 시작, 1등 ₩60,000 싹쓸이</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="🏆 랭킹 기준" emoji="📊">
            <ul className="list-disc pl-5 space-y-2">
              <li><b>타이핑의 신:</b> 순수 타이핑 수익으로 랭킹</li>
              <li><b>최고의 땅부자:</b> 보유 자산(건물+코인) 순 랭킹</li>
              <li><b>이달의 오락왕:</b> 미니게임 사용 코인 합산 순위</li>
            </ul>
            <p className="mt-3 text-yellow-700 bg-yellow-100 p-3 rounded">이달의 오락왕 TOP3 버프: 다음 달 타이핑 수익 1.5배</p>
          </AccordionItem>
        </div>
      </section>

      {/* Footer / Download */}
      <footer className="bg-slate-100 py-12">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">지금 바로 시작하세요!</h3>
          <Link href="/download" className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition">
            다운로드 (v2.0.1)
          </Link>
        </div>
      </footer>
    </main>
  );
}
