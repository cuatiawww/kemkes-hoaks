import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Facebook,
  FileText,
  Home,
  Info,
  Instagram,
  Languages,
  Menu,
  Newspaper,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  Youtube,
} from 'lucide-react'

const heroImage =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1800&q=80'

const latestHoaxes = [
  {
    title: '[HOAKS] Tautan Untuk Klaim Alat Bantu Disabilitas dari Pemerintah',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '[HOAKS] Virus Marburg Dapat Diaktifkan melalui 5G',
    image:
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=80',
  },
]

const categories = [
  { label: 'Vaksinasi', count: 15, icon: UsersRound, active: true },
  { label: 'Obat-obatan', count: 3, icon: Stethoscope, active: true },
  { label: 'Pengobatan', count: 4, icon: ShieldCheck, active: true },
  { label: 'Kedokteran', count: 0, icon: FileText, active: false },
  { label: 'Kegiatan', count: 1, icon: CalendarDays, active: true },
  { label: 'Artikel Berita', count: 0, icon: Newspaper, active: false },
]

const popularHoaxes = [
  {
    title: '[HOAKS] Diabetes Tipe 1 Dan 2 Bisa Sembuh Tanpa Obat',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: '[HOAKS] Episode The Simpsons Prediksi Penyebaran Hantavirus',
    image:
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: '[HOAKS] Video Klaim Rekayasa Produksi Hantavirus Gunakan APD',
    image:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: '[HOAKS] WHO Anjurkan Konsumsi Ivermectin Tiap Hari untuk Cegah Hantavirus',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: '[HOAKS] Vaksin TBC Mengandung Nanobots',
    image:
      'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=700&q=80',
  },
]

const navItems = [
  { label: 'Beranda', icon: Home },
  { label: 'Profil', icon: Info },
  { label: 'Informasi Publik', icon: CheckCircle2 },
  { label: 'Layanan', icon: ShieldCheck },
  { label: 'Media', icon: PlayCircle },
  { label: 'Tautan', icon: CircleUserRound },
  { label: 'Kontak Kami', icon: Phone },
]

function HoaxStamp() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-[13deg] border-[10px] border-[#c91212] px-8 py-1 text-5xl font-black uppercase tracking-wider text-[#c91212] opacity-95 mix-blend-multiply">
      Hoaks
    </div>
  )
}

function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 grid-cols-2 gap-0.5">
        <span className="rounded-br-full rounded-tl-full bg-[#8fc63d]" />
        <span className="rounded-bl-full rounded-tr-full bg-[#f4d21f]" />
        <span className="rounded-bl-full rounded-tr-full bg-[#18b6a7]" />
        <span className="rounded-br-full rounded-tl-full bg-[#2f9ed8]" />
      </div>
      <span className="text-xl font-extrabold text-[#34a6c7]">Kemenkes</span>
    </div>
  )
}

function ArticleImage({ src, compact = false }: { src: string; compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${compact ? 'h-28 w-56 rounded-l-2xl' : 'h-52 w-full'}`}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label="Ilustrasi artikel hoaks kesehatan"
    >
      <div className="absolute inset-0 bg-black/5" />
      <HoaxStamp />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#4f4f4f]">
      <header>
        <div className="bg-[#07877c] text-white">
          <div className="mx-auto flex h-[70px] max-w-[1160px] items-center justify-between px-4">
            <LogoMark />
            <p className="hidden text-2xl font-bold italic tracking-tight md:block">
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
              <button className="rounded-full bg-[#d6ef21] px-3 py-1 text-xs font-bold text-[#08786f]">ID</button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#8dc9ff] bg-[#0058ff] text-white">
                <CircleUserRound className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>

        <nav className="bg-white">
          <div className="mx-auto flex max-w-[1160px] items-center justify-between px-4 py-4">
            <div className="hidden w-full items-center justify-between lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-[#1d1d1d] transition hover:text-[#07877c]"
                >
                  <item.icon className="h-4 w-4 fill-[#07877c] text-[#07877c]" />
                  {item.label}
                </a>
              ))}
            </div>
            <button className="flex items-center gap-2 text-sm font-bold uppercase text-[#07877c] lg:hidden">
              <Menu className="h-5 w-5" />
              Menu
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-[1160px] px-4">
        <div className="bg-white">
          <div className="inline-flex bg-[#07877c] px-4 py-2 text-xs font-extrabold uppercase text-white">
            Informasi Terkini
          </div>
          <div
            className="relative min-h-[360px] overflow-hidden bg-cover bg-center"
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
              <div className="mt-9 flex w-full max-w-[870px] flex-col gap-5 sm:flex-row">
                <input
                  placeholder="Ketikkan kata kunci Anda di sini"
                  className="h-[58px] flex-1 rounded-2xl border-2 border-[#145d63] bg-white px-6 text-base italic text-slate-700 shadow-sm outline-none placeholder:text-slate-400"
                />
                <button className="h-[58px] rounded-2xl bg-[#1ebdb8] px-14 text-2xl font-bold text-white shadow-sm transition hover:bg-[#18aaa5]">
                  Cari
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-base font-semibold">
                <span>Pencarian populer:</span>
                {['Vaksin', 'HIV', 'Virus', 'BPJS', 'Imunisasi'].map((tag) => (
                  <a key={tag} href="#" className="rounded-md bg-white px-3 py-2 text-sm font-bold text-[#1ebdb8]">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 pb-28 pt-12">
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#747474]">Hoaks Kesehatan Terbaru</h2>
        <div className="mt-6 h-px bg-[#d7d7d7]" />
        <div className="mt-3 grid gap-14 md:grid-cols-2">
          {latestHoaxes.map((article) => (
            <article key={article.title}>
              <ArticleImage src={article.image} />
              <h3 className="mt-8 text-lg font-extrabold leading-tight text-[#3b3b3b]">{article.title}</h3>
              <p className="mt-1 text-sm font-medium text-[#8d8d8d]">1 Jul 2026 <span className="px-2">•</span> Waktu Baca 3 Menit</p>
              <div className="mt-4 h-px bg-[#d7d7d7]" />
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold uppercase tracking-wide text-[#747474]">
          Hoaks Kesehatan Terpopuler
        </h2>
        <div className="mt-6 h-px bg-[#d7d7d7]" />

        <div className="mt-10 grid gap-14 lg:grid-cols-[320px_1fr]">
          <aside>
            <h3 className="mb-6 text-lg font-bold text-[#747474]">Kategori Hoaks</h3>
            <div className="space-y-0">
              {categories.map((category) => (
                <a
                  key={category.label}
                  href="#"
                  className="flex items-center justify-between border-b border-[#d9d9d9] py-5 text-[#747474]"
                >
                  <span className="flex items-center gap-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7ddbd4] text-white">
                      <category.icon className="h-5 w-5" />
                    </span>
                    <span className="text-base font-semibold">{category.label}</span>
                  </span>
                  <span className={`text-base font-extrabold ${category.active ? 'text-[#23bbb5]' : 'text-[#ef3b3b]'}`}>
                    ({category.count})
                    <ChevronRight className="ml-1 inline h-4 w-4 rounded-full bg-current p-0.5 text-white" />
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-12">
            {popularHoaxes.map((article) => (
              <article
                key={article.title}
                className="grid overflow-hidden rounded-2xl border border-[#d8d8d8] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:grid-cols-[225px_1fr]"
              >
                <ArticleImage src={article.image} compact />
                <div className="px-5 py-5">
                  <h3 className="text-lg font-extrabold leading-snug text-[#333] underline decoration-[#333]/50 underline-offset-2">
                    {article.title}
                  </h3>
                  <p className="mt-3 truncate text-lg font-semibold text-[#878787]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing...
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#9a9a9a]">
                    11 Sep 2025 <span className="px-4">•</span> Dilihat 708 Kali <span className="px-4">•</span> Waktu Baca 3 Menit
                  </p>
                </div>
              </article>
            ))}
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
              {[Facebook, Instagram, Languages, Youtube, PlayCircle, CircleUserRound].map((Icon, index) => (
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
