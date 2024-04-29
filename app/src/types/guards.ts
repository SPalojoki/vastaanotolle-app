import type { Form } from './index'

function isValidISODate(dateString: string): boolean {
  const isoDatePattern =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?Z$/
  return isoDatePattern.test(dateString)
}

export const isForm = (obj: any): obj is Form => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.accessCode === 'string' &&
    typeof obj.published === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    isValidISODate(obj.createdAt) &&
    typeof obj.updatedAt === 'string' &&
    isValidISODate(obj.updatedAt)
  )
}

export const isFormArray = (arr: any[]): arr is Form[] => {
  return arr.every(isForm)
}
