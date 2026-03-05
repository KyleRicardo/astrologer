import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDefaultCover, renderDefaultOg } from '../src/utils/og-image'

const root = fileURLToPath(new URL('..', import.meta.url))
const og = await renderDefaultOg()
const cover = await renderDefaultCover()

writeFileSync(
  join(root, 'public/og-default.png'),
  Buffer.from(await og.arrayBuffer()),
)
writeFileSync(
  join(root, 'public/default-cover.png'),
  Buffer.from(await cover.arrayBuffer()),
)
console.log('Generated public/og-default.png and public/default-cover.png')
