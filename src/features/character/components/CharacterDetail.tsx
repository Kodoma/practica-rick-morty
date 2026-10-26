import { Alert, Button, Chip, Stack, Typography } from '@mui/material'
import { navigate, paths, RouterLink } from '../../../lib/router'
import { useCharacterById, useEdits, useSaveEdit } from '../query'
import { CharacterCard } from './CharacterCard'
import { CharacterForm } from './CharacterForm'

export function CharacterDetail({ id, editing }: { id: number; editing: boolean }) {
  const { isPending, isError, data: character, error } = useCharacterById(id)
  const { data: edits, isPending: editsPending } = useEdits()
  const save = useSaveEdit()

  const edit = edits?.find((e) => e.characterId === id)

  // Esperamos también a las ediciones. Si no, al editar antes de que carguen,
  // `edit` es undefined y se crea un duplicado (POST en vez de PUT).
  // Pasa lo mismo si alguien entra directo a /characters/1/edit.
  if (isPending || editsPending) {
    return (
      <Typography variant="h6" component="p" sx={{ mt: 2 }}>
        Cargando personaje...
      </Typography>
    )
  }
  if (isError) return <Alert severity="error">{error.message}</Alert>

  // La edición local pisa los datos de la API (menos el id, que en json-server es otro).
  const shown = edit ? { ...character, ...edit, id: character.id } : character

  return (
    <Stack spacing={2} sx={{ maxWidth: 480, mx: 'auto' }}>
      <Button component={RouterLink} href={paths.list()} sx={{ alignSelf: 'flex-start' }}>
        ← Volver
      </Button>

      {editing ? (
        <>
          {save.isError && <Alert severity="error">{save.error.message}</Alert>}
          <CharacterForm
            defaultValues={{
              name: shown.name,
              status: shown.status,
              species: shown.species,
              type: shown.type,
              gender: shown.gender,
            }}
            onSubmit={async (values) => {
              await save.mutateAsync({ characterId: id, values, existingId: edit?.id })
              navigate(paths.detail(id))
            }}
            onCancel={() => navigate(paths.detail(id))}
          />
        </>
      ) : (
        <>
          <CharacterCard character={shown} />
          <Typography variant="body2" color="text.secondary">
            {shown.gender}
            {shown.type ? ` - ${shown.type}` : ''}
          </Typography>
          {edit && (
            <Chip
              label={`Editado localmente · ${new Date(edit.updatedAt).toLocaleString()}`}
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
          <Button variant="contained" component={RouterLink} href={paths.edit(id)}>
            Editar
          </Button>
        </>
      )}
    </Stack>
  )
}
