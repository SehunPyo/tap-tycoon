import Link from 'next/link';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
      '타자를 치고, 건물 구매 및 업그레이드, 펫 분양 등 다양한 아이템을 활용해 랭킹 경쟁에 참여하세요!',
      '보유 자산 / 보유 코인 / 보유 건물(레벨 포함) 등은 매월 1일에 초기화됩니다! 이번 달도 마음껏 즐겨주세요!'
    ]
  },
  {
    title: '주요 변경 및 신규 기능',
    emoji: '✨',
    items: [
      '[배팅 확률 조정] 당첨 확률이 더 높아졌습니다.',
      '[이 달의 도박왕 시스템 추가!] 매월 가장 많은 코인을 도박에 사용한 TOP 5 랭킹이 신설되었습니다!',
      '[도박왕 버프!] 1위~3위는 다음 달에 코인 획득량 1.5배 버프 적용됩니다!',
      '펫샵 기능 추가: 펫샵 운영권 구매 후 수익을 올리세요.',
      '상점 UI 개선: 더 직관적이고 깔끔해졌습니다.'
    ]
  }
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className="bg-gradient-to-b from-indigo-600 to-indigo-700 min-h-screen flex flex-col items-center py-16 text-white">
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        🎮 Tap Tycoon 공식 운영페이지
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {sectionsData.map((section, idx) => (
          <Card key={section.title} className="bg-white text-gray-800 shadow-lg">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{section.emoji}</span>
                <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
              </div>
              {idx >= 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection(idx)}
                  aria-label={openIndex === idx ? '접기' : '펼치기'}
                >
                  {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
                </Button>
              )}
            </CardHeader>
            {(idx < 2 || openIndex === idx) && (
              <CardContent className="space-y-3 pt-2">
                {section.version && (
                  <p className="text-center font-medium text-indigo-500">
                    {section.version}
                  </p>
                )}
                {section.items.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  !section.version && <p className="italic text-gray-500">내용이 없습니다.</p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/change-nickname">닉네임 변경</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/signup">회원가입</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/download">프로그램 다운로드</Link>
        </Button>
      </div>
    </main>
  );
}
