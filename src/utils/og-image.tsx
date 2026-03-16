import { createWriteStream, existsSync, readFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { pipeline } from 'node:stream/promises'
import { ImageResponse } from '@takumi-rs/image-response'
import type { Font, ImageSource } from '@takumi-rs/core'
import { siteConfig, getSiteConfig } from '@/site.config'
import { useTranslations, type Lang } from '@/i18n/utils'

interface OgOptions {
  title: string
  description?: string
  lang: Lang
  type: 'post' | 'project'
  date?: Date
}

interface FontSource {
  name: string
  weight: number
  style: 'normal'
  filename: string
  url: string
}

const root = process.cwd()
const cacheDir = join(root, 'node_modules/.cache/fonts')

const FONT_SOURCES: FontSource[] = [
  {
    name: 'Outfit',
    weight: 400,
    style: 'normal',
    filename: 'Outfit-Regular.ttf',
    url:
      'https://raw.githubusercontent.com/Outfitio/Outfit-Fonts/main/fonts/ttf/Outfit-Regular.ttf',
  },
  {
    name: 'Outfit',
    weight: 600,
    style: 'normal',
    filename: 'Outfit-SemiBold.ttf',
    url:
      'https://raw.githubusercontent.com/Outfitio/Outfit-Fonts/main/fonts/ttf/Outfit-SemiBold.ttf',
  },
  {
    name: 'Source Han Sans SC',
    weight: 700,
    style: 'normal',
    filename: 'SourceHanSansSC-Bold.otf',
    url:
      'https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SimplifiedChinese/SourceHanSansSC-Bold.otf',
  },
  {
    name: 'Source Han Sans SC',
    weight: 400,
    style: 'normal',
    filename: 'SourceHanSansSC-Regular.otf',
    url:
      'https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf',
  },
]

async function ensureFonts(): Promise<Font[]> {
  await mkdir(cacheDir, { recursive: true })
  const fonts: Font[] = []
  for (const source of FONT_SOURCES) {
    const path = join(cacheDir, source.filename)
    if (!existsSync(path)) {
      const res = await fetch(source.url)
      if (!res.ok || !res.body) {
        throw new Error(`Failed to download font: ${source.url}`)
      }
      await pipeline(res.body, createWriteStream(path))
    }
    fonts.push({
      name: source.name,
      data: readFileSync(path),
      weight: source.weight,
      style: source.style,
    })
  }
  return fonts
}

// Load fonts once — reuse same reference for internal WeakSet caching
const fontsPromise = ensureFonts()

// Preload avatar as persistent image to avoid re-decoding per render
const avatarData = readFileSync(join(root, 'src/assets/avatar.jpg'))
const persistentImages: ImageSource[] = [
  {
    src: 'avatar',
    data: avatarData.buffer.slice(
      avatarData.byteOffset,
      avatarData.byteOffset + avatarData.byteLength,
    ),
  },
]

export async function renderOgImage(
  options: OgOptions,
): Promise<ImageResponse> {
  const { title, description, lang, type } = options
  const fonts = await fontsPromise

  const t = useTranslations(lang)
  const label = t(`og.label.${type}`)
  const { author } = getSiteConfig(lang)

  return new ImageResponse(
    <div
      tw='flex flex-col w-full h-full'
      style={{
        padding: '80px 80px 100px 80px',
        background: 'linear-gradient(180deg, #161611 0%, #292924 100%)',
        fontFamily: 'Source Han Sans SC',
      }}
    >
      <div tw='flex items-center'>
        <div
          tw='flex justify-center items-center rounded-full font-semibold'
          style={{
            padding: '8px 24px',
            fontSize: 24,
            border: '1px solid rgba(236, 236, 228, 0.2)',
            backgroundColor: '#292924',
            color: '#dedfd7',
          }}
        >
          {label}
        </div>
      </div>

      <div
        tw='font-bold mt-6'
        style={{
          fontSize: 64,
          color: '#dedfd7',
          maxWidth: 880,
          maxHeight: 200,
          letterSpacing: '-0.04em',
          textWrapStyle: 'balance',
          lineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {title}
      </div>

      {description && (
        <div
          tw='mt-6'
          style={{
            fontSize: 40,
            color: '#909089',
            lineHeight: 1.5,
            lineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {description}
        </div>
      )}

      <div tw='flex mt-auto items-center gap-4'>
        <img
          src='avatar'
          width={80}
          height={80}
          tw='rounded-full'
          style={{ border: '2px solid rgba(236, 236, 228, 0.2)' }}
        />
        <div tw='flex flex-col gap-1'>
          <div tw='font-semibold' style={{ fontSize: 32, color: '#dedfd7' }}>
            {author}
          </div>
          <div style={{ fontSize: 24, color: '#909089' }}>
            {siteConfig.domain}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      format: 'png',
      fonts,
      persistentImages,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  )
}

export async function renderDefaultCover(lang: Lang): Promise<ImageResponse> {
  const fonts = await fontsPromise
  const { author } = getSiteConfig(lang)

  return new ImageResponse(
    <div
      tw='w-full h-full flex relative'
      style={{
        backgroundColor: '#161611',
        fontFamily: 'Outfit',
      }}
    >
      <div
        tw='w-full h-full flex flex-col justify-center items-center'
        style={{
          background:
            'linear-gradient(180deg, #161612 0%, #171814 18.7%, #181D1B 34.9%, #1A2525 48.8%, #1D2F32 60.56%, #213C41 70.37%, #254952 78.4%, #295764 84.83%, #2D6677 89.84%, #317489 93.6%, #35819A 96.3%, #398EA9 98.1%, #3C98B6 99.2%, #3EA0C0 99.76%, #3FA5C7 99.97%, #40A7C9 100%)',
        }}
      >
        <div tw='flex flex-col items-center' style={{ gap: 36 }}>
          <img
            src='avatar'
            width={256}
            height={256}
            tw='rounded-full'
            style={{ border: '3px solid rgba(236, 236, 228, 0.2)' }}
          />
          <div
            tw='font-semibold'
            style={{
              fontSize: 48,
              letterSpacing: '-0.02em',
              color: '#e6e4d9',
            }}
          >
            {author}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1024,
      height: 576,
      format: 'png',
      fonts,
      persistentImages,
    },
  )
}

export async function renderDefaultOg(lang: Lang): Promise<ImageResponse> {
  const fonts = await fontsPromise
  const { author, subtitle } = getSiteConfig(lang)

  return new ImageResponse(
    <div
      tw='w-full h-full flex flex-col justify-center items-center'
      style={{
        background: 'linear-gradient(180deg, #161611 0%, #292924 100%)',
        fontFamily: 'Outfit',
      }}
    >
      <div tw='flex flex-col items-center'>
        <img
          src='avatar'
          width={256}
          height={256}
          tw='rounded-full'
          style={{ border: '3px solid rgba(236, 236, 228, 0.2)' }}
        />
        <div
          tw='font-semibold'
          style={{
            marginTop: 16,
            fontSize: 48,
            letterSpacing: '-0.02em',
            color: '#e6e4d9',
          }}
        >
          {author}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 32,
            color: '#878580',
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            letterSpacing: '0.05em',
            color: '#b7b5ac',
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      format: 'png',
      fonts,
      persistentImages,
    },
  )
}
