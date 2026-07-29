import { useState, useCallback, useEffect } from 'react'
import FileDropZone from '../components/FileDropZone'
import ToolGuide from '../components/ToolGuide'

function loadImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(file)
  })
}

function transformImage(img, rotation, flipH, flipV) {
  const rad = (rotation * Math.PI) / 180
  const swap = rotation === 90 || rotation === 270
  const w = swap ? img.naturalHeight : img.naturalWidth
  const h = swap ? img.naturalWidth : img.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.translate(w / 2, h / 2)
  ctx.rotate(rad)
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

  return { canvas, w, h }
}

export default function ImageRotate() {
  useEffect(() => {
    document.title = '이미지 회전/뒤집기 - 무료 온라인 이미지 회전 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 회전·뒤집기 도구. 90도, 180도 회전 및 좌우/상하 반전. 실시간 미리보기 지원. 서버 업로드 없이 브라우저에서 안전하게 처리.')
  }, [])

  const [images, setImages] = useState([])
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [results, setResults] = useState([])
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImage(file)
        return { file, img, name: file.name, w: img.naturalWidth, h: img.naturalHeight }
      })
    )
    setImages(loaded)
    setResults([])
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
  }, [])

  const handleApply = () => {
    if (images.length === 0) return
    setProcessing(true)

    const out = images.map(({ img, name }) => {
      const { canvas, w, h } = transformImage(img, rotation, flipH, flipV)
      const dataUrl = canvas.toDataURL('image/png')
      const baseName = name.replace(/\.[^.]+$/, '')
      return { name: `${baseName}_edited.png`, dataUrl, w, h }
    })

    setResults(out)
    setProcessing(false)
  }

  const download = (dataUrl, name) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = name
    a.click()
  }

  const buttons = [
    { label: '↻ 시계 90°', action: () => setRotation((r) => (r + 90) % 360) },
    { label: '↺ 반시계 90°', action: () => setRotation((r) => (r + 270) % 360) },
    { label: '180°', action: () => setRotation((r) => (r + 180) % 360) },
    { label: '↔ 좌우 뒤집기', action: () => setFlipH((f) => !f) },
    { label: '↕ 상하 뒤집기', action: () => setFlipV((f) => !f) },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 회전/뒤집기</h1>
      <p className="text-gray-500 text-sm mb-6">이미지를 회전하거나 뒤집으세요.</p>

      {images.length === 0 ? (
        <FileDropZone onFiles={handleFiles} />
      ) : (
        <div>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {images.map((item, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-2">
                <img
                  src={item.img.src}
                  alt=""
                  className="h-32 object-contain rounded"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    transition: 'transform 0.3s',
                  }}
                />
                <p className="text-xs text-gray-400 mt-1 text-center">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <p className="text-sm text-gray-600 mb-3">
              회전: {rotation}° {flipH ? '| 좌우 뒤집힘' : ''} {flipV ? '| 상하 뒤집힘' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {buttons.map((b, i) => (
                <button
                  key={i}
                  onClick={b.action}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleApply}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '처리 중...' : '적용하기'}
            </button>
            <button
              onClick={() => { setImages([]); setResults([]); setRotation(0); setFlipH(false); setFlipV(false) }}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200"
            >
              초기화
            </button>
          </div>

          {results.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">결과</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                    <img src={r.dataUrl} alt="" className="w-full h-40 object-contain rounded-lg bg-gray-50 mb-3" />
                    <p className="text-sm text-gray-600 mb-2">{r.w}x{r.h}</p>
                    <button
                      onClick={() => download(r.dataUrl, r.name)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}


      <ToolGuide slug="/rotate" />
    </div>
  )
}
