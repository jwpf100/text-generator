import { Box, Card, CardActionArea, CardContent } from '@mui/material'
import copy from 'copy-to-clipboard'
import Markdown from 'react-markdown'
import { ButtonComponent } from '../../../../components/Inputs'

export interface IPromptOutputProps {
  textOutput: string
  visible: boolean
  reSubmitForm: () => void
}
export const PromptOutput = ({
  textOutput,
  visible,
  reSubmitForm
}: IPromptOutputProps) => {
  const copyToClipboard = () => copy(textOutput)
  const handleReSubmitForm = () => reSubmitForm()
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
        <ButtonComponent
          variant='contained'
          type={'button'}
          onClick={handleReSubmitForm}
          fullWidth
          sx={{ my: 1 }}
        >
          {'Regenerate response'}
        </ButtonComponent>
      </Box>
    )
  )
}
