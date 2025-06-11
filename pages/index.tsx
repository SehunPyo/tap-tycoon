import Link from 'next/link';
import { useState, ReactNode } from 'react';

// --- 아코디언 아이템 컴포넌트 ---
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
        className="flex justify-between items-center w-full py-4 text-left font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {emoji && <span className="mr-3 text-lg">{emoji}</span>}
          {title}
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pl-9 text-gray-600 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

// --- 데이터 정의 ---
const featureData = [
  {
    emoji: '📈',
    title: '자산 증식',
    description: '타이핑으로 코인을 모으고, 건물을 구매하여 임대 수익을 창출하세요. 당신의 자산을 무한히 불려나가세요!',
  },
  {
    emoji: '🐾',
    title: '펫 시스템',
    description: '사랑스러운 펫을 분양받고 교감하세요. 먹이주기, 놀아주기 등 세심한 관리를 통해 펫과의 애정을 키워보세요.',
  },
  {
    emoji: '🕹️',
    title: '오락실',
    description: '인생은 한 방! 배팅, 낚시, 룰렛 등 짜릿한 미니게임으로 대박의 기회를 노려보세요. 스트레스는 풀고, 코인은 두둑히!',
  },
];

const updatesData = [
  {
    title: 'v2.0.1 주요 변경사항',
    emoji: '✨',
    content: [
      '<b>[상점 UI 개선]</b> 상점 UI가 더 직관적으로 개선되었습니다!',
      '<b>[오락실 OPEN!]</b> 도파민 터지는 미니게임을 즐겨보세요!',
      '<b>[타이틀 아이템 추가]</b> 타이틀로 본인을 소개해보세요!',
      '<b>[명예의 전당 UI 추가]</b> 명예의 전당에 이름을 올려보세요!'
    ],
  },
  {
    title: '공지사항',
    emoji: '🗽',
    content: [
      '• 타자를 치고, 건물 구매 및 업그레이드, 펫 분양 등 다양한 아이템을 활용해 랭킹 경쟁에 참여하세요!',
      '• 보유 자산 / 보유 코인 / 보유 건물(레벨 포함) 등은 매월 1일에 초기화됩니다! 이번 달도 마음껏 즐겨주세요!'
    ],
  },
];

const GameGuide = () => {
    const [activeTab, setActiveTab] = useState('assets');

    const tabs = [
        { id: 'assets', label: '자산 시스템' },
        { id: 'arcade', label: '오락실 상세' },
        { id: 'halloffame', label: '명예의 전당' },
    ];

    return (
        <div>
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="text-sm">
                {activeTab === 'assets' && (
                    <div className="space-y-4">
                        <p>당신의 재산은 <b>💰코인(현금)</b>과 <b>💼총 자산(랭킹 기준)</b>으로 관리됩니다. 아래 표를 통해 활동별 자산 변동을 확인하세요.</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">💰 코인</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">💼 총 자산</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr><td className="px-4 py-2">타이핑 수익</td><td className="px-4 py-2 text-green-600">▲ 증가</td><td className="px-4 py-2 text-green-600">▲ 증가</td></tr>
                                    <tr><td className="px-4 py-2">건물 구매/업그레이드</td><td className="px-4 py-2 text-red-600">▼ 감소</td><td className="px-4 py-2 font-semibold">변동 없음</td></tr>
                                    <tr><td className="px-4 py-2">건물 되팔기 (수수료 20%)</td><td className="px-4 py-2 text-green-600">▲ 증가 (80%)</td><td className="px-4 py-2 text-red-600">▼ 감소 (20%)</td></tr>
                                    <tr><td className="px-4 py-2">건물 자동 수익</td><td className="px-4 py-2 text-green-600">▲ 증가</td><td className="px-4 py-2 text-green-600">▲ 증가</td></tr>
                                    <tr><td className="px-4 py-2">상점 아이템 구매</td><td className="px-4 py-2 text-red-600">▼ 감소</td><td className="px-4 py-2 text-red-600">▼ 감소</td></tr>
                                    <tr><td className="px-4 py-2">오락실 게임 참여</td><td className="px-4 py-2 text-red-600">▼ 감소</td><td className="px-4 py-2 text-red-600">▼ 감소</td></tr>
                                    <tr><td className="px-4 py-2">오락실 상금 획득</td><td className="px-4 py-2 text-green-600">▲ 증가</td><td className="px-4 py-2 text-green-600">▲ 증가</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'arcade' && (
                    <div className="space-y-4">
                        <p>오락실에서 사용한 모든 금액은 '이달의 오락왕' 랭킹에 집계됩니다.</p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><b>배팅:</b> 배팅액이 클수록 상금도 커지지만, 성공 확률은 낮아집니다. 고위험 고수익에 도전하세요!</li>
                            <li><b>낚시 (참가비 3,000):</b> 60% 확률로 성공하며, 희귀한 보물상자(최대 100만 코인)를 낚을 수도 있습니다.</li>
                            <li><b>더블 or Nothing (참가비 3,000):</b> 첫 성공 확률은 70%! 이후 50% 확률로 상금이 2배가 됩니다. 짜릿한 연속 성공에 도전하세요.</li>
                            <li><b>룰렛 (참가비 10,000):</b> 5명이 모이면 시작! 단 한 명의 승자가 60,000 코인을 독차지합니다.</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'halloffame' && (
                     <div className="space-y-3">
                        <p>각 분야 최고의 플레이어는 명예의 전당에 오릅니다.</p>
                        <ul className="list-disc pl-5 space-y-2">
                           <li><b>타이핑의 신:</b> 순수 타이핑으로 가장 많은 수익을 올린 플레이어.</li>
                           <li><b>최고의 땅부자:</b> 가장 많은 수의 건물을 보유한 플레이어.</li>
                           <li><b>이달의 오락왕:</b> 해당 월에 오락실에서 가장 많은 코인을 사용한 플레이어.</li>
                        </ul>
                        <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                            <p className="font-bold">👑 특별 혜택!</p>
                            <p>'이달의 오락왕' TOP 3에게는 다음 달 초기화 전까지 모든 타이핑 수익이 <b>1.5배 증가</b>하는 '도박왕의 은총' 버프가 주어집니다!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* --- Hero Section --- */}
      <section className="w-full bg-slate-800 text-white text-center py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">🎮 Tap Tycoon</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            타이핑만으로 시작하는 당신의 비즈니스 제국. 지금 바로 최고의 거물이 되어보세요!
          </p>
          <Link href="/download" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
            지금 다운로드 (v2.0.1)
          </Link>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {featureData.map(feature => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- Game Guide Section --- */}
      <section className="w-full bg-white border-t border-b">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
           <h2 className="text-3xl font-bold text-center mb-2">게임 가이드</h2>
           <p className="text-center text-slate-500 mb-8">Tap Tycoon의 핵심 시스템을 알아보세요.</p>
           <GameGuide />
        </div>
      </section>

      {/* --- Updates Section --- */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">최신 소식</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {updatesData.map(update => (
            <AccordionItem key={update.title} title={update.title} emoji={update.emoji}>
              <div className="space-y-2">
                {update.content.map((item, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </div>
            </AccordionItem>
          ))}
        </div>
      </section>

      {/* --- CTA and Footer --- */}
      <footer className="w-full bg-slate-200 border-t">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold mb-4">준비되셨나요?</h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link href="/signup" className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-900 transition">
              회원가입
            </Link>
            <Link href="/change-nickname" className="text-slate-700 font-medium px-6 py-2 rounded-md hover:bg-slate-300 transition">
              닉네임 변경
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}