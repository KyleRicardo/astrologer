import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

const require = createRequire(import.meta.url)
const probe = require('probe-image-size') as (
  src: string,
) => Promise<{ width: number; height: number }>

interface CacheEntry {
  width: number
  height: number
}

const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache')
const CACHE_FILE = join(CACHE_DIR, 'image-dimensions.json')

function loadCache(): Map<string, CacheEntry> {
  try {
    if (existsSync(CACHE_FILE)) {
      const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
      return new Map(Object.entries(data))
    }
  } catch {
    // Cache corrupted — start fresh
  }
  return new Map()
}

function saveCache(cache: Map<string, CacheEntry>) {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true })
  }
  writeFileSync(
    CACHE_FILE,
    JSON.stringify(Object.fromEntries(cache), null, 2),
  )
}

function isRemoteUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}

export function rehypeImageSize() {
  const cache = loadCache()
  let cacheModified = false

  return async function(tree: Root) {
    const imgNodes: Element[] = []

    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'img'
        && typeof node.properties?.src === 'string'
        && isRemoteUrl(node.properties.src)
        && !node.properties.width
        && !node.properties.height
      ) {
        imgNodes.push(node)
      }
    })

    await Promise.all(
      imgNodes.map(async (node) => {
        const src = node.properties.src as string

        const cached = cache.get(src)
        if (cached) {
          node.properties.width = cached.width
          node.properties.height = cached.height
          return
        }

        try {
          const result = await probe(src)
          node.properties.width = result.width
          node.properties.height = result.height
          cache.set(src, { width: result.width, height: result.height })
          cacheModified = true
        } catch (err) {
          console.warn(`[rehype-image-size] Failed to probe: ${src}`, err)
        }
      }),
    )

    if (cacheModified) {
      saveCache(cache)
    }
  }
}
