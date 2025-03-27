import { getCollection, type CollectionEntry } from "astro:content";

export interface Category {
  name: string;
  count: number;
  children?: Category[];
}

interface TreeNode {
  count: number;
  children: Map<string, TreeNode>;
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
        if (!currentNode.children.has(name)) {
          currentNode.children.set(name, { count: 0, children: new Map() });
        }
        const node = currentNode.children.get(name)!;
        node.count++;
        currentNode = node;
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
