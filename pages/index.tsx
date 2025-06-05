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
    version: '1.0.4',
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
      '<b>[배팅 확률 조정]</b> 당첨 확률이 더^^ 높아졌습니다.',
      '<b>[이 달의 도박왕 시스템 추가!]</b> 매월 가장 많은 코인을 도박에 사용한 TOP 5 랭킹이 신설되었습니다!',
      '<b>[도박왕 버프!]</b> "이 달의 도박왕" 1위부터 3위까지는 다음 한 달간 키보드 타이핑 시 획득 코인이 1.5배 증가하는 특별 버프가 적용됩니다!',
      '<b>[펫샵 기능 추가]</b> 이제 펫샵을 운영하고 펫을 분양해서 수익을 올릴 수 있습니다.',
      '<b>[상점 요소 리뉴얼]</b> 펫샵에서 분양받은 펫은 [펫 특별용품]에서 구매한 아이템만 사용이 가능합니다.',
      '<b>[상점 UI 개선]</b> 상점 UI가 더 직관적으로 개선되었습니다.',
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
