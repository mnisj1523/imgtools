import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const tools = [
  { path: '/resize', icon: '📐', name: '이미지 리사이즈', desc: '원하는 크기로 이미지 크기를 변경합니다.' },
  { path: '/convert', icon: '🔄', name: '포맷 변환', desc: 'PNG, JPG, WebP 등 원하는 포맷으로 변환합니다.' },
  { path: '/compress', icon: '📦', name: '이미지 압축', desc: '이미지 용량을 줄여 저장 공간을 절약합니다.' },
  { path: '/crop', icon: '✂️', name: '이미지 자르기', desc: '원하는 영역만 선택해서 잘라냅니다.' },
  { path: '/heic-to-jpg', icon: '📱', name: 'HEIC → JPG', desc: '아이폰 사진(HEIC)을 JPG로 변환합니다.' },
  { path: '/image-to-pdf', icon: '📄', name: '이미지 → PDF', desc: '여러 이미지를 하나의 PDF로 합칩니다.' },
  { path: '/rotate', icon: '🔃', name: '회전/뒤집기', desc: '이미지를 회전하거나 좌우/상하로 뒤집습니다.' },
  { path: '/gif-maker', icon: '🎞️', name: 'GIF 만들기', desc: '여러 이미지로 움직이는 GIF를 만듭니다.' },
]

export default function About() {
  useEffect(() => {
    document.title = '소개 | ImgTools - 무료 온라인 이미지 편집 도구'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'ImgTools 소개. 무료 온라인 이미지 편집 도구 모음. 서버 업로드 없이 브라우저에서 안전하게 처리합니다.')
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ImgTools 소개</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">ImgTools란?</h2>
          <p>
            ImgTools는 무료 온라인 이미지 편집 도구 모음입니다.
            이미지 리사이즈, 포맷 변환, 압축, 자르기 등 일상적으로 필요한 이미지 편집 기능을
            별도의 프로그램 설치 없이 웹 브라우저에서 바로 사용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">특징</h2>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="font-bold text-blue-900 mb-1">🔒 안전한 처리</p>
              <p className="text-sm text-blue-800">모든 파일은 브라우저에서만 처리됩니다. 서버로 업로드되지 않아 개인정보가 안전합니다.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="font-bold text-green-900 mb-1">💰 완전 무료</p>
              <p className="text-sm text-green-800">모든 도구를 횟수 제한 없이 무료로 사용할 수 있습니다. 회원가입도 필요 없습니다.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="font-bold text-purple-900 mb-1">⚡ 빠른 처리</p>
              <p className="text-sm text-purple-800">서버 업로드/다운로드 없이 브라우저에서 즉시 처리하므로 매우 빠릅니다.</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <p className="font-bold text-orange-900 mb-1">📱 모바일 지원</p>
              <p className="text-sm text-orange-800">PC, 태블릿, 스마트폰 등 모든 기기에서 사용할 수 있는 반응형 디자인입니다.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제공 도구</h2>
          <div className="grid gap-3 mt-4">
            {tools.map(t => (
              <Link
                key={t.path}
                to={t.path}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 no-underline hover:border-blue-300 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">문의</h2>
          <p>
            서비스 이용 중 불편한 점이나 건의 사항이 있으시면 아래 이메일로 연락 부탁드립니다.
          </p>
          <p className="mt-2 font-medium">이메일: contact@ngym.co.kr</p>
        </section>
      </div>
    </div>
  )
}
