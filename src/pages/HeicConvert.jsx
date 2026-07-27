import { useState, useCallback } from 'react'
import FileDropZone from '../components/FileDropZone'

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다. 브라우저가 HEIC를 지원하지 않을 수 있습니다.'))
    img.src = URL.createObjectURL(file)
  })
}

export default function HeicConvert() {
  const [images, setImages] = useState([])
  const [quality, setQuality] = useState(0.92)
  const [results, setResults] = useState([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = useCallback(async (files) => {
    setError('')
    setResults([])
    const loaded = []
    for (const file of files) {
      try {
        const img = await loadImage(file)
        loaded.push({ file, img, name: file.name, w: img.naturalWidth, h: img.naturalHeight })
      } catch (e) {
        setError(e.message)
      }
    }
    setImages(loaded)
  }, [])

  const handleConvert = async () => {
    if (images.length === 0) return
    setProcessing(true)
    const out = []

    for (const { img, name, w, h } of images) {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      const baseName = name.replace(/\.(heic|heif)$/i, '')
      out.push({ name: `${baseName}.jpg`, dataUrl, w, h })
    }

    setResults(out)
    setProcessing(false)
  }

  const download = (dataUrl, name) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = name
    a.click()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">HEIC → JPG 변환</h1>
      <p className="text-gray-500 text-sm mb-6">아이폰 사진(HEIC)을 JPG로 변환하세요. 브라우저에서 바로 처리됩니다.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
          <p className="mt-1 text-red-500">Safari 또는 최신 Chrome에서 시도해보세요.</p>
        </div>
      )}

      {images.length === 0 ? (
        <FileDropZone accept=".heic,.heif,image/*" onFiles={handleFiles} />
      ) : (
        <div>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {images.map((item, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-2">
                <img src={item.img.src} alt="" className="h-24 object-contain rounded" />
                <p className="text-xs text-gray-400 mt-1 text-center">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <label className="text-sm text-gray-600 mb-2 block">JPG 품질: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              min={10}
              max={100}
              value={Math.round(quality * 100)}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleConvert}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '변환 중...' : '변환하기'}
            </button>
            <button
              onClick={() => { setImages([]); setResults([]); setError('') }}
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
                    <p className="text-sm text-gray-600 mb-2">{r.name} ({r.w}x{r.h})</p>
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
    </div>
  )
}
