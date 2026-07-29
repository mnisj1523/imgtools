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

const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageCompress() {
  useEffect(() => {
    document.title = '이미지 압축 - 무료 온라인 이미지 용량 줄이기 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 압축 도구. 이미지 품질을 조절하여 파일 용량을 줄이세요. 압축률 실시간 확인. 서버 업로드 없이 브라우저에서 안전하게 처리.')
  }, [])

  const [images, setImages] = useState([])
  const [quality, setQuality] = useState(70)
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

  const handleCompress = async () => {
    if (images.length === 0) return
    setProcessing(true)

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
              const saved = size - blob.size
              const percent = size > 0 ? Math.round((saved / size) * 100) : 0
              resolve({
                name,
                origSize: size,
                newSize: blob.size,
                savedPercent: percent,
                url,
              })
            },
            'image/jpeg',
            quality / 100
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
    const baseName = name.replace(/\.[^.]+$/, '')
    a.download = `${baseName}_compressed.jpg`
    a.click()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 압축</h1>
      <p className="text-gray-500 text-sm mb-6">이미지 용량을 줄여보세요. 품질을 조절하며 압축률을 확인할 수 있습니다.</p>

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
            <label className="text-sm text-gray-600 mb-2 block font-medium">
              압축 품질: {quality}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>최대 압축</span>
              <span>최고 품질</span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleCompress}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '압축 중...' : '압축 실행'}
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
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">
                        {fmtSize(r.origSize)} → <span className="font-bold text-blue-600">{fmtSize(r.newSize)}</span>
                      </p>
                      <span className={`text-sm font-bold ${r.savedPercent > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {r.savedPercent > 0 ? `-${r.savedPercent}%` : `+${Math.abs(r.savedPercent)}%`}
                      </span>
                    </div>
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


      <ToolGuide slug="/compress" />
    </div>
  )
}
