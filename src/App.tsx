import { Container, Typography } from '@mui/material'
import { CharacterDetail } from './features/character/components/CharacterDetail'
import { CharacterList } from './features/character/components/CharacterList'
import { useLocation } from './lib/router'

function App() {
  const { pathname } = useLocation()
  const detailMatch = pathname.match(/^\/characters\/(\d+)(\/edit)?$/)

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Personajes
      </Typography>
      {detailMatch ? (
        <CharacterDetail id={Number(detailMatch[1])} editing={!!detailMatch[2]} />
      ) : (
        <CharacterList />
      )}
    </Container>
  )
}

export default App
