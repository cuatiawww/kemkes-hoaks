export interface KategoriItem {
  nama_kategori: string;
  slug: string;
}

export interface TagItem {
  lang: string;
  tag: string;
  total_tampil: number;
}

export interface KategoriInfo {
  nama: string;
  slug: string;
}

export interface ArtikelHoaksItem {
  lang: string;
  kategori: KategoriInfo;
  publish_date: string;
  publish_off_date: string;
  update_date: string;
  judul: string;
  isi: string;
  image: string;
  slug: string;
  tag: string[];
  visitor: number;
  status_hoaks: boolean;
  counter_fact: string[];
}

export interface BaseApiResponse<T> {
  sukses: number;
  message: string;
  data: T;
}

export interface ArtikelHoaksResponse {
  sukses: number;
  message: string;
  total_data: number;
  total_page: number;
  current_page: number;
  next_page: string;
  data: ArtikelHoaksItem[];
}

export interface FetchArtikelParams {
  judul?: string;
  tag?: string;
  order_by?: string; // 'publish_date', 'judul', 'visitor'
  sort_by?: string; // 'ASC', 'DESC'
  per_page?: string;
  page?: string;
  lang?: string; // 'id', 'eng'
}

export async function fetchArtikelHoaks(params: FetchArtikelParams = {}): Promise<ArtikelHoaksResponse> {
  const url = `/api/hoaks/content/artikel-hoaks`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      judul: params.judul || '',
      tag: params.tag || '',
      order_by: params.order_by || 'publish_date',
      sort_by: params.sort_by || 'DESC',
      per_page: params.per_page || '10',
      page: params.page || '1',
      lang: params.lang || 'id'
    })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchDetailArtikel(slug: string, lang: string = 'id'): Promise<BaseApiResponse<ArtikelHoaksItem[]>> {
  const url = `/api/hoaks/content/detail-artikel`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lang,
      slug
    })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchKumpulanTag(lang: string = 'id'): Promise<BaseApiResponse<TagItem[]>> {
  const url = `/api/hoaks/content/kumpulan-tag`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lang })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchKategori(): Promise<BaseApiResponse<KategoriItem[]>> {
  const url = `/api/hoaks/content/kategori`;
  const res = await fetch(url, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Helper to strip HTML tags and truncate for descriptions
export function stripHtmlAndTruncate(html: string, maxLength: number = 180): string {
  if (!html) return '';
  const clean = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
}

// Helper to format API date "YYYY-MM-DD HH:mm:ss" to UI friendly date, e.g. "05 Jun 2026"
export function formatDate(dateStr: string, lang: string = 'id'): string {
  if (!dateStr) return '';
  try {
    const cleanDateStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(cleanDateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = lang === 'id' ? monthsId[d.getMonth()] : monthsEn[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}