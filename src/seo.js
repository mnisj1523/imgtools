// 페이지(주소)별 검색엔진용 제목과 설명입니다.
// 빌드할 때 prerender.js 가 이 값을 읽어서 각 페이지 HTML의 <title>, <meta> 에 직접 박아 넣습니다.
// 이렇게 해야 구글 크롤러가 자바스크립트를 실행하지 않고도 페이지 내용을 알 수 있습니다.
export const SITE_URL = 'https://imgtools-wheat.vercel.app'

export const PAGE_SEO = {
  '/': {
    title: 'ImgTools - 무료 온라인 이미지 편집 도구 | 리사이즈, 변환, 압축',
    description: '무료 온라인 이미지 편집 도구. 이미지 리사이즈, 포맷 변환(PNG, JPG, WebP), 압축, 자르기, HEIC 변환, PDF 변환, 회전, GIF 만들기. 서버 업로드 없이 브라우저에서 바로 처리.',
  },
  '/resize': {
    title: '이미지 리사이즈 - 무료 온라인 이미지 크기 변경 | ImgTools',
    description: '무료 온라인 이미지 리사이즈 도구. 픽셀 또는 퍼센트로 이미지 크기를 자유롭게 변경하세요. 비율 유지, 일괄 처리 지원. 서버 업로드 없이 브라우저에서 안전하게 처리.',
  },
  '/convert': {
    title: '이미지 포맷 변환 - PNG, JPG, WebP 무료 변환 | ImgTools',
    description: '무료 온라인 이미지 포맷 변환 도구. PNG, JPG, WebP 형식으로 이미지를 변환하세요. 품질 조절 가능. 서버 업로드 없이 브라우저에서 안전하게 처리.',
  },
  '/compress': {
    title: '이미지 압축 - 무료 온라인 이미지 용량 줄이기 | ImgTools',
    description: '무료 온라인 이미지 압축 도구. 이미지 품질을 조절하여 파일 용량을 줄이세요. 압축률 실시간 확인. 서버 업로드 없이 브라우저에서 안전하게 처리.',
  },
  '/crop': {
    title: '이미지 자르기 - 무료 온라인 이미지 크롭 | ImgTools',
    description: '무료 온라인 이미지 자르기 도구. 드래그로 원하는 영역을 선택하여 이미지를 잘라보세요. 코너 핸들로 정밀 조절 가능. 서버 업로드 없이 안전하게 처리.',
  },
  '/heic-to-jpg': {
    title: 'HEIC to JPG 변환 - 아이폰 사진 무료 변환 | ImgTools',
    description: '무료 온라인 HEIC to JPG 변환 도구. 아이폰 사진(HEIC/HEIF)을 JPG로 변환하세요. 품질 조절 가능. 서버 업로드 없이 브라우저에서 안전하게 처리.',
  },
  '/image-to-pdf': {
    title: '이미지 PDF 변환 - 여러 이미지를 PDF로 합치기 | ImgTools',
    description: '무료 온라인 이미지 to PDF 변환 도구. 여러 장의 이미지를 하나의 PDF로 합치세요. 순서 변경, 용지 크기, 여백 설정 지원. 서버 업로드 없이 안전하게 처리.',
  },
  '/rotate': {
    title: '이미지 회전/뒤집기 - 무료 온라인 이미지 회전 | ImgTools',
    description: '무료 온라인 이미지 회전·뒤집기 도구. 90도, 180도 회전 및 좌우/상하 반전. 실시간 미리보기 지원. 서버 업로드 없이 브라우저에서 안전하게 처리.',
  },
  '/gif-maker': {
    title: 'GIF 만들기 - 여러 이미지로 움직이는 GIF 생성 | ImgTools',
    description: '무료 온라인 GIF 메이커. 여러 장의 이미지로 움직이는 GIF 애니메이션을 만드세요. 프레임 순서, 속도, 크기 조절 가능. 서버 업로드 없이 브라우저에서 처리.',
  },
  '/about': {
    title: '소개 | ImgTools - 무료 온라인 이미지 편집 도구',
    description: 'ImgTools 소개. 무료 온라인 이미지 편집 도구 모음. 서버 업로드 없이 브라우저에서 안전하게 처리합니다.',
  },
  '/privacy': {
    title: '개인정보처리방침 | ImgTools',
    description: 'ImgTools 개인정보처리방침. 파일은 서버에 업로드되지 않으며, 모든 처리는 브라우저에서 이루어집니다.',
  },
  '/terms': {
    title: '이용약관 | ImgTools',
    description: 'ImgTools 이용약관. 무료 온라인 이미지 편집 서비스의 이용 조건 및 면책 조항을 안내합니다.',
  },
}
