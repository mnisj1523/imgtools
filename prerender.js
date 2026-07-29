// 빌드가 끝난 뒤 실행되는 "미리 그리기" 스크립트입니다.
//
// 왜 필요한가:
// 이 사이트는 React로 만들어져서, 원래는 브라우저가 자바스크립트를 실행해야
// 화면에 글자가 나타납니다. 그래서 구글 애드센스 크롤러처럼 자바스크립트를
// 실행하지 않는 프로그램이 방문하면 "내용이 텅 빈 페이지"로 보입니다.
//
// 이 스크립트는 빌드할 때 미리 각 페이지를 그려서 HTML 파일로 저장해 둡니다.
// 그러면 크롤러도 처음부터 완성된 글을 읽을 수 있습니다.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { render } from './dist-ssr/entry-server.js'
import { PAGE_SEO, SITE_URL } from './src/seo.js'

// vite build 가 만들어 둔 기본 HTML을 틀로 사용합니다.
const template = readFileSync('dist/index.html', 'utf8')

// HTML 안에서 특수문자가 태그로 잘못 읽히지 않도록 바꿔줍니다.
const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

for (const [route, seo] of Object.entries(PAGE_SEO)) {
  const appHtml = render(route)
  const pageUrl = SITE_URL + (route === '/' ? '/' : route)
  const title = escape(seo.title)
  const description = escape(seo.description)

  // 틀에서 제목·설명·주소를 이 페이지에 맞는 값으로 바꾸고,
  // 비어 있던 <div id="root"> 안에 미리 그린 화면을 채워 넣습니다.
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${pageUrl}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  // 예: '/compress' 는 dist/compress/index.html 로 저장됩니다.
  const outPath = route === '/' ? 'dist/index.html' : `dist${route}/index.html`
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  console.log(`미리 그리기 완료: ${route} → ${outPath}`)
}

console.log(`총 ${Object.keys(PAGE_SEO).length}개 페이지를 HTML로 저장했습니다.`)
