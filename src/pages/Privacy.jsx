import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = '개인정보처리방침 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'ImgTools 개인정보처리방침. 파일은 서버에 업로드되지 않으며, 모든 처리는 브라우저에서 이루어집니다.')
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>
      <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 7월 28일</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 개인정보 수집 항목</h2>
          <p>
            ImgTools는 별도의 회원가입 절차가 없으며, 사용자의 개인정보를 직접 수집하지 않습니다.
            사용자가 업로드하는 이미지 파일은 서버로 전송되지 않으며, 모든 처리는 사용자의 브라우저(기기) 내에서 이루어집니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 파일 처리 방식</h2>
          <p>
            ImgTools에서 제공하는 모든 이미지 편집 도구(리사이즈, 포맷 변환, 압축, 자르기, HEIC 변환, PDF 변환, 회전, GIF 만들기)는
            사용자의 웹 브라우저에서 JavaScript를 통해 처리됩니다. 사용자의 파일은 외부 서버로 전송되거나 저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 쿠키 및 자동 수집 정보</h2>
          <p>ImgTools는 서비스 제공 및 개선을 위해 다음과 같은 자동 수집 기술을 사용할 수 있습니다.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>Google 애드센스:</strong> 맞춤형 광고 제공을 위해 쿠키를 사용할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤 광고를 비활성화할 수 있습니다.</li>
            <li><strong>Google 애널리틱스:</strong> 사이트 이용 통계 분석을 위해 쿠키를 사용할 수 있습니다. 수집되는 정보에는 방문 페이지, 체류 시간, 브라우저 유형 등이 포함됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
          <p>
            ImgTools는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 위에 명시된 Google 서비스(애드센스, 애널리틱스)를 통해 자동으로 수집되는 비식별 정보는 해당 서비스의 개인정보처리방침에 따라 처리됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. 개인정보의 보유 및 파기</h2>
          <p>
            ImgTools는 사용자의 개인정보를 별도로 보유하지 않습니다.
            사용자가 브라우저에서 처리한 파일은 브라우저 메모리에서만 존재하며, 페이지를 떠나면 자동으로 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. 이용자의 권리</h2>
          <p>
            사용자는 브라우저 설정을 통해 쿠키 사용을 거부하거나 삭제할 수 있습니다.
            다만, 쿠키를 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. 방침 변경</h2>
          <p>
            본 개인정보처리방침은 법령, 정책 또는 서비스 변경에 따라 수정될 수 있으며,
            변경 시 본 페이지를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. 문의</h2>
          <p>
            개인정보 관련 문의사항은 아래 이메일로 연락 부탁드립니다.
          </p>
          <p className="mt-2 font-medium">이메일: contact@ngym.co.kr</p>
        </section>
      </div>
    </div>
  )
}
