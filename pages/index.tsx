// pages/index.tsx
import Link from 'next/link';
import { useState } from 'react'; // 접기/펼치기 기능을 위해 useState 임포트

// 각 섹션의 제목과 내용을 관리하기 위한 인터페이스 (선택적이지만 가독성 향상)
interface SectionProps {
  title: string;
  version?: string; // 버전 정보는 선택적
  items: string[];
  emoji?: string; // 섹션 제목 옆 이모지
}

// 섹션 데이터를 배열로 정의
const sectionsData: SectionProps[] = [
  {
    title: "버 전 관 리",
    emoji: "🧱",
    version: "ver 1.0.2",
    items: [] // 버전 정보는 title 아래 별도 표시
  },
  {
    title: "공 지 사 항",
    emoji: "🗽",
    items: [
      "•   타자를 치고, 건물 구매 및 업그레이드, 펫 분양 등 다양한 아이템을 활용해 랭킹 경쟁에 참여하세요!",
      "•   보유 자산 / 보유 코인 / 보유 건물(레벨 포함) 등은 매월 1일에 초기화됩니다! 이번 달도 마음껏 즐겨주세요!"
    ]
  },
  {
    title: "주요 변경 및 신규 기능",
    emoji: "✨",
    items: [
      "•  <b>[펫 시스템 대폭 강화]</b> 밥 주기, 간식 주기, 놀아주기, 잠재우기, 건강/관리용품 사용 등 다양한 상호작용이 가능해졌습니다.",
      "•  <b>[건물 업그레이드 및 시간당 수익]</b> 이제 보유한 건물을 클릭하여 업그레이드할 수 있습니다! 업그레이드된 건물은 시간당 일정량의 코인과 자산을 자동으로 벌어들입니다.",
      "•  <b>[상점 개편]</b> 펫 분양권, 다양한 펫 용품(사료, 간식, 장난감, 은신처, 관리용품) 및 특수 효과를 지닌 버닝 아이템을 구매할 수 있습니다.",
      "•  <b>[도박 기능 개선]</b> 배팅 옵션이 더욱 다양해지고, 1천원 배팅의 당첨 확률이 상향 조정되었습니다.",
      "•  <b>[버닝 아이템 효과 적용]</b> 버닝 아이템 사용이 실제로 가능해졌습니다.",
      "•  <b>[UI 및 편의성 개선]</b> 새로고침 버튼 클릭 시, 적립 중인 코인도 함께 저장됩니다.",
      "•  <b>[UI 및 편의성 개선]</b> 프로그램 종료 시 진행 중이던 데이터가 저장됩니다.",
      "•  <b>[버그 수정 및 안정화]</b> 펫 관련 팝업(가방, 활동)의 아이템 선택 및 사용 기능이 정상적으로 동작하도록 수정되었습니다.",
      "•  <b>[버그 수정 및 안정화]</b> 건물 외 구매 가능한 아이템 구매 시, 코인뿐만 아니라 총 자산도 함께 차감되도록 수정되었습니다.",
      "•  <b>[버그 수정 및 안정화]</b> 간헐적으로 발생하던 펫 아이템 구매 관련 오류(펫 없음 메시지, 수량 문제 등)가 개선되었습니다."
    ]
  }
];

export default function Home() {
  // 각 섹션의 펼침/접힘 상태를 관리하는 state 배열
  // sectionsData의 각 요소에 대해 초기값 false (접힘)로 설정
  const [openSections, setOpenSections] = useState<boolean[]>(
    Array(sectionsData.length).fill(false)
  );

  // 섹션 제목 클릭 시 해당 섹션의 펼침/접힘 상태를 토글하는 함수
  const toggleSection = (index: number) => {
    setOpenSections(prevOpenSections =>
      prevOpenSections.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-10">Welcome, Tap Tycoon</h1>
      
      {sectionsData.map((section, index) => (
        <div key={section.title} className="w-full max-w-2xl mb-6">
          <button
            onClick={() => toggleSection(index)}
            className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-t-md focus:outline-none flex justify-between items-center"
          >
            <h2 className="text-lg font-semibold">
              {section.emoji && <span className="mr-2">{section.emoji}</span>}
              <b>{section.title}</b>
              {section.emoji && <span className="ml-2">{section.emoji}</span>}
            </h2>
            <span>{openSections[index] ? '▲ 접기' : '▼ 펼치기'}</span>
          </button>
          {openSections[index] && (
            <div className="border border-t-0 border-gray-200 p-4 rounded-b-md bg-gray-50">
              {section.version && ( // 버전 정보가 있을 경우 별도 표시
                <p className="mb-3 text-center font-medium">{section.version}</p>
              )}
              {section.items.map((item, itemIndex) => (
                <p 
                  key={itemIndex} 
                  className="mb-2 text-sm"
                  dangerouslySetInnerHTML={{ __html: item }} // <b> 태그 등을 HTML로 렌더링
                />
              ))}
              {section.items.length === 0 && !section.version && ( // 내용이 없고 버전도 없는 섹션 (예: 빈 공지)
                 <p className="text-sm text-gray-500 italic">내용이 없습니다.</p>
              )}
            </div>
          )}
          {index < sectionsData.length -1 && <hr className="my-2 border-gray-300"/>}
        </div>
      ))}
      
      <p className="mb-8">-----------------------------------------------------</p>
      
      {/* 버튼들을 감싸는 div에 flex와 gap 클래스 적용 */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/change-nickname" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
          닉네임 변경
        </Link>
        <Link href="/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
          회원가입
        </Link>
        <Link href="/download" className="border border-black text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
          프로그램 다운로드
        </Link>
      </div>
    </main>
  )
}