export function hasTemplate(template) {
  return ['vue', 'vue-ts', 'react', 'react-ts'].includes(template)
}

export function getSupportTs(template) {
  return ['vue-ts', 'react-ts'].includes(template)
}