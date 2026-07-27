'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Contact,
  FileText,
  Home,
  Info,
  Languages,
  LayoutGrid,
  Leaf,
  Megaphone,
  Menu,
  MoreHorizontal,
  Newspaper,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserCheck,
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
import ReportHoaxModal from '@/components/ReportHoaxModal'

function ArticleImage({ src, statusHoaks = true, compact = false }: { src: string; statusHoaks?: boolean; compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center bg-gradient-to-br from-slate-100 to-slate-200 ${compact
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
          className={`object-contain opacity-95 select-none -rotate-12 transition-transform duration-300 ${compact ? 'w-[130px] sm:w-[150px]' : 'w-[260px] sm:w-[320px]'
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
            className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-[#07877c]' : 'w-2.5 bg-slate-300'
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

interface CategoryPill {
  id: string
  label: string
  icon: any
}

const CATEGORY_ITEMS: CategoryPill[] = [
  { id: 'semua', label: 'Semua', icon: LayoutGrid },
  { id: 'imunisasi', label: 'Imunisasi', icon: Syringe },
  { id: 'surat-palsu', label: 'Surat Palsu', icon: FileText },
  { id: 'identitas-palsu', label: 'Identitas Palsu', icon: Contact },
  { id: 'calo-kesehatan', label: 'Calo Kesehatan', icon: UserCheck },
  { id: 'penyakit', label: 'Penyakit', icon: Activity },
  { id: 'obat-suplemen-herbal', label: 'Obat, Suplemen & Herbal', icon: Leaf },
  { id: 'layanan-kesehatan', label: 'Layanan Kesehatan', icon: Building2 },
  { id: 'pengaduan-masyarakat', label: 'Pengaduan Masyarakat', icon: Megaphone },
  { id: 'lain-lain', label: 'Lain-lain', icon: MoreHorizontal },
]

function matchesCategoryFilter(catName: string = '', catSlug: string = '', selected: string | null): boolean {
  if (!selected || selected === 'Semua') return true
  const s = selected.toLowerCase()
  const name = (catName || '').toLowerCase()
  const slug = (catSlug || '').toLowerCase()

  if (name === s || slug === s) return true

  if (s === 'imunisasi' && (name.includes('vaksin') || slug.includes('vaksin') || name.includes('imunisasi'))) return true
  if (s === 'obat, suplemen & herbal' && (name.includes('obat') || slug.includes('obat') || name.includes('herbal'))) return true
  if (s === 'layanan kesehatan' && (name.includes('layanan') || name.includes('pengobatan') || slug.includes('pengobatan'))) return true
  if (s === 'surat palsu' && (name.includes('surat') || name.includes('dokumen') || name.includes('kedokteran'))) return true
  if (s === 'identitas palsu' && (name.includes('identitas') || slug.includes('identitas'))) return true
  if (s === 'calo kesehatan' && (name.includes('calo') || slug.includes('calo'))) return true
  if (s === 'penyakit' && (name.includes('penyakit') || slug.includes('penyakit'))) return true
  if (s === 'pengaduan masyarakat' && (name.includes('pengaduan') || name.includes('lapor') || slug.includes('aduan'))) return true
  if (s === 'lain-lain' && (!name || name.includes('lain') || name.includes('kegiatan') || name.includes('artikel'))) return true

  return false
}

function getCategoryDetails(catName: string = '', catSlug: string = ''): { label: string; icon: any } {
  const name = (catName || '').toLowerCase()
  const slug = (catSlug || '').toLowerCase()

  if (name.includes('imunisasi') || name.includes('vaksin') || slug.includes('vaksin')) {
    return { label: 'Imunisasi', icon: Syringe }
  }
  if (name.includes('surat') || name.includes('dokumen') || name.includes('kedokteran')) {
    return { label: 'Surat Palsu', icon: FileText }
  }
  if (name.includes('identitas') || slug.includes('identitas')) {
    return { label: 'Identitas Palsu', icon: Contact }
  }
  if (name.includes('calo') || slug.includes('calo')) {
    return { label: 'Calo Kesehatan', icon: UserCheck }
  }
  if (name.includes('penyakit') || slug.includes('penyakit')) {
    return { label: 'Penyakit', icon: Activity }
  }
  if (name.includes('obat') || name.includes('herbal') || slug.includes('obat')) {
    return { label: 'Obat, Suplemen & Herbal', icon: Leaf }
  }
  if (name.includes('layanan') || name.includes('pengobatan') || slug.includes('pengobatan')) {
    return { label: 'Layanan Kesehatan', icon: Building2 }
  }
  if (name.includes('pengaduan') || name.includes('lapor') || slug.includes('aduan')) {
    return { label: 'Pengaduan Masyarakat', icon: Megaphone }
  }

  return { label: catName ? toTitleCase(catName) : 'Imunisasi', icon: Syringe }
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalHoaxes, setTotalHoaxes] = useState<number>(1241)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

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

        // Fetch articles
        const articlesRes = await fetchArtikelHoaks({ per_page: '100', page: '1', lang: 'id' })
        const articlesList = articlesRes.data || []
        setArticles(articlesList)
        setTotalHoaxes(articlesRes.total_data || articlesList.length || 1241)
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
    const matchesCategory = matchesCategoryFilter(
      item.kategori?.nama,
      item.kategori?.slug,
      selectedCategory
    )

    const matchesSearch =
      !searchQuery ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const isFilterActive = !!selectedCategory || !!searchQuery

  const displayPopular = filteredHoaxes.map((item) => {
    const catDetails = getCategoryDetails(item.kategori?.nama, item.kategori?.slug)
    return {
      title: item.judul,
      image: item.image,
      slug: item.slug,
      date: formatDate(item.publish_date, 'id'),
      description: stripHtmlAndTruncate(item.isi, 180),
      visitor: item.visitor,
      statusHoaks: item.status_hoaks,
      categoryLabel: catDetails.label,
      CategoryIcon: catDetails.icon,
    }
  })

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

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
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-block mx-4 text-[#07877c] font-black hover:underline cursor-pointer"
            >
              • Laporkan Isu Hoaks Kesehatan (Formulir Cek Fakta Publik)
            </button>
            <span className="inline-block mx-4">• Selalu Cek Keaslian Berita Sebelum Membagikan</span>
            <span className="inline-block mx-4">• Portal Resmi Terpadu Rumah Sakit Kemenkes RI: Akses Layanan Kesehatan Terpusat</span>
            <span className="inline-block mx-4">• Panduan Layanan Kesehatan Masyarakat 2026</span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-block mx-4 text-[#07877c] font-black hover:underline cursor-pointer"
            >
              • Laporkan Isu Hoaks Kesehatan (Formulir Cek Fakta Publik)
            </button>
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

      {/* Banner CTA Lapor Hoaks Memanjang (Tepat di bawah Hero Section) */}
      <div className="mx-auto max-w-[1160px] px-4 mt-6">
        <div className="bg-[#07877c] rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-[#056058] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Periksa Keaslian Informasi
            </h3>
            <p className="mt-2 text-sm text-white/90 font-medium leading-relaxed max-w-2xl">
              Hubungi kami jika Anda masih memiliki keraguan dalam berita yang bertebaran untuk dicek kevalidan hoaksnya oleh tim ahli kami.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="w-full md:w-auto px-8 py-3.5 bg-[#d6ef21] hover:bg-[#c8e219] text-[#07877c] font-extrabold text-sm sm:text-base rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Laporkan Isu / Cek Fakta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Kategori Isu (Tepat sebelum section Hasil Penelusuran - Sesuai Gambar 1) */}
      <section className="mx-auto max-w-[1160px] px-4 pt-10 pb-2">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-[#07877c]">
            KATEGORI ISU
          </h2>
          <div className="mt-1.5 h-1 w-10 bg-[#07877c] rounded-full" />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap whitespace-nowrap">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected =
              (!selectedCategory && cat.label === 'Semua') ||
              selectedCategory === cat.label
            const IconComponent = cat.icon

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.label === 'Semua') {
                    setSelectedCategory(null)
                  } else {
                    setSelectedCategory(selectedCategory === cat.label ? null : cat.label)
                  }
                }}
                className={`flex-shrink-0 flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#07877c] text-white shadow-md border border-[#07877c] scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:border-[#07877c] hover:text-[#07877c] hover:shadow-sm'
                }`}
              >
                <IconComponent
                  className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-colors ${
                    isSelected ? 'text-white' : 'text-[#07877c]'
                  }`}
                />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 pb-28 pt-2">
        {/* Section Hoaks Kesehatan Terbaru (Dihilangkan/Sembunyikan sesuai arahan agar fokus pada layanan Cek Fakta)
        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#747474]">Hoaks Kesehatan Terbaru</h2>
        <div className="mt-6 h-px bg-[#d7d7d7]" />
        <LatestHoaxSlider items={articles.slice(0, 6)} />
        */}

        {/* Section Title & Subtitle Narasi Penelusuran Cek Fakta (Dengan Transisi Smooth) */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isFilterActive
              ? 'max-h-40 opacity-100 mb-5 pt-2'
              : 'max-h-0 opacity-0 mb-0 pt-0 pointer-events-none'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-[#333333]">
            {displayPopular.length} Isu Hoaks Ditemukan
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed max-w-3xl">
            {selectedCategory && searchQuery ? (
              <>
                Menampilkan laporan cek fakta untuk kategori <span className="font-bold text-slate-800">"{selectedCategory}"</span> dengan kata kunci <span className="font-bold text-slate-800">"{searchQuery}"</span>.
              </>
            ) : selectedCategory ? (
              <>
                Menampilkan laporan cek fakta resmi terverifikasi untuk kategori <span className="font-bold text-slate-800">"{selectedCategory}"</span>.
              </>
            ) : (
              <>
                Menampilkan laporan cek fakta yang cocok dengan pencarian <span className="font-bold text-slate-800">"{searchQuery}"</span>.
              </>
            )}
          </p>
          <div className="mt-4 h-px bg-[#d7d7d7]" />
        </div>

        <div className="mt-3">
          {paginatedPopular.length > 0 ? (
            <div className="space-y-5">
              {paginatedPopular.map((article) => {
                const CategoryIcon = article.CategoryIcon
                return (
                  <Link
                    key={article.title}
                    href={`/detail?slug=${article.slug}`}
                    className="group bg-white border border-slate-200/80 hover:border-[#07877c]/40 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 grid gap-6 sm:grid-cols-[280px_1fr] items-center"
                  >
                    <ArticleImage src={article.image} statusHoaks={article.statusHoaks} compact />
                    <div className="flex flex-col justify-between h-full py-1 min-w-0">
                      <div>
                        {/* Category Badge (Icon + Uppercase Text in Teal) */}
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#07877c] mb-2">
                          <CategoryIcon className="w-4 h-4 text-[#07877c]" />
                          <span>{article.categoryLabel}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold leading-snug text-[#333333] group-hover:text-[#07877c] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-2 text-sm font-medium text-slate-500 leading-relaxed">
                          {article.description}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-slate-400 border-t border-slate-100 pt-3.5">
                        <span>
                          {article.date} <span className="px-2">•</span> Dilihat {article.visitor || 0} Kali <span className="px-2">•</span> Waktu Baca 3 Menit
                        </span>
                        <span className="font-extrabold text-[#07877c] group-hover:translate-x-1 transition-transform flex items-center gap-1 whitespace-nowrap text-sm">
                          Baca Selengkapnya <ChevronRight className="w-4 h-4 inline" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-12 text-center shadow-sm bg-white">
              <h3 className="text-xl font-bold text-[#747474] mb-2">Hasil tidak ditemukan</h3>
              <p className="text-sm font-semibold text-[#9a9a9a]">
                Coba kata kunci lain atau pilih kategori hoaks yang memiliki data.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages >= 1 && (
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
                    className={`h-10 w-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${isActive
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

      <ReportHoaxModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
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

