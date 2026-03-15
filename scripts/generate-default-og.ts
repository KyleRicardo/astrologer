import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDefaultCover, renderDefaultOg } from '../src/utils/og-image'
import { defaultLang } from '../src/i18n/ui'

const root = fileURLToPath(new URL('..', import.meta.url))
const og = await renderDefaultOg(defaultLang)
const cover = await renderDefaultCover(defaultLang)

writeFileSync(
  join(root, 'public/og-default.png'),
  Buffer.from(await og.arrayBuffer()),
)
writeFileSync(
  join(root, 'src/assets/default-cover.png'),
  Buffer.from(await cover.arrayBuffer()),
)
console.log('Generated public/og-default.png and src/assets/default-cover.png')
