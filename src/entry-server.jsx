import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

// 빌드할 때만 쓰이는 "서버용 그리기" 함수입니다.
// 브라우저 없이 주소(url)만 받아서 그 페이지의 HTML 문자열을 만들어 줍니다.
// prerender.js 가 이 함수를 12개 주소에 대해 한 번씩 불러서
// 완성된 HTML을 dist 폴더에 미리 저장해 둡니다.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}
