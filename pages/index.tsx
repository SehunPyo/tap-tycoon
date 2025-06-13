import Link from 'next/link';
import { useState, ReactNode } from 'react';

// --- Reusable Accordion Component ---
interface AccordionItemProps {
  title: string;
  emoji?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem = ({ title, emoji, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 px-6 text-left font-semibold text-lg text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center">
          {emoji && <span className="mr-3 text-2xl">{emoji}</span>}
          {title}
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="pt-2 pl-16 pr-6 pb-6 text-gray-700 leading-relaxed bg-gray-50">{children}</div>}
    </div>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-500 text-white text-center py-24 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">🎮 Tap Tycoon</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            타이핑으로 코인을 모으고, 건물 수익을 얻고, 펫샵을 운영하고, 오락실에서 일확천금을 노려보세요!
            <br />
            특별한 펫을 키우고, 랭킹의 정상에 도전하여 최고의 부자가 되어보세요!
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/download" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transform transition shadow-md">
              지금 다운로드 (v2.1.1)
            </Link>
            <Link href="/signup" className="inline-block bg-transparent border-2 border-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition">
              회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* System Overview Section */}
      <section id="features" className="container mx-auto px-4 py-20 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12">Tap Tycoon 안내서</h2>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          
          <AccordionItem title="핵심 경제 시스템" emoji="📈" defaultOpen={true}>
            <p className="mb-4">Tap Tycoon의 경제는 <strong>코인(현금)</strong>과 <strong>총 자산</strong>, 두 가지 주요 지표로 움직입니다. 총 자산은 당신의 진정한 부를 나타내며 랭킹의 기준이 됩니다.</p>
            <table className="w-full text-sm mb-4 border rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">활동</th>
                  <th className="p-3 text-center">코인 변화</th>
                  <th className="p-3 text-center">총 자산 변화</th>
                  <th className="p-3">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50"><td className="p-3">타이핑 수익</td><td className="p-3 text-green-600 font-mono text-center">+ 수익</td><td className="p-3 text-green-600 font-mono text-center">+ 수익</td><td className="p-3">가장 기본적인 자산 증식 수단</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-3">건물 구매 / 업그레이드</td><td className="p-3 text-red-600 font-mono text-center">- 비용</td><td className="p-3 font-mono text-center">변동 없음</td><td className="p-3">코인이 건물 자산으로 전환</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-3">건물 임대 수익 (패시브)</td><td className="p-3 text-green-600 font-mono text-center">+ 수익</td><td className="p-3 text-green-600 font-mono text-center">+ 수익</td><td className="p-3">자산 가치가 순수하게 증가</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-3">건물 되팔기</td><td className="p-3 text-green-600 font-mono text-center">+ 80%</td><td className="p-3 text-red-600 font-mono text-center">- 20%</td><td className="p-3">판매 수수료 20% 발생</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-3">상점 아이템 구매</td><td className="p-3 text-red-600 font-mono text-center">- 비용</td><td className="p-3 text-red-600 font-mono text-center">- 비용</td><td className="p-3">소모품 구매로 자산 감소</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-3">오락실 이용</td><td className="p-3 text-red-600 font-mono text-center">- 비용</td><td className="p-3 font-mono text-center">변동 없음</td><td className="p-3">도박은 자산 가치에 미반영</td></tr>
              </tbody>
            </table>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
              <strong>월간 초기화:</strong> 매월 1일, 모든 유저의 코인, 건물, 자산이 초기화되어 새로운 경쟁이 시작됩니다! (단, 펫과 인벤토리 아이템은 유지)
            </div>
          </AccordionItem>

          <AccordionItem title="빌딩 경영과 임대 수익" emoji="🏢">
            <p className="mb-4">다양한 건물을 구매하여 시간당 임대 수익을 창출하세요. 건물은 당신의 꾸준한 수입원입니다.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>수익 창출:</strong> 업그레이드된 건물은 1시간마다 <strong>(건물 구매가의 1%) * 보유 수량</strong> 만큼의 코인을 자동으로 벌어들입니다. 오프라인 상태에서도 수익은 누적됩니다!</li>
              <li><strong>업그레이드:</strong> 건물을 업그레이드하여 수익률을 높일 수 있습니다.
                <ul className="list-['▹'] pl-5 mt-1 text-gray-600">
                  <li><strong>비용:</strong> 건물 구매가의 50%</li>
                </ul>
              </li>
               <li><strong>되팔기:</strong> 급전이 필요할 땐 건물을 되팔 수 있지만, 구매가의 80%만 돌려받습니다.</li>
            </ul>
          </AccordionItem>
          
          <AccordionItem title="펫 시스템: 나의 소중한 동반자" emoji="🐾">
            <div className="space-y-4">
              {/* 🚨 수정된 부분 */}
              <p>상점에서 <strong>&apos;펫 분양권&apos;</strong>을 구매하여 새로운 가족을 맞이하세요. 펫은 단순한 장식품이 아닌, 당신의 관심과 사랑으로 성장하는 살아있는 동반자입니다.</p>
              <div>
                <h4 className="font-bold text-md mb-1">펫의 6대 스탯 관리</h4>
                <p className="text-sm text-gray-600 mb-2">모든 스탯은 0~100 사이 값을 가집니다. 시간이 지나면 스탯은 자연적으로 감소하니 꾸준히 돌봐주세요!</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>허기:</strong> 배고픔 정도. 사료를 주어 채워주세요. (높을수록 배고픔)</li>
                  <li><strong>만족도:</strong> 행복감. 간식이나 장난감으로 올려줄 수 있습니다.</li>
                  <li><strong>건강:</strong> 아프지 않은 정도. 다른 스탯이 너무 낮아지면 건강도 나빠집니다.</li>
                  <li><strong>에너지:</strong> 활동력. 잠을 재우거나 휴식하면 회복됩니다. (낮을수록 피곤)</li>
                  <li><strong>청결도:</strong> 깨끗한 정도. 목욕 아이템 등으로 관리할 수 있습니다.</li>
                  <li><strong>애정도:</strong> 당신과의 유대감. 꾸준한 상호작용으로 상승합니다.</li>
                </ul>
              </div>
              <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg">
                <strong>🚨 가출 주의!</strong> 펫의 <strong>에너지, 청결도, 또는 애정도</strong>가 0이 되면, 펫은 당신을 떠나 가출합니다. 한번 떠난 펫은 다시 돌아오지 않으니 세심한 관리가 필요합니다.
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="펫샵과 나만의 픽셀 펫 창조" emoji="🎨">
            {/* 🚨 수정된 부분 */}
            <p className="mb-4">상점에서 <strong>&apos;펫샵 운영 허가서&apos;</strong>를 구매하면 당신만의 펫샵을 열 수 있습니다. 펫샵에서는 당신이 직접 만든 커스텀 펫을 다른 유저에게 판매할 수 있습니다!</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>픽셀 아트 에디터:</strong> 게임 내 32x32 픽셀 에디터를 사용하여 상상 속의 펫을 직접 그려보세요. 색상 선택, 채우기, 지우개 등 다양한 툴이 제공됩니다.</li>
              {/* 🚨 수정된 부분 */}
              <li><strong>커스텀 펫 등록:</strong> 완성된 펫에게 이름, 가격, 성격, 성별을 부여하여 당신의 펫샵에 등록하세요. 기본 3개의 판매 슬롯이 제공되며, <strong>&apos;펫 등록 토큰&apos;</strong> 아이템으로 슬롯을 늘릴 수 있습니다.</li>
              <li><strong>펫 거래:</strong> 다른 유저의 펫샵을 방문하여 독특한 커스텀 펫을 구경하고 구매할 수 있습니다. 내가 소유한 펫이 없다면, 다른 유저의 펫을 분양받아 새로운 동반자로 맞이할 수 있습니다.</li>
              {/* 🚨 수정된 부분 */}
              <li><strong>특별한 아이템:</strong> 커스텀 펫은 일반 펫과 식성이 다릅니다. 상점의 <strong>&apos;특별 용품&apos;</strong> 탭에서 커스텀 펫 전용 사료와 장난감을 구매하여 먹이거나 놀아줄 수 있습니다.</li>
            </ul>
          </AccordionItem>
          
          <AccordionItem title="오락실: 인생은 한 방!" emoji="🎰">
            {/* 🚨 수정된 부분 */}
            <p className="mb-4">짜릿한 손맛과 대박의 꿈! 오락실에서 다양한 미니게임으로 코인을 불려보세요. 여기서 사용한 코인은 &apos;이달의 오락왕&apos; 랭킹에 집계됩니다.</p>
            <div className="space-y-3">
              <h4 className="font-bold">① 배팅</h4>
              <p className="text-sm">정해진 확률에 따라 승패가 결정됩니다. 고액 베팅일수록 당첨금 배율이 높아집니다! (예: 500원 베팅 시 1/2 확률로 1,500원 획득)</p>
              <h4 className="font-bold">② 낚시터</h4>
              <p className="text-sm"><strong>참가비 3,000원.</strong> 일단 무언가를 낚습니다. 해초나 깡통 같은 잡동사니부터, 수백만 코인 가치의 전설의 고래까지! 운이 좋다면 <strong>최대 100만 코인</strong>이 든 보물상자를 낚을 수도 있습니다.</p>
              <h4 className="font-bold">③ 더블</h4>
              {/* 🚨 수정된 부분 */}
              <p className="text-sm"><strong>참가비 3,000원.</strong> 2,000원의 상금으로 시작합니다. &apos;더블&apos; 성공 시 상금은 2배가 됩니다. 첫 도전 성공 확률은 70%, 그 이후부터는 50%입니다. 언제든지 &apos;상금 받기&apos;로 탈출할 수 있지만, 실패 시 모든 상금을 잃습니다.</p>
              <h4 className="font-bold">④ 룰렛</h4>
              {/* 🚨 수정된 부분 */}
              <p className="text-sm"><strong>참가비 10,000원.</strong> 총 5명의 유저가 참여하면 게임이 시작됩니다. 단 한 명의 승자가 <strong>상금 60,000원</strong>을 모두 가져갑니다! 참가하고 결과를 기다리세요.</p>
            </div>
          </AccordionItem>

          <AccordionItem title="상점, 아이템, 그리고 타이틀" emoji="🛍️">
            {/* 🚨 수정된 부분 */}
            <p className="mb-4">상점에서는 게임 플레이에 도움이 되는 다양한 아이템과 당신을 뽐낼 수 있는 특별한 &apos;타이틀&apos;을 구매할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>버닝 아이템:</strong> 사용 시 정해진 시간 동안 타이핑으로 얻는 코인 획득률이 대폭 증가합니다.</li>
              <li><strong>펫 관련 용품:</strong> 사료, 간식, 장난감, 잠자리, 관리용품 등 펫을 돌보는 데 필요한 모든 것을 판매합니다. 일부 장난감 등은 소모품이 아닌 내구도 방식입니다.</li>
              {/* 🚨 수정된 부분 */}
              <li><strong>타이틀:</strong> 랭킹에 표시되는 당신의 닉네임에 특별한 수식어를 붙일 수 있습니다. 비싼 타이틀일수록 화려한 애니메이션 효과가 적용됩니다! 인벤토리에서 자유롭게 장착/해제할 수 있습니다.</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="명예의 전당과 랭킹 보상" emoji="🏆">
             <p className="mb-4">당신의 노력을 모두에게 증명하고, 특별한 보상을 받으세요! 랭킹은 실시간으로 업데이트됩니다.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>타이핑의 신:</strong> 월간 누적 타이핑 수익으로 순위가 결정됩니다.</li>
              <li><strong>최고의 땅부자:</strong> 월간 총 자산(코인+건물가치)으로 순위가 결정됩니다.</li>
              {/* 🚨 수정된 부분 */}
              <li><strong>이달의 오락왕:</strong> 월간 오락실에서 사용한 코인의 총합으로 순위가 결정됩니다.</li>
            </ul>
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg">
              {/* 🚨 수정된 부분 */}
              <strong>✨ 오락왕 버프:</strong> &apos;이달의 오락왕&apos; 랭킹 1위에게는 다음 달 한 달간 <strong>타이핑 수익 1.5배</strong>의 강력한 버프가 주어집니다!
            </div>
          </AccordionItem>

        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">지금 바로 랭킹 1위를 차지하세요!</h3>
          <p className="text-gray-300 mb-8">무료로 다운로드하고 Tap Tycoon의 세계에 합류하세요.</p>
          <Link href="/download" className="bg-indigo-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-600 hover:scale-105 transform transition shadow-lg">
            Tap Tycoon 다운로드
          </Link>
          <p className="text-sm text-gray-500 mt-10">© 2024 Tap Tycoon. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}