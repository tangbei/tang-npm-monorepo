export function hasTemplate(template) {
  return ['react', 'react-ts'].includes(template)
}

export function getSupportTs(template) {
  return ['react-ts'].includes(template)
}

export function getFramework(template) {
  if (template.startsWith('react')) return 'react'
  return 'react'
}

export function isTypeScript(template) {
  return template.endsWith('-ts')
}

export { generateTemplate } from './template-generator.js';