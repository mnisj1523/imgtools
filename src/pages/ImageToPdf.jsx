import { useState, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import FileDropZone from '../components/FileDropZone'

function loadImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageToPdf() {
  const [images, setImages] = useState([])
  const [pageSize, setPageSize] = useState('a4')
  const [margin, setMargin] = useState(10)
  const [processing, setProcessing] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImage(file)
        return {
          file,
          img,
          name: file.name,
          url: img.src,
          w: img.naturalWidth,
          h: img.naturalHeight,
        }
      })
    )
    setImages(prev => [...prev, ...loaded])
  }, [])

  const moveItem = (idx, dir) => {
    const arr = [...images]
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    setImages(arr)
  }

  const removeItem = (idx) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleGenerate = async () => {
    if (images.length === 0) return
    setProcessing(true)

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()

    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage()

      const { img } = images[i]
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

      const availW = pageW - margin * 2
      const availH = pageH - margin * 2
      const ratio = Math.min(availW / img.naturalWidth, availH / img.naturalHeight)
      const drawW = img.naturalWidth * ratio
      const drawH = img.naturalHeight * ratio
      const x = margin + (availW - drawW) / 2
      const y = margin + (availH - drawH) / 2

      pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH)
    }

    pdf.save('images.pdf')
    setProcessing(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 → PDF 변환</h1>
      <p className="text-gray-500 text-sm mb-6">여러 장의 이미지를 하나의 PDF 파일로 만드세요.</p>

      {images.length === 0 ? (
        <FileDropZone onFiles={handleFiles} />
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">이미지를 더 추가하려면 클릭하세요</p>
            <FileDropZone onFiles={handleFiles} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">페이지 순서</h3>
            <div className="space-y-2">
              {images.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <span className="text-sm text-gray-400 w-6 text-center">{i + 1}</span>
                  <img src={item.url} alt="" className="h-12 w-12 object-contain rounded" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{item.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveItem(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded bg-gray-200 text-gray-600 text-xs disabled:opacity-30 hover:bg-gray-300"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(i, 1)}
                      disabled={i === images.length - 1}
                      className="w-7 h-7 rounded bg-gray-200 text-gray-600 text-xs disabled:opacity-30 hover:bg-gray-300"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removeItem(i)}
                      className="w-7 h-7 rounded bg-red-100 text-red-500 text-xs hover:bg-red-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="flex gap-6 flex-wrap">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">용지 크기</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="a3">A3</option>
                  <option value="a5">A5</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">여백 (mm): {margin}</label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-40 accent-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleGenerate}
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? '생성 중...' : `PDF 생성 (${images.length}장)`}
            </button>
            <button
              onClick={() => setImages([])}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200"
            >
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
