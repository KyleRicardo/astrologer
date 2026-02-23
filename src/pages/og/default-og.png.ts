import type { APIRoute } from 'astro'
import { renderDefaultOg } from '@/utils/og-image'

export const GET: APIRoute = async () => {
  const png = await renderDefaultOg()
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
