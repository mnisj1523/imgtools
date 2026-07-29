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

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

export default function ImageConvert() {
  useEffect(() => {
    document.title = '이미지 포맷 변환 - PNG, JPG, WebP 무료 변환 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 포맷 변환 도구. PNG, JPG, WebP 형식으로 이미지를 변환하세요. 품질 조절 가능. 서버 업로드 없이 브라우저에서 안전하게 처리.')
  }, [])

  const [images, setImages] = useState([])
  const [format, setFormat] = useState('image/png')
  const [quality, setQuality] = useState(0.9)
  const [results, setResults] = useState([])
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImage(file)
        return { file, img, name: file.name, size: file.size }
      })
    )
    setImages(loaded)
    setResults([])
  }, [])

  const handleConvert = async () => {
    if (images.length === 0) return
    setProcessing(true)

    const fmt = FORMATS.find(f => f.value === format)
    const out = await Promise.all(
      images.map(({ img, name, size }) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(
            (blob) => {
              const url = URL.createObjectURL(blob)
              const baseName = name.replace(/\.[^.]+$/, '')
              resolve({
                name: `${baseName}.${fmt.ext}`,
                origSize: size,
                newSize: blob.size,
                url,
                format: fmt.label,
              })
            },
            format,
            format === 'image/png' ? undefined : quality
          )
        })
      })
    )

    setResults(out)
    setProcessing(false)
  }

  const download = (url, name) => {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const showQuality = format !== 'image/png'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 포맷 변환</h1>
      <p className="text-gray-500 text-sm mb-6">PNG, JPG, WebP 등 원하는 포맷으로 변환하세요.</p>

      {images.length === 0 ? (
        <FileDropZone onFiles={handleFiles} />
      ) : (
        <div>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {images.map((item, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-2">
                <img src={item.img.src} alt="" className="h-24 object-contain rounded" />
                <p className="text-xs text-gray-400 mt-1 text-center">{fmtSize(item.size)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <label className="text-sm text-gray-600 mb-2 block font-medium">변환 포맷</label>
            <div className="flex gap-3 mb-4">
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium ${
                    format === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {showQuality && (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  품질: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full accent-blue-600"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleConvert}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '변환 중...' : '변환 실행'}
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
                    <img src={r.url} alt="" className="w-full h-40 object-contain rounded-lg bg-gray-50 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      {r.name} · <span className="font-bold text-blue-600">{r.format}</span>
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {fmtSize(r.origSize)} → {fmtSize(r.newSize)}
                    </p>
                    <button
                      onClick={() => download(r.url, r.name)}
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


      <ToolGuide slug="/convert" />
    </div>
  )
}
