import { useState, useRef, useCallback, useEffect } from 'react'
import FileDropZone from '../components/FileDropZone'
import ToolGuide from '../components/ToolGuide'

function loadImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageCrop() {
  useEffect(() => {
    document.title = '이미지 자르기 - 무료 온라인 이미지 크롭 | ImgTools'
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      '무료 온라인 이미지 자르기 도구. 드래그로 원하는 영역을 선택하여 이미지를 잘라보세요. 코너 핸들로 정밀 조절 가능. 서버 업로드 없이 안전하게 처리.')
  }, [])

  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 150 })
  const [dragging, setDragging] = useState(null)
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 })
  const [scale, setScale] = useState(1)

  const handleFiles = useCallback(async (files) => {
    const img = await loadImage(files[0])
    setImage({ img, name: files[0].name })
    setResult(null)
  }, [])

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const container = containerRef.current
    const maxW = container.clientWidth
    const maxH = 400
    const imgW = image.img.naturalWidth
    const imgH = image.img.naturalHeight
    const s = Math.min(maxW / imgW, maxH / imgH, 1)
    setScale(s)

    canvas.width = imgW * s
    canvas.height = imgH * s

    const cw = Math.min(200, imgW * s * 0.6)
    const ch = Math.min(150, imgH * s * 0.6)
    setCrop({
      x: (imgW * s - cw) / 2,
      y: (imgH * s - ch) / 2,
      w: cw,
      h: ch,
    })
  }, [image])

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(image.img, 0, 0, w, h)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
    ctx.fillRect(0, 0, w, h)

    ctx.clearRect(crop.x, crop.y, crop.w, crop.h)
    ctx.drawImage(
      image.img,
      crop.x / scale, crop.y / scale, crop.w / scale, crop.h / scale,
      crop.x, crop.y, crop.w, crop.h
    )

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h)

    const hs = 8
    ctx.fillStyle = '#3b82f6'
    const corners = [
      [crop.x, crop.y],
      [crop.x + crop.w, crop.y],
      [crop.x, crop.y + crop.h],
      [crop.x + crop.w, crop.y + crop.h],
    ]
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs)
    })
  }, [crop, image, scale])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return { mx: touch.clientX - rect.left, my: touch.clientY - rect.top }
  }

  const getHandle = (mx, my) => {
    const t = 12
    const { x, y, w, h } = crop
    if (Math.abs(mx - x) < t && Math.abs(my - y) < t) return 'tl'
    if (Math.abs(mx - (x + w)) < t && Math.abs(my - y) < t) return 'tr'
    if (Math.abs(mx - x) < t && Math.abs(my - (y + h)) < t) return 'bl'
    if (Math.abs(mx - (x + w)) < t && Math.abs(my - (y + h)) < t) return 'br'
    if (mx > x && mx < x + w && my > y && my < y + h) return 'move'
    return null
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    const { mx, my } = getPos(e)
    const handle = getHandle(mx, my)
    if (!handle) return
    setDragging(handle)
    setDragStart({ mx, my, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h })
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    e.preventDefault()
    const { mx, my } = getPos(e)
    const dx = mx - dragStart.mx
    const dy = my - dragStart.my
    const canvas = canvasRef.current
    const cMaxW = canvas.width
    const cMaxH = canvas.height

    let { cx, cy, cw, ch } = dragStart
    const minSize = 20

    if (dragging === 'move') {
      let nx = cx + dx
      let ny = cy + dy
      nx = Math.max(0, Math.min(nx, cMaxW - cw))
      ny = Math.max(0, Math.min(ny, cMaxH - ch))
      setCrop({ x: nx, y: ny, w: cw, h: ch })
    } else if (dragging === 'br') {
      let nw = Math.max(minSize, cw + dx)
      let nh = Math.max(minSize, ch + dy)
      nw = Math.min(nw, cMaxW - cx)
      nh = Math.min(nh, cMaxH - cy)
      setCrop({ x: cx, y: cy, w: nw, h: nh })
    } else if (dragging === 'tl') {
      let nx = cx + dx
      let ny = cy + dy
      let nw = cw - dx
      let nh = ch - dy
      if (nw < minSize) { nx = cx + cw - minSize; nw = minSize }
      if (nh < minSize) { ny = cy + ch - minSize; nh = minSize }
      if (nx < 0) { nw += nx; nx = 0 }
      if (ny < 0) { nh += ny; ny = 0 }
      setCrop({ x: nx, y: ny, w: nw, h: nh })
    } else if (dragging === 'tr') {
      let ny = cy + dy
      let nw = Math.max(minSize, cw + dx)
      let nh = ch - dy
      if (nh < minSize) { ny = cy + ch - minSize; nh = minSize }
      if (ny < 0) { nh += ny; ny = 0 }
      nw = Math.min(nw, cMaxW - cx)
      setCrop({ x: cx, y: ny, w: nw, h: nh })
    } else if (dragging === 'bl') {
      let nx = cx + dx
      let nw = cw - dx
      let nh = Math.max(minSize, ch + dy)
      if (nw < minSize) { nx = cx + cw - minSize; nw = minSize }
      if (nx < 0) { nw += nx; nx = 0 }
      nh = Math.min(nh, cMaxH - cy)
      setCrop({ x: nx, y: cy, w: nw, h: nh })
    }
  }

  const handlePointerUp = () => setDragging(null)

  const handleCrop = () => {
    if (!image) return
    const outCanvas = document.createElement('canvas')
    const realX = crop.x / scale
    const realY = crop.y / scale
    const realW = crop.w / scale
    const realH = crop.h / scale
    outCanvas.width = realW
    outCanvas.height = realH
    const ctx = outCanvas.getContext('2d')
    ctx.drawImage(image.img, realX, realY, realW, realH, 0, 0, realW, realH)
    const dataUrl = outCanvas.toDataURL('image/png')
    setResult({ dataUrl, w: Math.round(realW), h: Math.round(realH) })
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.dataUrl
    const baseName = image.name.replace(/\.[^.]+$/, '')
    a.download = `${baseName}_cropped.png`
    a.click()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">이미지 자르기</h1>
      <p className="text-gray-500 text-sm mb-6">원하는 영역을 선택해서 이미지를 잘라보세요.</p>

      {!image ? (
        <FileDropZone onFiles={handleFiles} multiple={false} />
      ) : (
        <div>
          <div
            ref={containerRef}
            className="bg-gray-100 rounded-xl p-4 mb-4 flex justify-center overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'crosshair' }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            선택 영역: {Math.round(crop.w / scale)} x {Math.round(crop.h / scale)} px
          </p>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={handleCrop}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              자르기 실행
            </button>
            <button
              onClick={() => { setImage(null); setResult(null) }}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200"
            >
              초기화
            </button>
          </div>

          {result && (
            <div className="max-w-md mx-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-3">결과</h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <img src={result.dataUrl} alt="" className="w-full h-60 object-contain rounded-lg bg-gray-50 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  크기: <span className="font-bold text-blue-600">{result.w} x {result.h}</span> px
                </p>
                <button
                  onClick={download}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      <ToolGuide slug="/crop" />
    </div>
  )
}
