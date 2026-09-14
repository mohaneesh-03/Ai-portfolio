const rawBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) || ''
const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '')

export const API_ENDPOINT = `${sanitizedBaseUrl}/api/chat`
export const MAX_RETRIES = 3
export const MAX_MESSAGE_LENGTH = 4000
export const INITIAL_MESSAGE =
  "Hi! I'm Mohaneesh's AI portfolio assistant. Ask me about his background, skills, experience, or projects."
