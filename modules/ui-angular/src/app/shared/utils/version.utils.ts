export const getMajorVersionNumber = (version: string) => {
  return +version.substring(0, version.indexOf('.'));
}
