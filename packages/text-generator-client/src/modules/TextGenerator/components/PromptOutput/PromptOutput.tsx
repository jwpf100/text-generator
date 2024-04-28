import { Box, Card, CardActionArea, CardContent } from '@mui/material'
import copy from 'copy-to-clipboard'
import Markdown from 'react-markdown'

export interface IPromptOutputProps {
  textOutput: string
  visible: boolean
}
export const PromptOutput = ({ textOutput, visible }: IPromptOutputProps) => {
  const copyToClipboard = () => copy(textOutput)
  return (
    visible && (
      <Box>
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
