import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ImageResize from './pages/ImageResize'
import ImageConvert from './pages/ImageConvert'
import ImageCompress from './pages/ImageCompress'
import ImageCrop from './pages/ImageCrop'
import HeicConvert from './pages/HeicConvert'
import ImageToPdf from './pages/ImageToPdf'
import ImageRotate from './pages/ImageRotate'
import GifMaker from './pages/GifMaker'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import About from './pages/About'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/resize" element={<ImageResize />} />
        <Route path="/convert" element={<ImageConvert />} />
        <Route path="/compress" element={<ImageCompress />} />
        <Route path="/crop" element={<ImageCrop />} />
        <Route path="/heic-to-jpg" element={<HeicConvert />} />
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/rotate" element={<ImageRotate />} />
        <Route path="/gif-maker" element={<GifMaker />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
