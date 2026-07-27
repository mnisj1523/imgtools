import { useState, useCallback, useEffect, useRef } from 'react'
import FileDropZone from '../components/FileDropZone'

function loadImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(file)
  })
}

function medianCut(pixels, depth) {
  if (depth === 0 || pixels.length <= 1) {
    let r = 0, g = 0, b = 0
    for (const p of pixels) { r += p[0]; g += p[1]; b += p[2] }
    const n = pixels.length || 1
    return [[Math.round(r / n), Math.round(g / n), Math.round(b / n)]]
  }
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0
  for (const p of pixels) {
    if (p[0] < rMin) rMin = p[0]; if (p[0] > rMax) rMax = p[0]
    if (p[1] < gMin) gMin = p[1]; if (p[1] > gMax) gMax = p[1]
    if (p[2] < bMin) bMin = p[2]; if (p[2] > bMax) bMax = p[2]
  }
  const rRange = rMax - rMin, gRange = gMax - gMin, bRange = bMax - bMin
  const ch = rRange >= gRange && rRange >= bRange ? 0 : gRange >= bRange ? 1 : 2
  pixels.sort((a, b) => a[ch] - b[ch])
  const mid = Math.floor(pixels.length / 2)
  return [...medianCut(pixels.slice(0, mid), depth - 1), ...medianCut(pixels.slice(mid), depth - 1)]
}

function quantize(imageData, maxColors = 256) {
  const { data, width, height } = imageData
  const sample = []
  const step = Math.max(1, Math.floor(data.length / 4 / 10000))
  for (let i = 0; i < data.length; i += 4 * step) {
    sample.push([data[i], data[i + 1], data[i + 2]])
  }
  const palette = medianCut(sample, Math.ceil(Math.log2(maxColors)))
  while (palette.length < maxColors) palette.push([0, 0, 0])
  const indexed = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
    let best = 0, bestDist = Infinity
    for (let j = 0; j < palette.length; j++) {
      const dr = r - palette[j][0], dg = g - palette[j][1], db = b - palette[j][2]
      const dist = dr * dr + dg * dg + db * db
      if (dist < bestDist) { bestDist = dist; best = j }
    }
    indexed[i] = best
  }
  return { palette: palette.slice(0, maxColors), indexed }
}

function lzwEncode(indexed, minCodeSize) {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1
  const table = new Map()
  for (let i = 0; i < clearCode; i++) table.set(String(i), i)

  const output = []
  let buf = 0, bitCount = 0

  const writeBits = (code, size) => {
    buf |= code << bitCount
    bitCount += size
    while (bitCount >= 8) {
      output.push(buf & 0xff)
      buf >>= 8
      bitCount -= 8
    }
  }

  writeBits(clearCode, codeSize)
  let prefix = String(indexed[0])

  for (let i = 1; i < indexed.length; i++) {
    const c = String(indexed[i])
    const key = prefix + ',' + c
    if (table.has(key)) {
      prefix = key
    } else {
      writeBits(table.get(prefix), codeSize)
      if (nextCode < 4096) {
        table.set(key, nextCode++)
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++
      } else {
        writeBits(clearCode, codeSize)
        table.clear()
        for (let j = 0; j < clearCode; j++) table.set(String(j), j)
        nextCode = eoiCode + 1
        codeSize = minCodeSize + 1
      }
      prefix = c
    }
  }
  writeBits(table.get(prefix), codeSize)
  writeBits(eoiCode, codeSize)
  if (bitCount > 0) output.push(buf & 0xff)

  return new Uint8Array(output)
}

function createGif(frames, width, height, delay) {
  const parts = []
  const w = (v) => [v & 0xff, (v >> 8) & 0xff]

  parts.push(new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))
  parts.push(new Uint8Array([...w(width), ...w(height), 0x70, 0, 0]))
  parts.push(new Uint8Array([0x21, 0xFF, 0x0B,
    ...Array.from('NETSCAPE2.0').map(c => c.charCodeAt(0)),
    3, 1, ...w(0), 0]))

  for (const frame of frames) {
    const { palette, indexed } = frame
    const delayCs = Math.round(delay / 10)
    parts.push(new Uint8Array([0x21, 0xF9, 4, 0, ...w(delayCs), 0, 0]))
    parts.push(new Uint8Array([0x2C, ...w(0), ...w(0), ...w(width), ...w(height), 0x87]))
    const palBytes = new Uint8Array(256 * 3)
    for (let i = 0; i < 256; i++) {
      palBytes[i * 3] = palette[i]?.[0] ?? 0
      palBytes[i * 3 + 1] = palette[i]?.[1] ?? 0
      palBytes[i * 3 + 2] = palette[i]?.[2] ?? 0
    }
    parts.push(palBytes)

    const minCodeSize = 8
    const lzwData = lzwEncode(indexed, minCodeSize)
    parts.push(new Uint8Array([minCodeSize]))
    for (let i = 0; i < lzwData.length; i += 255) {
      const chunk = lzwData.slice(i, i + 255)
      parts.push(new Uint8Array([chunk.length]))
      parts.push(chunk)
    }
    parts.push(new Uint8Array([0]))
  }

  parts.push(new Uint8Array([0x3B]))
  const total = parts.reduce((s, p) => s + p.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const p of parts) { result.set(p, offset); offset += p.length }
  return result
}

export default function GifMaker() {
  const [images, setImages] = useState([])
  const [delay, setDelay] = useState(500)
  const [gifSize, setGifSize] = useState(320)
  const [result, setResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)
  const timerRef = useRef(null)

  const handleFiles = useCallback(async (files) => {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImage(file)
        return { file, img, name: file.name, url: img.src }
      })
    )
    setImages(prev => [...prev, ...loaded])
    setResult(null)
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

  useEffect(() => {
    if (images.length < 2) return
    timerRef.current = setInterval(() => {
      setPreviewIdx(i => (i + 1) % images.length)
    }, delay)
    return () => clearInterval(timerRef.current)
  }, [images.length, delay])

  const handleGenerate = async () => {
    if (images.length < 2) return
    setProcessing(true)

    await new Promise(r => setTimeout(r, 50))

    const width = gifSize
    const maxH = images.reduce((max, item) => {
      const ratio = width / item.img.naturalWidth
      return Math.max(max, Math.round(item.img.naturalHeight * ratio))
    }, 0)
    const height = Math.min(maxH, gifSize)

    const frames = images.map(({ img }) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const ratio = Math.min(width / img.naturalWidth, height / img.naturalHeight)
      const dw = img.naturalWidth * ratio
      const dh = img.naturalHeight * ratio
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh)
      const imageData = ctx.getImageData(0, 0, width, height)
      return quantize(imageData, 256)
    })

    const gifBytes = createGif(frames, width, height, delay)
    const blob = new Blob([gifBytes], { type: 'image/gif' })
    const url = URL.createObjectURL(blob)

    setResult({ url, size: blob.size })
    setProcessing(false)
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'animation.gif'
    a.click()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">GIF 만들기</h1>
      <p className="text-gray-500 text-sm mb-6">여러 장의 이미지로 움직이는 GIF를 만드세요.</p>

      {images.length === 0 ? (
        <FileDropZone onFiles={handleFiles} />
      ) : (
        <div>
          {images.length >= 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex justify-center">
              <img src={images[previewIdx]?.url} alt="미리보기" className="h-48 object-contain rounded" />
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">이미지를 더 추가하려면 클릭하세요</p>
            <FileDropZone onFiles={handleFiles} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">프레임 순서 ({images.length}장)</h3>
            <div className="space-y-2">
              {images.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <span className="text-sm text-gray-400 w-6 text-center">{i + 1}</span>
                  <img src={item.url} alt="" className="h-10 w-10 object-contain rounded" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{item.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveItem(i, -1)} disabled={i === 0}
                      className="w-7 h-7 rounded bg-gray-200 text-gray-600 text-xs disabled:opacity-30 hover:bg-gray-300">▲</button>
                    <button onClick={() => moveItem(i, 1)} disabled={i === images.length - 1}
                      className="w-7 h-7 rounded bg-gray-200 text-gray-600 text-xs disabled:opacity-30 hover:bg-gray-300">▼</button>
                    <button onClick={() => removeItem(i)}
                      className="w-7 h-7 rounded bg-red-100 text-red-500 text-xs hover:bg-red-200">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div className="flex gap-6 flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm text-gray-600 mb-1 block">프레임 간격: {delay}ms</label>
                <input type="range" min={100} max={2000} step={50} value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm text-gray-600 mb-1 block">GIF 크기: {gifSize}px</label>
                <input type="range" min={100} max={800} step={20} value={gifSize}
                  onChange={(e) => setGifSize(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={handleGenerate} disabled={processing || images.length < 2}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {processing ? 'GIF 생성 중...' : `GIF 생성 (${images.length}프레임)`}
            </button>
            <button onClick={() => { setImages([]); setResult(null) }}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200">
              초기화
            </button>
          </div>

          {result && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">결과</h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-center mb-3">
                  <img src={result.url} alt="GIF" className="max-h-64 rounded-lg" />
                </div>
                <p className="text-sm text-gray-500 text-center mb-3">
                  파일 크기: {(result.size / 1024).toFixed(1)} KB
                </p>
                <button onClick={download}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  GIF 다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
