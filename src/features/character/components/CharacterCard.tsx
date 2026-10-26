import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import type { Character } from '../schema'

export const CharacterCard = ({
  character,
  onClick,
}: {
  character: Character
  onClick?: () => void
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia component="img" image={String(character.image)} alt={String(character.name)} />
      <CardContent>
        <Typography variant="h6" component="h2">
          {String(character?.name)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {character?.species} - {character?.status}
        </Typography>
      </CardContent>
    </Card>
  )
}
