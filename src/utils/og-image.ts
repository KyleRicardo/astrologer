import { createWriteStream, existsSync, readFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { pipeline } from 'node:stream/promises'
import { Resvg } from '@resvg/resvg-js'
import satori, { type Font } from 'satori'
import { siteConfig } from '@/site.config'
import { useTranslations, type Lang } from '@/i18n/utils'

interface OgOptions {
  title: string
  description?: string
  lang: Lang
  type: 'post' | 'project'
  date?: Date
}

interface FontSource extends Pick<Font, 'name' | 'weight' | 'style' | 'lang'> {
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

let fontsPromise: Promise<Font[]> | undefined
let avatarDataUrl: string | undefined

async function ensureFonts() {
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

function getFonts() {
  if (!fontsPromise) {
    fontsPromise = ensureFonts()
  }
  return fontsPromise
}

function getAvatarDataUrl() {
  if (!avatarDataUrl) {
    const avatarPath = join(root, 'public/avatar.jpg')
    const avatarData = readFileSync(avatarPath)
    avatarDataUrl = `data:image/jpeg;base64,${avatarData.toString('base64')}`
  }
  return avatarDataUrl
}

export async function renderOgImage(options: OgOptions) {
  const { title, description, lang, type } = options
  const fonts = await getFonts()

  const t = useTranslations(lang)
  const label = t(`og.label.${type}`)

  const svg = await satori(
    {
      key: 'dynamic-og',
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          textAutospace: 'normal',
          padding: '80px 80px 100px 80px',
          gap: 24,
          background: 'linear-gradient(180deg, #161611 0%, #292924 100%)',
          fontFamily: 'Source Han Sans SC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '8px 24px',
                      borderRadius: 999,
                      border: '1px solid rgba(236, 236, 228, 0.2)',
                      backgroundColor: '#292924',
                      fontSize: 24,
                      fontWeight: 600,
                      color: '#dedfd7',
                    },
                    children: label,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'block',
                fontSize: 64,
                fontWeight: 700,
                color: '#dedfd7',
                maxWidth: 880,
                maxHeight: 200,
                letterSpacing: '-0.04em',
                lineClamp: 2,
                overflow: 'hidden',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'block',
                fontSize: 40,
                fontWeight: 400,
                color: '#909089',
                lineHeight: 1.5,
                lineClamp: 2,
                overflow: 'hidden',
              },
              children: description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: getAvatarDataUrl(),
                    width: 80,
                    height: 80,
                    style: {
                      borderRadius: '999px',
                      border: '2px solid rgba(236, 236, 228, 0.2)',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 32,
                            fontWeight: 600,
                            color: '#dedfd7',
                          },
                          children: siteConfig.author,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 24,
                            fontWeight: 400,
                            color: '#909089',
                          },
                          children: siteConfig.domain,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    },
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })

  return resvg.render().asPng()
}

export async function renderDefaultCover() {
  const fonts = await getFonts()

  const svg = await satori(
    {
      key: 'default-cover',
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          boxSizing: 'border-box',
          textAutospace: 'normal',
          backgroundColor: '#161611',
          fontFamily: 'Outline',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAutospace: 'normal',
                background:
                  'linear-gradient(180deg, #292924 0%, #292B26 18.7%, #2A2F2C 34.9%, #2B3635 48.8%, #2D3F41 60.56%, #2F4A4F 70.37%, #31555E 78.4%, #33626E 84.83%, #366E7F 89.84%, #387B8F 93.6%, #3A869E 96.3%, #3C91AC 98.1%, #3E9AB8 99.2%, #3FA1C1 99.76%, #40A5C7 99.97%, #40A7C9 100%)',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 36,
                    },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: getAvatarDataUrl(),
                          width: 256,
                          height: 256,
                          style: {
                            borderRadius: '999px',
                            border: '3px solid rgba(236, 236, 228, 0.2)',
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 48,
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: '#e6e4d9',
                          },
                          children: siteConfig.author,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1024,
      height: 576,
      fonts,
    },
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1024,
    },
  })

  return resvg.render().asPng()
}

export async function renderDefaultOg() {
  const fonts = await getFonts()

  const svg = await satori(
    {
      key: 'default-og',
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          textAutospace: 'normal',
          background: 'linear-gradient(180deg, #161611 0%, #292924 100%)',
          fontFamily: 'Outline',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: getAvatarDataUrl(),
                    width: 256,
                    height: 256,
                    style: {
                      borderRadius: '999px',
                      border: '3px solid rgba(236, 236, 228, 0.2)',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: 16,
                      fontSize: 48,
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: '#e6e4d9',
                    },
                    children: siteConfig.author,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: 4,
                      fontSize: 32,
                      fontWeight: 400,
                      color: '#878580',
                    },
                    children: siteConfig.subtitle,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: 8,
                      fontSize: 24,
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      color: '#b7b5ac',
                    },
                    children: siteConfig.domain,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    },
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })

  return resvg.render().asPng()
}
