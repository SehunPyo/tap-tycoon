import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Welcome, Tap Tycoon</h1>
      <p className="mb-4">--------------------------- 🧱 버 전 관 리 🧱 ---------------------------</p>
      <p className="mb-4">ver 1.0.2</p>
      <p className="mb-4">--------------------------- 🗽 공 지 사 항 🗽 ---------------------------</p>
      <p className="mb-4">•   타자 1회 = 1원! 건물을 사고, 랭킹을 올리고 미니게임을 즐겨보세요!</p>
      <p className="mb-4">•   보유 자산 / 보유 코인 / 보유 건물 등은 매월 1일에 초기화 됩니다! 아낌 없이 사용하세요!</p>
      <p className="mb-4">--------------------------- ✨ 새로운 기능 ✨ ---------------------------</p>
      <p className="mb-4">•  펫 기능이 추가되었습니다.</p>
      <p className="mb-4">•  랭킹에 마우스를 올려보세요! 닉네임과 TOP 10이 표시됩니다.</p>
      <p className="mb-4">-----------------------------------------------------</p>
      <div className="flex gap-4">
        <Link href="/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          회원가입
        </Link>
        <Link href="/download" className="border border-black px-4 py-2 rounded hover:bg-gray-100">
          프로그램 다운로드
        </Link>
      </div>
    </main>
  )
}
