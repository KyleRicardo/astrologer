import { getCollection, type CollectionEntry } from "astro:content";

export interface Category {
  name: string;
  count: number;
  children?: Category[];
}

export interface CategoryLink {
  text: string;
  href: string;
}

interface TreeNode {
  count: number;
  children: Map<string, TreeNode>;
}

function traverseCategoryTreeSlugs(categories: Category[] | undefined, currentSlug: string | undefined, slugs: string[]) {
  if (!categories)
    return;
  for (const category of categories) {
    const slug = currentSlug ? `${currentSlug}/${category.name}` : category.name;
    slugs.push(slug);
    traverseCategoryTreeSlugs(category.children, slug, slugs);
  }
}

export async function generateCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  const slugs: string[] = [];
  traverseCategoryTreeSlugs(categories, undefined, slugs);
  return slugs;
}

export async function getCategories(): Promise<Category[]> {
  const posts = await getCollection("blog");
  
  // Step 1: 构建树形结构
  const root: TreeNode = {
    count: 0,
    children: new Map(),
  };

  for (const post of posts) {
    const paths = getCategoryPaths(post);
    for (const path of paths) {
      let currentNode = root;
      for (const name of path) {
        const node = currentNode.children.get(name);
        if (!node) {
          const newNode = { count: 1, children: new Map() }
          currentNode.children.set(name, newNode)
          currentNode = newNode
        } else {
          node.count++;
          currentNode = node;
        }
      }
    }
  }

  // Step 2: 转换树结构并排序
  return convertTreeToCategory(root);
}

// 辅助函数：从 Post 中提取分类路径
function getCategoryPaths(post: CollectionEntry<'blog'>): string[][] {
  const categories = post.data.categories;
  if (!categories) return [];

  if (typeof categories === "string") {
    return [[categories]];
  }

  return categories.map((item) => Array.isArray(item) ? item : [item]);
}

// 辅助函数：转换树结构并排序
function convertTreeToCategory(node: TreeNode): Category[] {
  return Array.from(node.children.entries())
    .map(([name, treeNode]) => ({
      name,
      count: treeNode.count,
      treeNode,
    }))
    .sort((a, b) => {
      // 按 count 降序，count 相同按 name 升序
      return b.count - a.count || a.name.localeCompare(b.name);
    })
    .map(({ name, count, treeNode }) => {
      const category: Category = { name, count };
      if (treeNode.children.size > 0) {
        category.children = convertTreeToCategory(treeNode);
      }
      return category;
    });
}
