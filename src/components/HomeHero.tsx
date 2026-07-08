'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Link from 'next/link'
import hoaksData from '@/data/hoaks.json'

const heroImage =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1800&q=80'

interface HomeHeroProps {
  searchInput: string
  setSearchInput: (value: string) => void
  setSearchQuery?: (value: string) => void
}

export default function HomeHero({
  searchInput,
  setSearchInput,
  setSearchQuery,
}: HomeHeroProps) {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowSuggestions])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchInput.trim()) return

    if (setSearchQuery) {
      setSearchQuery(searchInput)
    } else {
      router.push(`/?q=${encodeURIComponent(searchInput.trim())}`)
    }
    setShowSuggestions(false)
  }

  const handlePopularSearchClick = (tag: string) => {
    setSearchInput(tag)
    if (setSearchQuery) {
      setSearchQuery(tag)
    } else {
      router.push(`/?q=${encodeURIComponent(tag)}`)
    }
    setShowSuggestions(false)
  }

  const suggestions =
    searchInput.trim().length >= 2
      ? hoaksData
          .filter((item) =>
            item.locale.id.title.toLowerCase().includes(searchInput.toLowerCase())
          )
          .slice(0, 5)
      : []

  return (
    <section className="mx-auto max-w-[1160px] px-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60">
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
                      setSearchQuery?.('')
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
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
