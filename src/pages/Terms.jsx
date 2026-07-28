import { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = '이용약관 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'ImgTools 이용약관. 무료 온라인 이미지 편집 서비스의 이용 조건 및 면책 조항을 안내합니다.')
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">이용약관</h1>
      <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 7월 28일</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
          <p>
            본 약관은 ImgTools(이하 "서비스")가 제공하는 온라인 이미지 편집 도구의 이용과 관련하여
            서비스와 이용자 간의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (서비스 내용)</h2>
          <p>서비스는 다음과 같은 무료 온라인 이미지 편집 도구를 제공합니다.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>이미지 리사이즈 (크기 변경)</li>
            <li>이미지 포맷 변환 (PNG, JPG, WebP)</li>
            <li>이미지 압축 (용량 줄이기)</li>
            <li>이미지 자르기 (크롭)</li>
            <li>HEIC → JPG 변환</li>
            <li>이미지 → PDF 변환</li>
            <li>이미지 회전 및 뒤집기</li>
            <li>GIF 만들기</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (파일 처리)</h2>
          <p>
            서비스에서 처리하는 모든 파일은 이용자의 웹 브라우저 내에서만 처리됩니다.
            이용자의 파일은 서버로 전송되거나 외부에 저장되지 않으며,
            브라우저 페이지를 떠나면 자동으로 메모리에서 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (이용 조건)</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>서비스는 무료로 제공되며, 별도의 회원가입 없이 이용할 수 있습니다.</li>
            <li>이용자는 서비스를 법령 및 본 약관에 위반하지 않는 범위에서 자유롭게 이용할 수 있습니다.</li>
            <li>타인의 저작권을 침해하는 용도로 서비스를 이용해서는 안 됩니다.</li>
            <li>서비스를 이용한 자동화된 대량 처리, 크롤링, 스크래핑 등은 금지합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (면책 조항)</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>서비스는 "있는 그대로(AS IS)" 제공되며, 결과물의 품질이나 정확성에 대해 보증하지 않습니다.</li>
            <li>이용자는 서비스 이용 결과에 대한 책임을 스스로 부담합니다.</li>
            <li>서비스 이용 중 발생하는 데이터 손실에 대해 서비스는 책임을 지지 않습니다. 원본 파일은 반드시 별도로 보관하시기 바랍니다.</li>
            <li>천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (서비스 변경 및 중단)</h2>
          <p>
            서비스는 운영상 필요한 경우 사전 공지 없이 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.
            무료로 제공되는 서비스의 변경 또는 중단에 대해 이용자에게 별도의 보상을 하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (광고)</h2>
          <p>
            서비스는 운영을 위해 서비스 내에 광고를 게재할 수 있습니다.
            광고주가 제공하는 콘텐츠 및 서비스에 대한 책임은 해당 광고주에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (약관 변경)</h2>
          <p>
            본 약관은 필요에 따라 변경될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
            변경된 약관은 공지한 시점부터 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (문의)</h2>
          <p>
            서비스 이용 관련 문의사항은 아래 이메일로 연락 부탁드립니다.
          </p>
          <p className="mt-2 font-medium">이메일: contact@ngym.co.kr</p>
        </section>
      </div>
    </div>
  )
}
