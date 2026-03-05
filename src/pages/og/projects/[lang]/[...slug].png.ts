import type { Lang } from '@/i18n/utils'
import type { APIRoute } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'

import { renderOgImage } from '@/utils/og-image'

export async function getStaticPaths() {
  const projects = await getCollection('project')
  return projects.map((project) => {
    const [lang, ...rest] = project.id.split('/')
    return {
      params: { lang, slug: rest.join('/') },
      props: { project, lang },
    }
  })
}

export const GET: APIRoute = async ({ props }) => {
  if (!props) {
    return new Response('Not found', { status: 404 })
  }
  const { project, lang } = props as {
    project: CollectionEntry<'project'>
    lang: Lang
  }
  return renderOgImage({
    title: project.data.title,
    description: project.data.description,
    lang,
    type: 'project',
  })
}
