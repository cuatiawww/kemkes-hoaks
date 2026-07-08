'use client'

import {
  CheckCircle2,
  CircleUserRound,
  Home,
  Info,
  Menu,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { label: 'Beranda', icon: Home, href: '/' },
  { label: 'Profil', icon: Info, href: '#' },
  { label: 'Informasi Publik', icon: CheckCircle2, href: '#' },
  { label: 'Layanan', icon: ShieldCheck, href: '#' },
  { label: 'Media', icon: PlayCircle, href: '#' },
  { label: 'Tautan', icon: CircleUserRound, href: '#' },
  { label: 'Kontak Kami', icon: Phone, href: '#' },
]

export default function SiteHeader() {
  return (
    <header className="w-full">
      <div className="bg-[#07877c] text-white">
        <div className="mx-auto flex h-[70px] max-w-[1160px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-kemkes.jpeg"
              alt="Logo Kementerian Kesehatan"
              className="h-[48px] w-auto object-contain rounded-md"
            />
          </Link>

          <div className="flex items-center gap-6">
            <p className="hidden text-xl font-bold italic tracking-tight md:block text-white/90">
              Kemenkes Hebat, Indonesia Sehat
            </p>
            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-52 items-center rounded-full border border-white/80 bg-[#056e68] px-4 text-white lg:flex">
                <input
                  aria-label="Pencarian"
                  placeholder="Pencarian..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/80"
                />
                <Search className="h-5 w-5" />
              </div>
              <button className="rounded-full bg-[#d6ef21] px-3 py-1 text-xs font-bold text-[#08786f]">
                ID
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-4 py-4">
          <div className="hidden w-full items-center justify-between lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-[#1d1d1d] transition hover:text-[#07877c]"
              >
                <item.icon className="h-4 w-4 fill-[#07877c] text-[#07877c]" />
                {item.label}
              </Link>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-bold uppercase text-[#07877c] lg:hidden">
            <Menu className="h-5 w-5" />
            Menu
          </button>
        </div>
      </nav>
    </header>
  )
}
