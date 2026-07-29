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

      {/* 서비스 소개와 사용법 안내. 검색으로 처음 들어온 분들이
          이 사이트가 무엇인지 파악할 수 있도록 자세히 적어둡니다. */}
      <section className="max-w-3xl mx-auto py-10 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ImgTools란?</h2>
        <div className="space-y-3 text-gray-700 text-sm leading-7">
          <p>
            ImgTools는 설치도 회원가입도 필요 없는 무료 온라인 이미지 편집 도구 모음입니다.
            이미지 크기 변경, 포맷 변환(PNG·JPG·WebP), 용량 압축, 원하는 부분만 잘라내기,
            아이폰 사진(HEIC) 변환, 여러 장을 PDF로 묶기, 회전과 뒤집기, GIF 애니메이션 만들기까지
            여덟 가지 기능을 한곳에서 사용할 수 있습니다.
          </p>
          <p>
            사진 한 장 줄이자고 무거운 편집 프로그램을 설치하거나, 어떤 사이트에 올려야 할지
            고민한 적이 있다면 여기서 바로 해결하실 수 있습니다. 웹 브라우저만 있으면
            윈도우, 맥, 아이폰, 안드로이드 어디서든 똑같이 동작합니다.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto py-10 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">파일이 서버로 올라가지 않습니다</h2>
        <div className="space-y-3 text-gray-700 text-sm leading-7">
          <p>
            보통의 온라인 변환 사이트는 여러분의 파일을 자기네 서버로 전송해서 처리한 다음
            결과를 돌려줍니다. 편리하지만 내 사진이 남의 컴퓨터를 한 번 거쳐 간다는 뜻이기도 합니다.
            신분증 사진이나 계약서, 가족사진처럼 민감한 파일이라면 마음이 놓이지 않습니다.
          </p>
          <p>
            ImgTools는 다릅니다. 모든 변환 작업이 지금 이 페이지를 열어둔 브라우저 안에서
            이루어집니다. 파일을 선택해도 인터넷으로 전송되지 않고, 여러분의 기기 안에서
            처리된 뒤 바로 저장됩니다. 페이지를 닫으면 아무것도 남지 않습니다.
          </p>
          <p>
            덕분에 인터넷 속도와 상관없이 빠르고, 업로드 대기 시간도 없으며,
            무엇보다 파일이 밖으로 나가지 않습니다.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto py-10 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">이럴 때 이렇게 쓰세요</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-1">메일 첨부 용량 제한에 걸렸을 때</p>
            <p className="text-gray-600 leading-7">
              먼저 리사이즈로 가로 크기를 1200픽셀 정도로 줄이고, 그다음 압축을 적용하세요.
              품질을 크게 깎지 않고도 용량이 크게 줄어듭니다.
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">아이폰 사진이 컴퓨터에서 안 열릴 때</p>
            <p className="text-gray-600 leading-7">
              HEIC → JPG 변환 도구를 사용하세요. 아이폰이 기본으로 쓰는 HEIC 형식을
              어디서나 열리는 JPG로 바꿔줍니다.
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">서류 여러 장을 한 파일로 제출해야 할 때</p>
            <p className="text-gray-600 leading-7">
              휴대폰으로 찍은 서류 사진들을 이미지 → PDF 도구에 올리면 한 개의 PDF 문서가 됩니다.
              용지 크기와 여백도 정할 수 있습니다.
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">프로필 사진을 정사각형으로 맞춰야 할 때</p>
            <p className="text-gray-600 leading-7">
              자르기 도구로 정사각형 영역을 잡은 뒤, 리사이즈로 400×400 정도로 맞추면 됩니다.
              처음부터 리사이즈로 눌러 맞추면 얼굴이 찌그러지니 자르기를 먼저 하세요.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto py-10 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: '정말 무료인가요?',
              a: '네, 모든 도구를 횟수 제한 없이 무료로 사용할 수 있습니다. 회원가입이나 로그인도 필요 없습니다.',
            },
            {
              q: '올린 사진은 어디에 저장되나요?',
              a: '어디에도 저장되지 않습니다. 파일은 서버로 전송되지 않고 브라우저 안에서만 처리되며, 페이지를 닫으면 사라집니다.',
            },
            {
              q: '한 번에 여러 장을 처리할 수 있나요?',
              a: '리사이즈, 포맷 변환, 압축, 회전은 한 번에 여러 장을 처리할 수 있습니다. 자르기는 사진마다 자를 위치가 달라서 한 장씩 작업합니다.',
            },
            {
              q: '휴대폰에서도 쓸 수 있나요?',
              a: '가능합니다. 화면 크기에 맞춰 배치가 바뀌고, 자르기 도구는 손가락 터치 조작도 지원합니다.',
            },
            {
              q: '프로그램을 설치해야 하나요?',
              a: '필요 없습니다. 웹 브라우저에서 주소를 열기만 하면 바로 사용할 수 있습니다.',
            },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-gray-900 text-sm mb-1.5">Q. {f.q}</p>
              <p className="text-gray-600 text-sm leading-7">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
