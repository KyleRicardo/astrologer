/**
 * Represents a heading extracted from content
 */
export interface TocHeading {
  depth: number
  slug: string
  text: string
  children: TocHeading[]
}

/**
 * Build a nested tree structure from a flat list of headings.
 * Only includes h1, h2, h3 (depth 1-3).
 */
export function buildTocTree(
  headings: Array<{ depth: number; slug: string; text: string }>,
): TocHeading[] {
  const filtered = headings.filter(h => h.depth >= 2 && h.depth <= 3)
  const root: TocHeading[] = []
  const stack: TocHeading[] = []

  for (const heading of filtered) {
    const node: TocHeading = {
      depth: heading.depth,
      slug: heading.slug,
      text: heading.text,
      children: [],
    }

    // Pop until we find a parent with smaller depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }

    stack.push(node)
  }

  return root
}
