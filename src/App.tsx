import { Alert, Container, Pagination, Stack, Typography } from '@mui/material'
import { CharacterDetail } from './features/character/components/CharacterDetail'
import { CharacterFiltersForm } from './features/character/components/CharacterFilterForm'
import { CharacterGrid } from './features/character/components/CharacterGrid'
import { useCharacterList } from './features/character/query'
import { type CharacterFilters, parseFilters, serializeFilters } from './features/character/schema'
import { navigate, paths, useLocation } from './lib/router'

function App() {
  const { pathname, searchParams } = useLocation()
  const filters = parseFilters(searchParams)
  const { isPending, isError, error, data } = useCharacterList(filters)
  const detailMatch = pathname.match(/^\/characters\/(\d+)(\/edit)?$/)

  const updateFilters = (patch: Partial<CharacterFilters>, replace = false) => {
    navigate(paths.list(serializeFilters({ ...filters, ...patch })), { replace })
  }

  if (detailMatch) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Personajes
        </Typography>
        <CharacterDetail id={Number(detailMatch[1])} editing={!!detailMatch[2]} />
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Personajes
        </Typography>
        <CharacterFiltersForm
          value={filters}
          onChange={(next) => updateFilters({ ...next, page: 1 }, true)}
        />
        {isPending ? (
          <Typography variant="h6" component="p" sx={{ mt: 2 }}>
            Cargando personajes...
          </Typography>
        ) : isError ? (
          // Antes este caso caía en "Cargando..." para siempre.
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <CharacterGrid characters={data.results} />
        )}

        {data && data.results.length > 0 && (
          <Pagination
            sx={{ alignSelf: 'center' }}
            count={data.info.pages}
            page={filters.page}
            onChange={(_event, page) => {
              updateFilters({ page }, true)
            }}
          />
        )}
      </Stack>
    </Container>
  )
}

export default App
