import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const tools = [
  {
    path: '/resize',
    icon: '📐',
    title: '이미지 리사이즈',
    desc: '원하는 크기로 이미지 크기를 변경하세요. 픽셀 또는 퍼센트로 지정 가능합니다.',
  },
  {
    path: '/convert',
    icon: '🔄',
    title: '포맷 변환',
    desc: 'PNG, JPG, WebP 등 원하는 포맷으로 이미지를 변환하세요.',
  },
  {
    path: '/compress',
    icon: '📦',
    title: '이미지 압축',
    desc: '이미지 용량을 줄여보세요. 품질을 조절하며 압축률을 확인할 수 있습니다.',
  },
  {
    path: '/crop',
    icon: '✂️',
    title: '이미지 자르기',
    desc: '원하는 영역만 선택해서 이미지를 잘라보세요.',
  },
  {
    path: '/heic-to-jpg',
    icon: '📱',
    title: 'HEIC → JPG 변환',
    desc: '아이폰 사진(HEIC)을 JPG로 변환하세요. 브라우저에서 바로 처리됩니다.',
  },
  {
    path: '/image-to-pdf',
    icon: '📄',
    title: '이미지 → PDF',
    desc: '여러 장의 이미지를 하나의 PDF 파일로 합치세요. 순서 변경도 가능합니다.',
  },
  {
    path: '/rotate',
    icon: '🔃',
    title: '회전/뒤집기',
    desc: '이미지를 90°, 180° 회전하거나 좌우/상하로 뒤집으세요.',
  },
  {
    path: '/gif-maker',
    icon: '🎞️',
    title: 'GIF 만들기',
    desc: '여러 장의 이미지로 움직이는 GIF 애니메이션을 만드세요.',
  },
]

export default function Home() {
  useEffect(() => {
    document.title = 'ImgTools - 무료 온라인 이미지 편집 도구 | 리사이즈, 변환, 압축'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 편집 도구. 이미지 리사이즈, 포맷 변환(PNG, JPG, WebP), 압축, 자르기, HEIC 변환, PDF 변환, 회전, GIF 만들기. 서버 업로드 없이 브라우저에서 바로 처리.')
  }, [])

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          무료 온라인 이미지 도구
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          서버 업로드 없이 브라우저에서 바로 처리합니다.
          <br />
          내 파일은 내 컴퓨터에서만 처리되어 안전합니다.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pb-10">
        {tools.map(t => (
          <Link
            key={t.path}
            to={t.path}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 no-underline hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="text-3xl mb-3">{t.icon}</div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {t.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </section>

      <section className="max-w-3xl mx-auto py-10 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">ImgTools란?</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          ImgTools는 무료 온라인 이미지 편집 도구입니다. 이미지 리사이즈, 포맷 변환(PNG, JPG, WebP),
          이미지 압축, 자르기, HEIC 변환, PDF 변환, 회전/뒤집기, GIF 만들기 등 다양한 기능을 제공합니다.
          모든 처리는 사용자의 브라우저에서 이루어지므로 파일이 서버로 전송되지 않아 개인정보가 안전합니다.
          회원가입이나 설치 없이 누구나 무료로 사용할 수 있습니다.
        </p>
      </section>
    </div>
  )
}
