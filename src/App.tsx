import './App.css'
import { Pagination, Typography } from '@mui/material'
import { CharacterFiltersForm } from './features/character/components/CharacterFilterForm';
import { navigate, paths, useLocation } from './lib/router';
import { parseFilters, serializeFilters, type CharacterFilters } from './features/character/schema';
import { useCharacterList } from './features/character/query';
import { CharacterGrid } from './features/character/components/CharacterGrid';
import { CharacterDetail } from './features/character/components/CharacterDetail';

function App() {
  const { pathname, searchParams } = useLocation()
  const filters = parseFilters(searchParams)
  const { isPending, data } = useCharacterList(filters)
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
        {isPending || !data ? (
          <Typography variant="h6" component="p" sx={{ mt: 2 }}>
            Cargando personajes...
          </Typography>
        ) : (
         <CharacterGrid characters={data.results} />
        )}

      {data && data.results.length > 0 && (
        <Pagination
          sx={{ alignSelf: 'center' }}
          count={data.info.pages}
          page={filters.page}
          onChange={(_event, page) => {
            updateFilters({ page }, true);
          }}
        />
      )}
    </>
  )
}

export default App
