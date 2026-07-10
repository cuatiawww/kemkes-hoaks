'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
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

import {
  fetchArtikelHoaks,
  fetchKategori,
  ArtikelHoaksItem,
  formatDate,
  stripHtmlAndTruncate
} from '@/lib/api'
import SiteHeader from '@/components/SiteHeader'
import HomeHero from '@/components/HomeHero'

function ArticleImage({ src, statusHoaks = true, compact = false }: { src: string; statusHoaks?: boolean; compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center bg-gradient-to-br from-slate-100 to-slate-200 ${
        compact
          ? 'h-40 sm:h-full w-full rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none'
          : 'max-w-[600px] aspect-[2/1] w-full mx-auto rounded-t-2xl sm:rounded-2xl'
      }`}
      style={{ backgroundImage: `url("${encodeURI(src)}")` }}
      role="img"
      aria-label="Ilustrasi artikel hoaks kesehatan"
    >
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={statusHoaks ? "/watermark.png" : "/watermark2.png"}
          alt="Status Watermark"
          className={`object-contain opacity-95 select-none -rotate-12 transition-transform duration-300 ${
            compact ? 'w-[130px] sm:w-[150px]' : 'w-[260px] sm:w-[320px]'
          }`}
        />
      </div>
    </div>
  )
}

function LatestHoaxSlider({ items }: { items: ArtikelHoaksItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = isDesktop ? items.length - 2 : items.length - 1
        if (prev >= maxIndex || maxIndex <= 0) {
          return 0
        }
        return prev + 1
      })
    }, 3500)
    return () => clearInterval(timer)
  }, [isDesktop, items.length])

  if (items.length === 0) return null

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
                <ArticleImage src={article.image} statusHoaks={article.status_hoaks} />
                <h3 className="mt-8 text-lg font-bold leading-tight text-[#3b3b3b] transition group-hover:text-[#07877c] line-clamp-1">
                  {article.judul}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#8d8d8d]">
                  {formatDate(article.publish_date, 'id')} <span className="px-2">•</span> Waktu Baca 3 Menit
                </p>
                <div className="mt-4 h-px bg-[#d7d7d7]" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: isDesktop ? Math.max(items.length - 1, 1) : items.length }).map((_, idx) => (
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

const iconMap: Record<string, any> = {
  'vaksinasi': UsersRound,
  'obat-obatan': Stethoscope,
  'pengobatan': ShieldCheck,
  'kedokteran': FileText,
  'kegiatan': CalendarDays,
  'artikel-berita': Newspaper,
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )
}

export default function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = use(searchParams)
  const initialQuery = resolvedParams?.q || ''

  const router = useRouter()
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [articles, setArticles] = useState<ArtikelHoaksItem[]>([])
  const [categories, setCategories] = useState<{ label: string; count: number; icon: any }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalHoaxes, setTotalHoaxes] = useState<number>(1241)

  // Update query if URL searchParams change
  useEffect(() => {
    setSearchInput(initialQuery)
    setSearchQuery(initialQuery)
  }, [initialQuery])

  // Load API Data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch articles and categories
        const [articlesRes, categoriesRes] = await Promise.all([
          fetchArtikelHoaks({ per_page: '100', page: '1', lang: 'id' }),
          fetchKategori()
        ])

        const articlesList = articlesRes.data || []
        setArticles(articlesList)
        setTotalHoaxes(articlesRes.total_data || articlesList.length || 1241)

        const apiCategories = categoriesRes.data || []
        const mappedCategories = apiCategories.map((cat) => {
          const slug = cat.slug.toLowerCase()
          const count = articlesList.filter(
            (art) => art.kategori?.slug?.toLowerCase() === slug
          ).length

          return {
            label: toTitleCase(cat.nama_kategori),
            count: count,
            icon: iconMap[slug] || ShieldCheck,
          }
        })

        setCategories(mappedCategories)
      } catch (err: any) {
        console.error(err)
        setError('Gagal mengambil data dari server. Pastikan API lokal/dev Anda aktif.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter hoaxes for display
  const filteredHoaxes = articles.filter((item) => {
    const matchesCategory =
      !selectedCategory ||
      item.kategori?.nama?.toLowerCase() === selectedCategory.toLowerCase()

    const matchesSearch =
      !searchQuery ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const isFilterActive = !!selectedCategory || !!searchQuery

  const displayPopular = filteredHoaxes.map((item) => ({
    title: item.judul,
    image: item.image,
    slug: item.slug,
    date: formatDate(item.publish_date, 'id'),
    description: stripHtmlAndTruncate(item.isi, 180),
    visitor: item.visitor,
    statusHoaks: item.status_hoaks,
  }))

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const toggleCategory = (label: string, count: number) => {
    if (count === 0) return
    setSelectedCategory((prev) => (prev === label ? null : label))
  }

  const totalPages = Math.ceil(displayPopular.length / ITEMS_PER_PAGE)
  const paginatedPopular = displayPopular.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getVisiblePages = () => {
    const pages: number[] = []
    const actualTotalPages = Math.max(totalPages, 1)
    const range = 2 // Number of pages to show before and after current page
    let start = Math.max(currentPage - range, 1)
    let end = Math.min(currentPage + range, actualTotalPages)

    if (currentPage <= range) {
      end = Math.min(5, actualTotalPages)
    } else if (currentPage + range >= actualTotalPages) {
      start = Math.max(actualTotalPages - 4, 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f] flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07877c]"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">Memuat data hoaks kesehatan...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f] flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="h-10 px-6 rounded-full bg-[#07877c] hover:bg-[#056058] text-white text-sm font-bold transition-all shadow-md"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f]">
      <SiteHeader />

      {/* Marquee Banner Section */}
      <div className="mx-auto max-w-[1160px] px-4 mt-4">
        <div className="relative flex overflow-x-hidden border border-slate-200 rounded-lg bg-white h-10 items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <style>{`
            @keyframes marquee-scroll {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-scroll {
              display: flex;
              width: max-content;
              animation: marquee-scroll 35s linear infinite;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          
          {/* Label */}
          <div className="absolute left-0 top-0 bottom-0 bg-[#07877c] px-5 flex items-center text-xs font-black uppercase text-white z-20 whitespace-nowrap rounded-l-lg">
            Informasi Terkini
          </div>
          
          {/* Marquee Track */}
          <div className="animate-marquee-scroll whitespace-nowrap pl-[160px] text-xs font-bold text-slate-600 flex items-center h-full">
            <span className="inline-block mx-4">• Portal Resmi Terpadu Rumah Sakit Kemenkes RI: Akses Layanan Kesehatan Terpusat</span>
            <span className="inline-block mx-4">• Panduan Layanan Kesehatan Masyarakat 2026</span>
            <span className="inline-block mx-4">• Laporkan Isu Hoaks melalui WhatsApp Official</span>
            <span className="inline-block mx-4">• Selalu Cek Keaslian Berita Sebelum Membagikan</span>
            <span className="inline-block mx-4">• Portal Resmi Terpadu Rumah Sakit Kemenkes RI: Akses Layanan Kesehatan Terpusat</span>
            <span className="inline-block mx-4">• Panduan Layanan Kesehatan Masyarakat 2026</span>
            <span className="inline-block mx-4">• Laporkan Isu Hoaks melalui WhatsApp Official</span>
            <span className="inline-block mx-4">• Selalu Cek Keaslian Berita Sebelum Membagikan</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <HomeHero
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchQuery={setSearchQuery}
          totalCount={totalHoaxes}
        />
      </div>

      <section className="mx-auto max-w-[1160px] px-4 pb-28 pt-12">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#747474]">Hoaks Kesehatan Terbaru</h2>
        <div className="mt-6 h-px bg-[#d7d7d7]" />
        <LatestHoaxSlider items={articles.slice(0, 6)} />

        <h2 className="mt-16 text-2xl font-bold uppercase tracking-wide text-[#747474]">
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
          <aside className="min-w-0">
            <h3 className="mb-6 text-lg font-bold text-[#747474] hidden lg:block">Kategori Hoaks</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-col lg:overflow-visible lg:space-y-0">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.label
                const hasResults = category.count > 0

                return (
                  <button
                    key={category.label}
                    disabled={!hasResults}
                    onClick={() => toggleCategory(category.label, category.count)}
                    className={`flex-shrink-0 flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-bold transition-all
                      lg:w-full lg:flex lg:items-center lg:justify-between lg:border-0 lg:border-b lg:border-[#d9d9d9] lg:py-5 lg:rounded-none lg:px-0 lg:bg-transparent lg:shadow-none
                      ${
                        hasResults
                          ? isSelected
                            ? 'bg-[#07877c] text-white border-[#07877c] lg:text-[#07877c] lg:bg-transparent lg:border-transparent'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#07877c] hover:text-[#07877c] lg:border-transparent lg:hover:border-transparent'
                          : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-50 lg:border-transparent'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2 lg:gap-5">
                      <span className={`flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full lg:rounded-md transition ${
                        hasResults
                          ? isSelected
                            ? 'bg-white text-[#07877c] lg:bg-[#07877c] lg:text-white'
                            : 'bg-[#07877c]/15 text-[#07877c]'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        <category.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                      </span>
                      <span className={`text-xs lg:text-base font-semibold ${isSelected ? 'font-extrabold text-white lg:text-[#07877c]' : 'text-slate-700'}`}>
                        {category.label}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`text-xs lg:text-base font-extrabold ${
                        hasResults 
                          ? isSelected
                            ? 'text-white/90 lg:text-[#07877c]'
                            : 'text-[#07877c]' 
                          : 'text-slate-400'
                      }`}>
                        ({category.count})
                      </span>
                      <span className={`hidden lg:flex h-5 w-5 items-center justify-center rounded-lg transition-all duration-300 text-white ${
                        hasResults
                          ? isSelected
                            ? 'bg-[#07877c] rotate-90'
                            : 'bg-[#07877c]/20 text-[#07877c] rotate-0'
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="flex flex-col justify-between min-w-0">
            <div 
              className="space-y-8 lg:max-h-[680px] lg:overflow-y-auto lg:pr-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#07877c #f1f1f1'
              }}
            >
              {paginatedPopular.length > 0 ? (
                paginatedPopular.map((article) => (
                  <Link
                    key={article.title}
                    href={`/detail?slug=${article.slug}`}
                    className="group grid gap-6 pb-6 border-b border-slate-200 last:border-0 last:pb-0 transition-all duration-300 sm:grid-cols-[180px_1fr] hover:translate-x-1"
                  >
                    <ArticleImage src={article.image} statusHoaks={article.statusHoaks} compact />
                    <div className="flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <h3 className="text-lg font-bold leading-snug text-slate-800 group-hover:text-[#07877c] transition-colors truncate">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-500 leading-relaxed">
                          {article.description}
                        </p>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        {article.date} <span className="px-3">•</span> Dilihat {article.visitor || 0} Kali <span className="px-3">•</span> Waktu Baca 3 Menit
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="border border-slate-200 rounded-2xl p-12 text-center shadow-sm bg-white/40">
                  <h3 className="text-xl font-bold text-[#747474] mb-2">Hasil tidak ditemukan</h3>
                  <p className="text-sm font-semibold text-[#9a9a9a]">
                    Coba kata kunci lain atau pilih kategori hoaks yang memiliki data.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages >= 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-12 pb-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-5 rounded-full bg-[#07877c]/10 text-[#07877c] font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#07877c]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                {getVisiblePages().map((pageNum) => {
                  const isActive = currentPage === pageNum
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[#07877c] text-white shadow-md font-extrabold scale-105'
                          : 'bg-[#07877c]/10 text-[#07877c] hover:bg-[#07877c]/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.max(totalPages, 1)))}
                  disabled={currentPage >= Math.max(totalPages, 1)}
                  className="h-10 px-5 rounded-full bg-[#07877c]/10 text-[#07877c] font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#07877c]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
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
