// localStorage pode lançar erro (janela privada, dados bloqueados). O site funciona sem ele.

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // preferência só não fica salva
  }
}
