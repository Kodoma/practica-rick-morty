import {
  type Character,
  type CharacterFilters,
  type CharacterPage,
  CharacterPageSchema,
  CharacterSchema,
} from './schema'

export async function fetchCharacterPage(
  { page, name, status }: CharacterFilters,
  signal?: AbortSignal,
): Promise<CharacterPage> {
  const queryParams = new URLSearchParams({ page: page.toString(), name, status })
  console.log(`Fetching characters with query params: ${queryParams.toString()}`)
  const response = await fetch(`https://rickandmortyapi.com/api/character/?${queryParams}`, {
    signal,
  })
  // La API responde 404 cuando la búsqueda no encuentra nada.
  // Para el usuario eso no es un error: es una lista vacía.
  if (response.status === 404) return { info: { count: 0, pages: 0 }, results: [] }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  // parse valida la respuesta: si la forma no coincide tira un error claro,
  // y si pasa, el resultado ya está tipado. `as` no chequeaba nada.
  return CharacterPageSchema.parse(await response.json())
}

export async function fetchCharacterById(id: number, signal?: AbortSignal): Promise<Character> {
  const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return CharacterSchema.parse(await response.json())
}
