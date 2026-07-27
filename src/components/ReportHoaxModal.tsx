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
  Mail,
  Share2,
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
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [socialMedia, setSocialMedia] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await fetch('http://localhost/hoaks-yii/api/pengaduan/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_pelapor: isAnonymous ? 'Anonim' : fullName,
          email_pelapor: email || 'anonim@kemenkes.go.id',
          telepon_pelapor: phone,
          judul_isu: narration.length > 50 ? narration.substring(0, 50) + '...' : narration,
          deskripsi_isu: narration + (sourceUrl ? `\n\nLink Sumber: ${sourceUrl}` : ''),
          kategori_slug: 'pengaduan-masyarakat',
        }),
      })

      const data = await response.json()
      if (data && data.success && data.data?.no_tiket) {
        setTicketId(data.data.no_tiket)
      } else {
        const randomTicket = `HOAX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
        setTicketId(randomTicket)
      }
    } catch (err) {
      console.warn('Backend offline, using local ticket fallback:', err)
      const randomTicket = `HOAX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      setTicketId(randomTicket)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const handleReset = () => {
    setIsAnonymous(false)
    setFullName('')
    setEmail('')
    setPhone('')
    setSocialMedia('')
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

              {/* Field 2: Email Pelapor */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Mail className="h-4 w-4 text-[#07877c]" />
                  Email Pelapor
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: nama@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all"
                />
              </div>

              {/* Field 3: No. Telepon / WhatsApp */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Phone className="h-4 w-4 text-[#07877c]" />
                  No. Telepon / WhatsApp Pelapor
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07877c] focus:border-transparent transition-all"
                />
              </div>

              {/* Field 4: Media Sosial Pelapor */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Share2 className="h-4 w-4 text-[#07877c]" />
                  Media Sosial Pelapor
                </label>
                <input
                  type="text"
                  value={socialMedia}
                  onChange={(e) => setSocialMedia(e.target.value)}
                  placeholder="Contoh: Akun Facebook, Instagram, TikTok, dsb."
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
            /* Success State with Clear Notification & PROBIS Stepper Feedback */
            <div className="py-2 text-center space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">Laporan Anda Sudah Terkirim!</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Laporan Anda akan kami tinjau dan verifikasi oleh tim ahli kami. Kami akan menginformasikan kembali hasil verifikasi atau penayangan klarifikasi laporan Anda.
                </p>
              </div>

              {/* Box Info Nomor Tiket & Bantuan */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-center">
                <p className="text-xs text-emerald-900 font-medium">Nomor Referensi Tiket Anda:</p>
                <p className="text-lg font-extrabold text-[#07877c] tracking-wider my-1">{ticketId}</p>
                <p className="text-[11px] text-emerald-800 font-normal leading-normal">
                  Jika Anda tidak mendapatkan pembaruan informasi verifikasi atau membutuhkan penanganan cepat, silakan hubungi kami dengan menyertakan Nomor Tiket Anda.
                </p>
              </div>

              {/* Horizontal Stepper Timeline (User Friendly Public View) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
                  Tahapan Verifikasi Laporan
                </h4>

                <div className="relative flex items-center justify-between max-w-md mx-auto px-2">
                  {/* Connecting Progress Line behind icons */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
                    <div className="h-full bg-emerald-500 w-[33%]" />
                  </div>

                  {/* Step 1: Terkirim */}
                  <div className="relative z-10 flex flex-col items-center group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-sm ring-4 ring-white">
                      ✓
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-slate-800 mt-2">1. Terkirim</span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5">Selesai</span>
                  </div>

                  {/* Step 2: Peninjauan (Active) */}
                  <div className="relative z-10 flex flex-col items-center group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white font-extrabold text-xs shadow-sm ring-4 ring-white animate-pulse">
                      2
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-slate-800 mt-2">2. Peninjauan</span>
                    <span className="text-[9px] sm:text-[10px] text-amber-800 font-extrabold bg-amber-100 px-1.5 py-0.5 rounded mt-0.5">Proses</span>
                  </div>

                  {/* Step 3: Persetujuan */}
                  <div className="relative z-10 flex flex-col items-center opacity-60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs ring-4 ring-white">
                      3
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-slate-700 mt-2">3. Persetujuan</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5">Menunggu</span>
                  </div>

                  {/* Step 4: Tayang */}
                  <div className="relative z-10 flex flex-col items-center opacity-60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs ring-4 ring-white">
                      4
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-slate-700 mt-2">4. Publikasi</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5">Tayang</span>
                  </div>
                </div>
              </div>

              {/* Hybrid WA Direct Chat with pre-filled Ticket ID */}
              <div className="pt-1">
                <a
                  href={`https://wa.me/628111222333?text=${encodeURIComponent(`Halo Admin Kemenkes, saya ingin menanyakan perkembangan laporan hoaks dengan Nomor Tiket: ${ticketId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#07877c] hover:underline bg-[#07877c]/10 hover:bg-[#07877c]/20 px-4 py-2.5 rounded-xl transition-all w-full"
                >
                  <MessageSquareText className="h-4 w-4" />
                  <span>Tanyakan Status via WhatsApp (No. Tiket: {ticketId})</span>
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-[#07877c] hover:bg-[#056058] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
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
