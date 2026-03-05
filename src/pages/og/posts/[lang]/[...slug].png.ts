import type { Lang } from '@/i18n/utils'
import type { APIRoute } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'

import { renderOgImage } from '@/utils/og-image'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post) => {
    console.log(post.id)
    const [lang, ...rest] = post.id.split('/')
    return {
      params: { lang, slug: rest.join('/') },
      props: { post, lang },
    }
  })
}

export const GET: APIRoute = async ({ props }) => {
  if (!props) {
    return new Response('Not found', { status: 404 })
  }
  const { post, lang } = props as {
    post: CollectionEntry<'blog'>
    lang: Lang
  }
  return renderOgImage({
    title: post.data.title,
    lang,
    type: 'post',
    date: post.data.date,
  })
}
