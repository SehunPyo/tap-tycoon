import Link from 'next/link'

export default function DownloadPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🧱 프로그램 다운로드</h1>
      <p className="mb-6">버튼을 눌러 TAP TYCOON을 시작해보세요.</p>

      {/* 🔽 여기에 EXE 또는 ZIP 링크를 넣어 */}
      <a
        href="https://github.com/SehunPyo/tap-tycoon_setup/releases/download/v1.0.2.2/TapTycoon_Setup_v1.0.2.2.exe"
        download
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        프로그램 다운로드
      </a>

      <Link href="/" className="mt-4 text-sm text-gray-600 underline hover:text-gray-800">
        돌아가기
      </Link>
    </main>
  )
}
