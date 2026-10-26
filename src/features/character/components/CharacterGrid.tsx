import { Card, CardActionArea, CardMedia, Chip, Grid, Typography } from '@mui/material'
import { paths, RouterLink } from '../../../lib/router'
import type { Character } from '../schema'

export function CharacterGrid({ characters }: { characters: Character[] }) {
  return characters.length === 0 ? (
    <Typography variant="h6" component="p" sx={{ mt: 2 }}>
      No se encontraron personajes.
    </Typography>
  ) : (
    <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {characters.map((character) => (
        <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} component="li">
          <Card sx={{ p: 2 }}>
            <CardActionArea
              component={RouterLink}
              href={paths.detail(character.id)}
              sx={{ flexGrow: 1 }}
            >
              <CardMedia component="img" src={character.image} alt={character.name} />
              <Typography variant="h5">{character.name}</Typography>
              <Chip
                label={character.status}
                color={
                  character.status === 'Alive'
                    ? 'success'
                    : character.status === 'Dead'
                      ? 'error'
                      : 'default'
                }
              />
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
