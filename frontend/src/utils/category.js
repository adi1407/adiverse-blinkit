export function categoryTitle(cat) {
  return cat?.name?.replace(/\n/g, " ") || "Products";
}
