import { Category } from '@/lib/api/types';

export function flattenCategories(
  cats: Category[],
  depth = 0
): Array<Category & { _depth: number }> {
  return cats.flatMap(c => [
    { ...c, _depth: depth },
    ...(c.categories ? flattenCategories(c.categories, depth + 1) : []),
  ]);
}
