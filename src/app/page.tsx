'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileText,
  Home,
  Info,
  Languages,
  Menu,
  Newspaper,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from 'lucide-react'
import Link from 'next/link'

import hoaksData from '@/data/hoaks.json'
import SiteHeader from '@/components/SiteHeader'

const heroImage =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1800&q=80'

function ArticleImage({ src, compact = false }: { src: string; compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${
        compact
          ? 'h-40 sm:h-full w-full rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none'
          : 'h-52 w-full rounded-t-2xl sm:rounded-2xl'
      }`}
      style={{ backgroundImage: `url("${encodeURI(src)}")` }}
      role="img"
      aria-label="Ilustrasi artikel hoaks kesehatan"
    >
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/watermark.png"
          alt="Hoaks Watermark"
          className={`object-contain opacity-90 select-none ${
            compact ? 'w-[100px] h-[100px]' : 'w-[180px] h-[180px]'
          }`}
        />
      </div>
    </div>
  )
}

function LatestHoaxSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const items = hoaksData.slice(0, 6)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = isDesktop ? items.length - 2 : items.length - 1
        if (prev >= maxIndex) {
          return 0
        }
        return prev + 1
      })
    }, 3500)
    return () => clearInterval(timer)
  }, [isDesktop, items.length])

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out -mx-3"
          style={{
            transform: isDesktop
              ? `translateX(-${currentIndex * 50}%)`
              : `translateX(-${currentIndex * 100}%)`
          }}
        >
          {items.map((article) => (
            <div key={article.slug} className="w-full md:w-1/2 flex-shrink-0 px-3">
              <Link href={`/detail?slug=${article.slug}`} className="group block">
                <ArticleImage src={article.image} />
                <h3 className="mt-8 text-lg font-extrabold leading-tight text-[#3b3b3b] transition group-hover:text-[#07877c] line-clamp-1">
                  {article.locale.id.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#8d8d8d]">
                  {article.locale.id.date} <span className="px-2">•</span> Waktu Baca 3 Menit
                </p>
                <div className="mt-4 h-px bg-[#d7d7d7]" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: isDesktop ? items.length - 1 : items.length }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-6 bg-[#07877c]' : 'w-2.5 bg-slate-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}


interface HomePageProps {
  searchParams: Promise<{ q?: string }>
}

export default function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = use(searchParams)
  const initialQuery = resolvedParams?.q || ''

  const router = useRouter()
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Update query if URL searchParams change
  useEffect(() => {
    setSearchInput(initialQuery)
    setSearchQuery(initialQuery)
  }, [initialQuery])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic category calculations
  const categories = [
    { label: 'Vaksinasi', count: hoaksData.filter((item) => item.category === 'Vaksinasi').length, icon: UsersRound },
    { label: 'Obat-obatan', count: hoaksData.filter((item) => item.category === 'Obat-obatan').length, icon: Stethoscope },
    { label: 'Pengobatan', count: hoaksData.filter((item) => item.category === 'Pengobatan').length, icon: ShieldCheck },
    { label: 'Kedokteran', count: hoaksData.filter((item) => item.category === 'Kedokteran').length, icon: FileText },
    { label: 'Kegiatan', count: hoaksData.filter((item) => item.category === 'Kegiatan').length, icon: CalendarDays },
    { label: 'Artikel Berita', count: hoaksData.filter((item) => item.category === 'Artikel Berita').length, icon: Newspaper },
  ]

  // Filter matching suggestions
  const suggestions =
    searchInput.trim().length >= 2
      ? hoaksData
          .filter((item) =>
            item.locale.id.title.toLowerCase().includes(searchInput.toLowerCase())
          )
          .slice(0, 5)
      : []

  // Filter hoaxes for display
  const filteredHoaxes = hoaksData.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      item.locale.id.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locale.id.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const isFilterActive = !!selectedCategory || !!searchQuery


  const displayPopular = isFilterActive
    ? filteredHoaxes.map((item) => ({
        title: item.locale.id.title,
        image: item.image,
        slug: item.slug,
        date: item.locale.id.date,
        description: item.locale.id.description,
      }))
    : hoaksData.slice(2).map((item) => ({
        title: item.locale.id.title,
        image: item.image,
        slug: item.slug,
        date: item.locale.id.date,
        description: item.locale.id.description,
      }))

  const toggleCategory = (label: string, count: number) => {
    if (count === 0) return
    setSelectedCategory((prev) => (prev === label ? null : label))
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSearchQuery(searchInput)
    setShowSuggestions(false)
  }

  const handlePopularSearchClick = (tag: string) => {
    setSearchInput(tag)
    setSearchQuery(tag)
    setShowSuggestions(false)
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f]">
      <SiteHeader />

      <section className="mx-auto max-w-[1160px] px-4">
        <div className="bg-white">
          <div className="inline-flex bg-[#07877c] px-4 py-2 text-xs font-extrabold uppercase text-white">
            Informasi Terkini
          </div>
          <div
            className="relative min-h-[360px] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b9ae]/90 via-[#07958f]/85 to-[#005e66]/95" />
            <div className="relative z-10 mx-auto flex min-h-[360px] max-w-[920px] flex-col items-center justify-center px-5 py-12 text-center text-white">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[42px]">
                Telusuri 1.241 Isu Hoaks Kesehatan
              </h1>
              <p className="mt-3 max-w-lg text-base font-medium leading-snug text-white/95">
                Cari dan temukan berbagai isu hoaks disini, jangan sampai termakan Hoaks!
              </p>
              <form onSubmit={handleSearchSubmit} className="mt-9 flex w-full max-w-[870px] flex-col gap-4 sm:flex-row">
                <div ref={searchRef} className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <input
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Cari penyakit, gejala, atau tips untuk hidup lebih sehat..."
                    className="h-[56px] w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 text-base text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#1ebdb8] focus:border-transparent transition-all placeholder:text-slate-400"
                    autoComplete="off"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('')
                        setSearchQuery('')
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      ✕
                    </button>
                  )}
                  {showSuggestions && searchInput.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 py-2 max-h-[350px] overflow-y-auto">
                      {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSearchInput(item.locale.id.title)
                              setSearchQuery(item.locale.id.title)
                              setShowSuggestions(false)
                              router.push(`/detail?slug=${item.slug}`)
                            }}
                            className="w-full px-5 py-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#07877c] flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-[#07877c] truncate">
                                  {item.locale.id.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                              Detail
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-5 py-4 text-sm text-slate-500 text-center">
                          Tidak ada saran pencarian.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="h-[56px] rounded-xl bg-[#1ebdb8] px-10 text-lg font-bold text-white shadow-sm hover:bg-[#18aaa5] transition-all hover:scale-102 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Cari</span>
                </button>
              </form>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="font-semibold text-white/90">Topik Populer:</span>
                {['Vaksin', 'HIV', 'Virus', 'BPJS', 'Imunisasi'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handlePopularSearchClick(tag)}
                    className="px-4 py-1.5 bg-white/20 hover:bg-white hover:text-[#07877c] text-white text-sm rounded-full transition-all duration-300 border border-white/30 font-semibold"
                  >
                    {tag
                  }</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 pb-28 pt-12">
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#747474]">Hoaks Kesehatan Terbaru</h2>
        <div className="mt-6 h-px bg-[#d7d7d7]" />
        <LatestHoaxSlider />

        <h2 className="mt-16 text-2xl font-extrabold uppercase tracking-wide text-[#747474]">
          Hoaks Kesehatan Terpopuler
        </h2>
        {isFilterActive && (
          <p className="mt-2 text-sm font-semibold text-[#8d8d8d]">
            {selectedCategory && `Kategori: ${selectedCategory}`}
            {selectedCategory && searchQuery && '  •  '}
            {searchQuery && `Pencarian: "${searchQuery}"`}
            {'  •  '}
            Terdapat {displayPopular.length} artikel hoaks
          </p>
        )}
        <div className="mt-4 h-px bg-[#d7d7d7]" />

        <div className="mt-10 grid gap-14 lg:grid-cols-[320px_1fr]">
          <aside>
            <h3 className="mb-6 text-lg font-bold text-[#747474]">Kategori Hoaks</h3>
            <div className="space-y-0">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.label
                const hasResults = category.count > 0

                return (
                  <button
                    key={category.label}
                    disabled={!hasResults}
                    onClick={() => toggleCategory(category.label, category.count)}
                    className={`w-full flex items-center justify-between border-b border-[#d9d9d9] py-5 text-[#747474] text-left transition ${
                      hasResults ? 'hover:text-[#07877c] cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="flex items-center gap-5">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-md text-white transition ${
                        isSelected ? 'bg-[#07877c]' : 'bg-[#7ddbd4]'
                      }`}>
                        <category.icon className="h-5 w-5" />
                      </span>
                      <span className={`text-base font-semibold ${isSelected ? 'text-[#07877c] font-extrabold' : ''}`}>
                        {category.label}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`text-base font-extrabold ${
                        hasResults 
                          ? isSelected 
                            ? 'text-[#07877c]' 
                            : 'text-[#23bbb5]' 
                          : 'text-red-500'
                      }`}>
                        ({category.count})
                      </span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-lg transition-all duration-300 text-white ${
                        hasResults
                          ? isSelected
                            ? 'bg-[#07877c] rotate-90'
                            : 'bg-[#07877c] rotate-0'
                          : 'bg-gray-300'
                      }`}>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>

          <div
            className="space-y-8 lg:max-h-[680px] lg:overflow-y-auto lg:pr-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#07877c #f1f1f1'
            }}
          >
            {displayPopular.length > 0 ? (
              displayPopular.map((article) => (
                <Link
                  key={article.title}
                  href={`/detail?slug=${article.slug}`}
                  className="group grid gap-6 pb-6 border-b border-slate-200 last:border-0 last:pb-0 transition-all duration-300 sm:grid-cols-[180px_1fr] hover:translate-x-1"
                >
                  <ArticleImage src={article.image} compact />
                  <div className="flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <h3 className="text-lg font-extrabold leading-snug text-slate-800 group-hover:text-[#07877c] transition-colors truncate">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-500 leading-relaxed">
                        {article.description}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      {article.date} <span className="px-3">•</span> Dilihat 708 Kali <span className="px-3">•</span> Waktu Baca 3 Menit
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="border border-slate-200 rounded-2xl p-12 text-center shadow-sm bg-white/40">
                <h3 className="text-xl font-extrabold text-[#747474] mb-2">Hasil tidak ditemukan</h3>
                <p className="text-sm font-semibold text-[#9a9a9a]">
                  Coba kata kunci lain atau pilih kategori hoaks yang memiliki data.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#07877c] text-white">
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
            <p className="mt-12 text-sm font-semibold">© 2025</p>
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
    </main>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h1.6l1.2-2h4.4l1.2 2H17a3 3 0 0 1 3 3v6.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18V6l10-2v11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
