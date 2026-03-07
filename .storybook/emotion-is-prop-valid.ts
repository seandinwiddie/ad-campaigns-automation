const reactSpecificProps = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'defaultChecked',
  'defaultValue',
  'innerHTML',
  'ref',
  'suppressContentEditableWarning',
  'suppressHydrationWarning',
]);

const validHtmlAttributePattern = /^(data-|aria-|[a-z][a-z0-9_.-]*$)/;

export default function isPropValid(propName: string): boolean {
  if (reactSpecificProps.has(propName)) {
    return false;
  }

  return validHtmlAttributePattern.test(propName);
}
