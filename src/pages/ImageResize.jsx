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

function resizeImage(img, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}

export default function ImageResize() {
  useEffect(() => {
    document.title = '이미지 리사이즈 - 무료 온라인 이미지 크기 변경 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 리사이즈 도구. 픽셀 또는 퍼센트로 이미지 크기를 자유롭게 변경하세요. 비율 유지, 일괄 처리 지원. 서버 업로드 없이 브라우저에서 안전하게 처리.')
  }, [])

  const [images, setImages] = useState([])
  const [mode, setMode] = useState('pixel')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [percent, setPercent] = useState(50)
  const [keepRatio, setKeepRatio] = useState(true)
  const [results, setResults] = useState([])
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImage(file)
        return { file, img, name: file.name, origW: img.naturalWidth, origH: img.naturalHeight }
      })
    )
    setImages(loaded)
    setResults([])
    if (loaded.length > 0 && !width) {
      setWidth(String(loaded[0].origW))
      setHeight(String(loaded[0].origH))
    }
  }, [width])

  const handleWidthChange = (v) => {
    setWidth(v)
    if (keepRatio && images.length > 0) {
      const ratio = images[0].origH / images[0].origW
      setHeight(String(Math.round(Number(v) * ratio)))
    }
  }

  const handleHeightChange = (v) => {
    setHeight(v)
    if (keepRatio && images.length > 0) {
      const ratio = images[0].origW / images[0].origH
      setWidth(String(Math.round(Number(v) * ratio)))
    }
  }

  const handleResize = async () => {
    if (images.length === 0) return
    setProcessing(true)

    const out = images.map(({ img, name, origW, origH }) => {
      let newW, newH
      if (mode === 'percent') {
        newW = Math.round(origW * percent / 100)
        newH = Math.round(origH * percent / 100)
      } else {
        newW = Number(width) || origW
        newH = Number(height) || origH
      }
      const canvas = resizeImage(img, newW, newH)
      const dataUrl = canvas.toDataURL('image/png')
      return { name, origW, origH, newW, newH, dataUrl }
    })

    setResults(out)
    setProcessing(false)
  }

  const download = (dataUrl, name) => {
    const a = document.createElement('a')
    a.href = dataUrl
    const ext = name.replace(/\.[^.]+$/, '')
    a.download = `${ext}_resized.png`
    a.click()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 리사이즈</h1>
      <p className="text-gray-500 text-sm mb-6">이미지 크기를 원하는 사이즈로 변경하세요.</p>

      {images.length === 0 ? (
        <FileDropZone onFiles={handleFiles} />
      ) : (
        <div>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {images.map((item, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-2">
                <img src={item.img.src} alt="" className="h-24 object-contain rounded" />
                <p className="text-xs text-gray-400 mt-1 text-center">{item.origW} x {item.origH}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setMode('pixel')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mode === 'pixel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                픽셀 지정
              </button>
              <button
                onClick={() => setMode('percent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mode === 'percent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                퍼센트 지정
              </button>
            </div>

            {mode === 'pixel' ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">너비 (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <span className="text-gray-400 mt-5">×</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">높이 (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={keepRatio}
                    onChange={(e) => setKeepRatio(e.target.checked)}
                    className="accent-blue-600"
                  />
                  비율 유지
                </label>
              </div>
            ) : (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">크기: {percent}%</label>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleResize}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '처리 중...' : '리사이즈 실행'}
            </button>
            <button
              onClick={() => { setImages([]); setResults([]) }}
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
                    <p className="text-sm text-gray-600 mb-2">
                      {r.origW}x{r.origH} → <span className="font-bold text-blue-600">{r.newW}x{r.newH}</span>
                    </p>
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


      <ToolGuide slug="/resize" />
    </div>
  )
}
