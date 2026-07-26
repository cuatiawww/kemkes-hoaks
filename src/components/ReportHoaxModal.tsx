'use client'

import { useState, useRef } from 'react'
import {
  X,
  UploadCloud,
  Send,
  CheckCircle2,
  ShieldCheck,
  Globe,
  User,
  Phone,
  FileText,
  MessageSquareText,
  AlertCircle
} from 'lucide-react'

interface ReportHoaxModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UploadedFile {
  id: string
  file: File
  previewUrl: string
}

export default function ReportHoaxModal({ isOpen, onClose }: ReportHoaxModalProps) {
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [narration, setNarration] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [images, setImages] = useState<UploadedFile[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFiles = Array.from(e.target.files)

    if (images.length + selectedFiles.length > 3) {
      setErrorMessage('Maksimal hanya 3 gambar yang dapat diunggah.')
      return
    }

    setErrorMessage('')

    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }))

    setImages((prev) => [...prev, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id)
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return filtered
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAnonymous && !fullName.trim()) {
      setErrorMessage('Silakan isi Nama Lengkap atau pilih "Laporkan secara anonim".')
      return
    }

    if (!narration.trim()) {
      setErrorMessage('Silakan jelaskan narasi hoaks yang ditemukan.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    // Simulate API call & ticket creation
    setTimeout(() => {
      const randomTicket = `HK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
      setTicketId(randomTicket)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1200)
  }

  const handleReset = () => {
    setIsAnonymous(false)
    setFullName('')
    setContact('')
    setNarration('')
    setSourceUrl('')
    setImages([])
    setIsSubmitted(false)
    setErrorMessage('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all my-8">

        {/* Header Section - Solid Kemkes Brand Color */}
        <div className="bg-[#07877c] px-6 py-4 text-white flex items-center justify-between shadow-sm relative">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-wide">Laporkan Hoaks</h2>
              <p className="text-xs text-white/85 font-medium">Formulir Pengaduan Isu & Cek Fakta Kesehatan</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 text-slate-700">

              {errorMessage && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Field 1: Nama Pelapor */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <User className="h-4 w-4 text-[#07877c]" />
                  Nama Lengkap Pelapor
                </label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={isAnonymous ? 'Anonim' : fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Anda?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
                <label className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#07877c] focus:ring-[#07877c]"
                  />
                  <span>Laporkan secara anonim</span>
                </label>
              </div>

              {/* Field 2: Medsos / Telp Pelapor */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Phone className="h-4 w-4 text-[#07877c]" />
                  Media Sosial / No. Telepon Pelapor
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contoh: Akun Facebook, Akun Instagram, No. WhatsApp, dsb."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all"
                />
              </div>

              {/* Field 3: Narasi Laporan */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <FileText className="h-4 w-4 text-[#07877c]" />
                  Narasi Laporan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Jelaskan detail hoaks yang Anda temukan secara rinci..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Field 4: Gambar / Tangkapan Layar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <UploadCloud className="h-4 w-4 text-[#07877c]" />
                    Gambar / Tangkapan Layar <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {images.length}/3
                  </span>
                </div>

                {/* Dropzone */}
                {images.length < 3 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#07877c] bg-slate-50/60 hover:bg-[#07877c]/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="h-12 w-12 rounded-full bg-[#07877c]/10 text-[#07877c] group-hover:scale-110 flex items-center justify-center transition-all mb-2">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Klik atau seret gambar ke sini</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      Maksimal 3 gambar (Format: PNG, JPG, JPEG, WEBP)
                    </p>
                  </div>
                )}

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-sm">
                        <img src={img.previewUrl} alt={`Pratinjau ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-all shadow-md"
                          title="Hapus gambar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 5: Link Sumber */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Globe className="h-4 w-4 text-[#07877c]" />
                  Link Sumber
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="Contoh: https://xyz.com/abc"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-[#07877c] hover:bg-[#056058] text-white font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Laporan</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success State with PROBIS Stepper Feedback */
            <div className="py-4 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Laporan Berhasil Terkirim!</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Nomor Referensi Tiket Anda: <span className="font-extrabold text-[#07877c] bg-[#07877c]/10 px-2 py-0.5 rounded">{ticketId}</span>
                </p>
              </div>

              {/* PROBIS Stepper Process Breakdown */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Tahapan Alur Bisnis (PROBIS):
                </h4>
                <div className="space-y-4">
                  {/* Step 1: Terkirim */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">1. Terkirim (Selesai)</p>
                      <p className="text-xs text-slate-500">Laporan Anda telah tercatat ke sistem database pengaduan Kemenkes.</p>
                    </div>
                  </div>

                  {/* Step 2: Direview */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs animate-pulse">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">2. Direview (Proses Berjalan)</p>
                      <p className="text-xs text-slate-500">Tim Verifikator & Ahli Kesehatan sedang meneliti dan mengecek keaslian informasi.</p>
                    </div>
                  </div>

                  {/* Step 3: Approval */}
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-700 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">3. Approval</p>
                      <p className="text-xs text-slate-500">Peninjauan dan persetujuan artikel klarifikasi oleh Redaktur Kemenkes.</p>
                    </div>
                  </div>

                  {/* Step 4: Tayang */}
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-700 font-bold text-xs">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">4. Tayang di Portal</p>
                      <p className="text-xs text-slate-500">Hasil verifikasi dipublikasikan secara terbuka pada portal ini.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hybrid WA Option */}
              <div className="pt-2">
                <a
                  href="https://wa.me/628111222333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#07877c] hover:underline"
                >
                  <MessageSquareText className="h-4 w-4" />
                  <span>Butuh respons lebih cepat? Chat WhatsApp Official Kami</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-[#07877c] hover:bg-[#056058] text-white font-bold text-sm shadow-md transition-all"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
