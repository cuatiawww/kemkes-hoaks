'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Home,
  Info,
  Languages,
  Menu,
  Phone,
  PlayCircle,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import hoaksData from '@/data/hoaks.json'
import SiteHeader from '@/components/SiteHeader'
import HomeHero from '@/components/HomeHero'

function SidebarLatestSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const items = hoaksData.slice(0, 4)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [items.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-[#07877c] rounded-full" />
        Hoaks Terbaru
      </h2>
      
      <div className="relative h-[220px] w-full overflow-hidden rounded-2xl shadow-sm group/slider">
        {items.map((item, idx) => (
          <Link
            key={item.slug}
            href={`/detail?slug=${item.slug}`}
            className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${encodeURI(item.image)}")` }}
            >
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src="/watermark.png"
                  alt="Hoaks Watermark"
                  className="object-contain opacity-95 select-none -rotate-12 w-[140px]"
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="text-base font-extrabold leading-snug line-clamp-2 hover:underline">
                {item.locale.id.title}
              </h3>
              <p className="mt-2 text-[11px] text-white/70 font-medium">
                {item.locale.id.date} &bull; Waktu Baca 3 Menit
              </p>
            </div>
          </Link>
        ))}

        {/* Left Arrow Overlay */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full flex items-center justify-center text-slate-700 bg-white/90 hover:bg-white transition-all shadow-md hover:scale-105"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {/* Right Arrow Overlay */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full flex items-center justify-center text-slate-700 bg-white/90 hover:bg-white transition-all shadow-md hover:scale-105"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  )
}

function HoaxImage({ src, small = false }: { src: string; small?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-center ${
        small 
          ? 'w-[100px] h-[64px] sm:w-[130px] sm:h-[84px] bg-cover rounded-xl flex-shrink-0 shadow-sm border border-slate-200/50' 
          : 'aspect-[21/9] w-full bg-contain bg-no-repeat bg-white rounded-2xl shadow-sm border border-slate-200/50'
      }`}
      style={{ backgroundImage: `url("${encodeURI(src)}")` }}
      role="img"
      aria-label="Ilustrasi artikel hoaks kesehatan"
    >
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/watermark.png"
          alt="Hoaks Watermark"
          className={`object-contain opacity-95 select-none -rotate-12 ${
            small ? 'w-[85px] sm:w-[95px]' : 'w-[320px] sm:w-[420px] max-w-[85%]'
          }`}
        />
      </div>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-28 bg-[#07877c] text-white">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="font-semibold leading-relaxed">
            Kementerian Kesehatan Republik Indonesia
            <br />
            Jl. H.R. Rasuna Said Blok X-5 Kav. 4-9
            <br />
            Jakarta Selatan 12950
            <br />
            Indonesia
          </p>
          <p className="mt-12 text-sm font-semibold">&copy; 2025</p>
        </div>
        <div className="md:text-left lg:pl-24">
          <p className="mb-5 font-bold">Ikuti Kami:</p>
          <div className="flex flex-wrap gap-3">
            {[Home, CameraIcon, Languages, PlayCircle, MusicIcon, CircleUserRound].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1fc7c0] transition hover:bg-white hover:text-[#07877c]"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="mt-16 text-sm font-semibold uppercase tracking-wide lg:text-right">RSS | Sitemap</p>
        </div>
      </div>
    </footer>
  )
}

interface DetailPageProps {
  searchParams: Promise<{ slug?: string }>
}

export default function DetailPage({ searchParams }: DetailPageProps) {
  const resolvedParams = use(searchParams)
  const slug = resolvedParams?.slug || ''
  const [searchInput, setSearchInput] = useState('')

  const hoax =
    hoaksData.find((item) => item.slug === slug) ||
    hoaksData.find((item) => item.slug === 'hoaks-virus-marburg-dapat-diaktifkan-melalui-5g') ||
    hoaksData[0]

  const related = hoaksData.filter((item) => item.slug !== hoax.slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f]">
      <SiteHeader />
      <div className="mt-4">
        <HomeHero searchInput={searchInput} setSearchInput={setSearchInput} />
      </div>

      <section className="mx-auto grid max-w-[1160px] gap-12 px-4 pt-10 lg:grid-cols-[1fr_390px] pb-28">
        <article className="min-w-0">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#747474]">
            <Link href="/" className="transition hover:text-[#07877c] hover:underline flex items-center gap-1">
              <Home className="h-4 w-4" />
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Detail Hoaks</span>
          </div>

          <h1 className="max-w-[745px] text-3xl font-semibold leading-tight text-black md:text-[32px]">
            {hoax.locale.id.title}
          </h1>
          <p className="mt-5 text-sm font-medium text-[#696969]">
            {hoax.locale.id.date} <span className="px-3">&bull;</span> Waktu Baca 3 Menit
          </p>

          <div className="mt-6 max-w-[745px]">
            <HoaxImage src={hoax.image} />
          </div>

          <div className="border-l-4 border-[#07877c] pl-6 mt-8 max-w-[727px] text-lg leading-8 text-[#525252]">
            <h2 className="mb-4 text-2xl font-bold text-black">Penjelasan</h2>
            {hoax.locale.id.explanation.split('\n\n').map((paragraph, index) => (
              <p key={index} className={`text-justify ${index > 0 ? 'mt-4' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#cccccc] grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-4 text-lg font-extrabold text-[#302e2e]">
                <span>Kategori</span>
                <span className="text-[#8d8d8d] font-semibold text-base ml-2">Health</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hoax.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white text-slate-700 text-sm rounded border border-slate-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-extrabold text-[#302e2e] mb-4">
                Counter Fakta
              </h4>
              {hoax.counterFact ? (
                <a
                  href={hoax.counterFact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold break-all leading-relaxed"
                >
                  {hoax.counterFact}
                </a>
              ) : (
                <span className="text-sm text-slate-500 italic">Tidak tersedia</span>
              )}
            </div>
          </div>
        </article>

        <aside className="lg:pt-10">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#07877c] rounded-full" />
            Hoaks Terkait
          </h2>
          <div className="mt-4 h-px bg-slate-200" />
          <div className="space-y-6 pt-6">
            {related.map((item) => (
              <Link
                key={item.locale.id.title}
                href={`/detail?slug=${item.slug}`}
                className="group block border-b border-slate-200 pb-5 last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex gap-4 items-start">
                  <HoaxImage src={item.image} small />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-extrabold leading-snug text-slate-800 group-hover:text-[#07877c] transition-colors line-clamp-2">
                      {item.locale.id.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.locale.id.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#07877c] hover:underline"
          >
            Lihat Hoaks Lainnya
            <ChevronRight className="h-4 w-4" />
          </Link>

          <SidebarLatestSlider />

          <div className="mt-10 bg-gradient-to-br from-[#07877c] to-[#056058] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-lg pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-extrabold mb-3 leading-snug">Ragu Dengan Keaslian Informasi?</h3>
              <p className="text-xs font-semibold leading-relaxed text-white/90 mb-6">
                Hubungi kami jika Anda masih memiliki keraguan dalam berita yang bertebaran untuk dicek kevalidan hoaksnya oleh tim ahli kami.
              </p>
              <Link
                href="https://wa.me/628111222333"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#d6ef21] py-3 text-sm font-bold text-[#07877c] hover:bg-[#c9e21a] transition-all hover:scale-[1.02] shadow-sm"
              >
                Laporkan Isu / Cek Fakta
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h1.6l1.2-2h4.4l1.2 2H17a3 3 0 0 1 3 3v6.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18V6l10-2v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
