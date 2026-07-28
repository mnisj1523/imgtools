import { Outlet, Link, useLocation } from 'react-router-dom'

const tools = [
  { path: '/resize', label: '리사이즈', icon: '📐' },
  { path: '/convert', label: '포맷 변환', icon: '🔄' },
  { path: '/compress', label: '압축', icon: '📦' },
  { path: '/crop', label: '자르기', icon: '✂️' },
  { path: '/heic-to-jpg', label: 'HEIC→JPG', icon: '📱' },
  { path: '/image-to-pdf', label: '이미지→PDF', icon: '📄' },
  { path: '/rotate', label: '회전', icon: '🔃' },
  { path: '/gif-maker', label: 'GIF 만들기', icon: '🎞️' },
]

function AdBanner({ position }) {
  return (
    <div className="w-full flex justify-center my-2">
      <div className="bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-xs flex items-center justify-center"
        style={{ width: '100%', maxWidth: '728px', height: '90px' }}>
        광고 영역 ({position})
      </div>
    </div>
  )
}

export { AdBanner }

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 no-underline flex-shrink-0">
            🛠️ ImgTools
          </Link>
          <nav className="hidden sm:flex gap-1 overflow-x-auto ml-4">
            {tools.map(t => (
              <Link
                key={t.path}
                to={t.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors whitespace-nowrap ${
                  pathname === t.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.icon} {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <AdBanner position="상단" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <AdBanner position="하단" />

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 mb-16 sm:mb-0">
        <p>ImgTools — 브라우저에서 바로 처리, 서버 업로드 없음</p>
        <p className="mt-1">모든 파일은 내 컴퓨터에서만 처리됩니다.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link to="/about" className="text-gray-400 hover:text-gray-600 no-underline">소개</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-gray-600 no-underline">개인정보처리방침</Link>
          <Link to="/terms" className="text-gray-400 hover:text-gray-600 no-underline">이용약관</Link>
        </div>
      </footer>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex overflow-x-auto py-2 px-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {tools.map(t => (
            <Link
              key={t.path}
              to={t.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs no-underline flex-shrink-0 ${
                pathname === t.path
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="whitespace-nowrap">{t.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
