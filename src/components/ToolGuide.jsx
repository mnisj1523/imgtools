import { GUIDES } from '../content/guides'

// 도구 페이지 맨 아래에 공통으로 붙는 "설명 영역" 컴포넌트입니다.
// 도구 소개 → 사용 방법 → 자세한 설명 → 자주 묻는 질문 순서로 보여줍니다.
// 실제 글 내용은 src/content/guides.js 파일에 도구별로 따로 적어두었고,
// 여기서는 그 글을 화면에 예쁘게 배치하는 역할만 합니다.
export default function ToolGuide({ slug }) {
  const guide = GUIDES[slug]
  // 아직 글이 준비되지 않은 도구면 아무것도 그리지 않습니다.
  if (!guide) return null

  return (
    <article className="mt-12 border-t border-gray-200 pt-10 max-w-3xl">
      {/* 도구 소개 문단 */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">{guide.heading}</h2>
      <div className="space-y-3 text-gray-700 text-sm leading-7">
        {guide.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {/* 사용 방법: 번호가 매겨진 단계별 안내 */}
      <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">사용 방법</h2>
      <ol className="space-y-3">
        {guide.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-gray-900 text-sm">{s.t}</p>
              <p className="text-gray-600 text-sm leading-6 mt-0.5">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 자세한 설명: 도구마다 개수가 다르며, 표가 있는 섹션도 있습니다 */}
      {guide.sections.map((sec, i) => (
        <section key={i} className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{sec.h}</h2>
          <div className="space-y-3 text-gray-700 text-sm leading-7">
            {sec.body.map((p, j) => <p key={j}>{p}</p>)}
          </div>

          {/* 표가 있는 경우에만 그립니다. 좁은 화면에서는 가로로 스크롤됩니다 */}
          {sec.table && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {sec.table.head.map((th, j) => (
                      <th key={j} className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-800 whitespace-nowrap">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sec.table.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((td, k) => (
                        <td key={k} className="border border-gray-200 px-3 py-2 text-gray-700 align-top">
                          {td}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      {/* 자주 묻는 질문 */}
      <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">자주 묻는 질문</h2>
      <div className="space-y-4">
        {guide.faqs.map((f, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-900 text-sm mb-1.5">Q. {f.q}</p>
            <p className="text-gray-600 text-sm leading-7">{f.a}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
