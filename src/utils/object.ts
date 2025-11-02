/**
 * Gets a nested property from an object using a path string.
 * 使用路径字符串从对象中获取嵌套属性。
 * @param obj The object to get the property from.
 *            要从中获取属性的对象。
 * @param path The path to the property.
 *             属性的路径。
 * @returns The property value, or undefined if not found.
 *          属性值，如果未找到则为 undefined。
 */
export function getByPath(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
