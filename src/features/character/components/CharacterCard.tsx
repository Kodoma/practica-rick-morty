import { Card, CardActionArea, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { RouterLink } from '../../../lib/router'
import type { Character } from '../schema'

// as const: TypeScript sabe que los valores son exactamente estos, que es lo que pide `color`.
const statusColor = {
  Alive: 'success',
  Dead: 'error',
  unknown: 'default',
} as const

type Props = {
  character: Character
  /** Si viene, la card entera es un link (en la grilla). Sin href es solo lectura (en el detalle). */
  href?: string
}

export function CharacterCard({ character, href }: Props) {
  const content = (
    <>
      <CardMedia component="img" image={character.image} alt={character.name} loading="lazy" />
      <CardContent>
        <Typography variant="h6" component="h2" noWrap>
          {character.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {character.species}
        </Typography>
        <Chip
          size="small"
          label={character.status}
          color={statusColor[character.status]}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </>
  )

  return (
    <Card sx={{ height: '100%' }}>
      {href ? (
        <CardActionArea component={RouterLink} href={href} sx={{ height: '100%' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  )
}
