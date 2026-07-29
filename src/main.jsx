import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// 배포된 사이트에는 prerender.js 가 미리 그려둔 화면이 이미 HTML에 들어 있습니다.
// 이럴 때는 화면을 다시 그리지 않고 버튼 클릭 같은 동작만 연결합니다(hydrateRoot).
// 반면 개발 서버(npm run dev)에서는 화면이 비어 있으므로 처음부터 그립니다(createRoot).
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
