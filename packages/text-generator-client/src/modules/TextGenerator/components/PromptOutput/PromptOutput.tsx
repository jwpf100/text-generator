import { Box, Card, CardActionArea, CardContent } from '@mui/material'
import copy from 'copy-to-clipboard'
import Markdown from 'react-markdown'

export interface IPromptOutputProps {
  textOutput: string
}
export const PromptOutput = ({ textOutput }: IPromptOutputProps) => {
  const copyToClipboard = () => copy(textOutput)
  return (
    textOutput.length > 0 && (
      <Box sx={{ my: { xs: 2, sm: 4 } }}>
        <Card>
          <CardActionArea onClick={copyToClipboard}>
            <CardContent>
              <Markdown>{textOutput}</Markdown>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    )
  )
}
