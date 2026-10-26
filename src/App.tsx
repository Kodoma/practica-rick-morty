import './App.css'
import { Alert, Pagination, Typography } from '@mui/material'
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
      <>
        <h1>Personajes</h1>
        <CharacterDetail id={Number(detailMatch[1])} editing={!!detailMatch[2]} />
      </>
    )
  }

  return (
    <>
      <h1>Personajes</h1>
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
    </>
  )
}

export default App
