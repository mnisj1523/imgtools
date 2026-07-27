import { useState, useRef, useCallback } from 'react'

export default function FileDropZone({ accept = 'image/*', multiple = true, onFiles, maxFiles = 20 }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback((fileList) => {
    const files = Array.from(fileList).slice(0, maxFiles)
    if (files.length === 0) return
    onFiles(files)
  }, [onFiles, maxFiles])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
        dragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
      />
      <div className="text-4xl mb-3">📁</div>
      <p className="text-gray-700 font-medium">
        이미지를 드래그하거나 클릭해서 선택하세요
      </p>
      <p className="text-gray-400 text-sm mt-1">
        {multiple ? `최대 ${maxFiles}장` : '1장'} · PNG, JPG, WebP, GIF 지원
      </p>
    </div>
  )
}
