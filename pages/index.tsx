import Link from 'next/link';
import { useState } from 'react';

interface SectionProps {
  title: string;
  version?: string;
  items: string[];
  emoji?: string;
}

const sectionsData: SectionProps[] = [
  {
    title: 'Version',
    emoji: '🔧',    
    version: '2.0.1',
    items: []
  },
  {
    title: '공지사항',
    emoji: '🗽',
    items: [
      '• 타자를 치고, 건물 구매 및 업그레이드, 펫 분양 등 다양한 아이템을 활용해 랭킹 경쟁에 참여하세요!',
      '• 보유 자산 / 보유 코인 / 보유 건물(레벨 포함) 등은 매월 1일에 초기화됩니다! 이번 달도 마음껏 즐겨주세요!'
    ]
  },
  {
    title: '주요 변경 및 신규 기능',
    emoji: '✨',
    items: [
      '<b>[상점 UI 개선]</b> 상점 UI가 더 직관적으로 개선되었습니다!',
      '<b>[오락실 OPEN!]</b> 도파민 터지는 미니게임을 즐겨보세요!',
      '<b>[타이틀 아이템 추가]</b> 타이틀로 본인을 소개해보세요!',
      '<b>[명예의 전당 UI 추가]</b> 명예의 전당에 이름을 올려보세요!'
    ]
  }
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-12 text-center">🎮 Tap Tycoon에 오신 걸 환영합니다!</h1>

      <div className="w-full max-w-2xl space-y-6">
        {sectionsData.map((section, index) => {
          const alwaysOpen = index < 2; // 첫 두 섹션은 항상 열림
          return (
            <div key={section.title} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">
                  {section.emoji && <span className="mr-2">{section.emoji}</span>}
                  {section.title}
                </h2>
                {!alwaysOpen && (
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? '▲ 접기' : '▼ 펼치기'}
                  </button>
                )}
              </div>

              {/* 내용 렌더링 조건 */}
              {(alwaysOpen || isOpen) && (
                <div className="text-sm text-gray-700 space-y-2">
                  {section.version && (
                    <p className="text-center font-medium text-gray-500">{section.version}</p>
                  )}
                  {section.items.length > 0 ? (
                    section.items.map((item, i) => (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))
                  ) : !section.version ? (
                    <p className="italic text-gray-400">내용이 없습니다.</p>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 border-t pt-8 w-full max-w-2xl text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/change-nickname" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            닉네임 변경
          </Link>
          <Link href="/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            회원가입
          </Link>
          <Link href="/download" className="border border-black text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition">
            프로그램 다운로드
          </Link>
        </div>
      </div>
    </main>
  );
}
