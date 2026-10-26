import z from 'zod'

export function serializeFilters({ page, name, status }: CharacterFilters): string {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (name) params.set('name', name)
  if (status) params.set('status', status)
  return params.toString()
}

export function parseFilters(params: URLSearchParams): CharacterFilters {
  return CharacterFiltersSchema.parse({
    page: params.get('page') ?? undefined,
    name: params.get('name') ?? undefined,
    status: params.get('status') ?? undefined,
  })
}

export const CHARACTER_STATUSES = ['Alive', 'Dead', 'unknown'] as const
export const CHARACTER_GENDERS = ['Female', 'Male', 'Genderless', 'unknown'] as const

export const CharacterFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  name: z.string().trim().catch(''),
  status: z.enum(CHARACTER_STATUSES).or(z.literal('')).catch(''),
})

export type CharacterFilters = z.infer<typeof CharacterFiltersSchema>

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(CHARACTER_STATUSES),
  species: z.string(),
  type: z.string(),
  gender: z.enum(CHARACTER_GENDERS),
  image: z.string().url(),
})

export const CharacterPageSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
  }),
  results: z.array(CharacterSchema),
})
export type CharacterPage = z.infer<typeof CharacterPageSchema>

export type Character = z.infer<typeof CharacterSchema>

export type FilterValues = Pick<CharacterFilters, 'name' | 'status'>

export type CharacterFiltersFormProps = {
  value: FilterValues
  onChange: (next: FilterValues) => void
}

// ── Formulario de edición ─────────────────────────────────────────

export const CharacterFormSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  status: z.enum(CHARACTER_STATUSES, { error: 'Elegí un estado' }),
  species: z.string().trim().min(1, 'La especie es obligatoria').max(40),
  type: z.string().trim().max(60, 'Máximo 60 caracteres'),
  gender: z.enum(CHARACTER_GENDERS, { error: 'Elegí un género' }),
})

export type CharacterFormValues = z.infer<typeof CharacterFormSchema>

/** json-server 0.x genera ids numéricos y 1.x strings: normalizamos a string. */
const EntityIdSchema = z.union([z.string(), z.number()]).transform(String)

export const CharacterEditsSchema = CharacterFormSchema.extend({
  id: EntityIdSchema,
  characterId: z.number().int().positive(),
  updatedAt: z.string(),
})

export type CharacterEdit = z.infer<typeof CharacterEditsSchema>
