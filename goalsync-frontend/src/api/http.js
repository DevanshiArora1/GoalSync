export async function parseResponse(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid response from server')
  }
}

export async function apiRequest(path, options = {}) {
  const { parseJson = true, ...fetchOptions } = options
  const response = await fetch(path, fetchOptions)

  if (!parseJson) {
    return response
  }

  const data = await parseResponse(response)
  return { response, data }
}
