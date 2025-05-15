import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🧱 Tap Tycoon</h1>
      <p className="mb-4">타자 1회 = 1원! 건물을 사고, 랭킹을 올려보세요.</p>
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
