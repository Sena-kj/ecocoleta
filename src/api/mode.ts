// Flag de modo: mock (default) vs live. Trocar para backend real = setar
// VITE_API_MODE=live no .env e implementar o ramo `client` em endpoints.
export const IS_MOCK = import.meta.env.VITE_API_MODE !== 'live'

/** Simula latência de rede para o modo mock parecer real. */
export function delay(ms = 420): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
