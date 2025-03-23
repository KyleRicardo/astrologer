
import { getCollection, type CollectionEntry } from "astro:content";

interface GroupedPosts {
  year: number,
  posts: CollectionEntry<'blog'>[],
}

// Format article list by year
const groupPostsByYear = (posts: CollectionEntry<'blog'>[]): GroupedPosts[] => {
  // Group posts by year
  const groupedByYear = posts.reduce<Record<number, CollectionEntry<'blog'>[]>>((acc, post) => {
    const year = post.data.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  // Convert to array and sort years in descending order
  return Object.entries(groupedByYear)
    .map(([year, posts]) => ({
      year: Number.parseInt(year),
      posts,
    }))
    .sort((a, b) => b.year - a.year);
};

// 获取分类下的文章列表
const getPostsByCategory = async (category: string): Promise<GroupedPosts[]> => {
  const posts = await getCollection("blog");
  const filteredPosts = posts.filter((i) => i.data.categories?.includes(category)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());;
  return groupPostsByYear(filteredPosts);
}

// 获取标签下的文章列表
const getPostsByTag = async (tag: string): Promise<GroupedPosts[]> => {
  const posts = await getCollection("blog");
  const filteredPosts = posts.filter((i) => i.data.tags?.includes(tag)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());;
  return groupPostsByYear(filteredPosts);
}

// 获取归档列表
const getArchives = async (): Promise<GroupedPosts[]> => {
  const posts = await getCollection("blog");
  const sortedPosts = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());;
  return groupPostsByYear(sortedPosts);
}

export { getPostsByCategory, getPostsByTag, getArchives };
