import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDefaultCover, renderDefaultOg } from '../src/utils/og-image'

const root = fileURLToPath(new URL('..', import.meta.url))
const og = await renderDefaultOg()
const cover = await renderDefaultCover()

writeFileSync(join(root, 'public/og-default.png'), new Uint8Array(og))
writeFileSync(join(root, 'public/default-cover.png'), new Uint8Array(cover))
console.log('Generated public/og-default.png and public/default-cover.png')
