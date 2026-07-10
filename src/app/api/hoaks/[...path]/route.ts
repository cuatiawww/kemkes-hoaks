import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const pathStr = path.join('/')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://d3v-kemkes.mediaciptainformasi.co.id/web-api'
    const token = process.env.NEXT_PUBLIC_API_TTOKEN || ''

    const bodyText = await request.text()

    const res = await fetch(`${baseUrl}/${pathStr}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'TTOKEN': token
      },
      body: bodyText
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`Proxy POST ${pathStr} failed:`, errText)
      return NextResponse.json({ error: `Backend returned status ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Proxy POST exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const pathStr = path.join('/')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://d3v-kemkes.mediaciptainformasi.co.id/web-api'
    const token = process.env.NEXT_PUBLIC_API_TTOKEN || ''

    const res = await fetch(`${baseUrl}/${pathStr}`, {
      method: 'GET',
      headers: {
        'TTOKEN': token
      }
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`Proxy GET ${pathStr} failed:`, errText)
      return NextResponse.json({ error: `Backend returned status ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Proxy GET exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}