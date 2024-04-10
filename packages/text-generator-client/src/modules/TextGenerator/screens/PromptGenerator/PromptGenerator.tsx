import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography
} from '@mui/material'
import { get } from 'lodash'
import copy from 'copy-to-clipboard'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'

interface IPromptOptions {
  numberOfParagraphs: number
  templateType: string
}

export const PromptGenerator = () => {

  const [prompt, setPrompt] = useState<string>('')
  const [promptOptions, setPromptOptions] = useState<IPromptOptions | object>({})

  useEffect(() => {
    const selectedTemplateType = get(promptOptions, 'templateType', '')
    console.log("🚀 ~ useEffect ~ selectedTemplateType:", selectedTemplateType)
    console.log("🚀 ~ useEffect ~ coverLetterConfig:", coverLetterConfig)
    console.log("🚀 ~ useEffect ~ `promptTemplate[${selectedTemplateType}].prompt`:", `promptTemplates[${selectedTemplateType}].prompt`)
    const newPrompt = get(coverLetterConfig, `promptTemplates[${selectedTemplateType}].prompt`, '')
    setPrompt(newPrompt)
    console.log("🚀 ~ useEffect ~ newPrompt:", newPrompt)
  }, [promptOptions])

  const GeneratedPromptOutput = () => {
    const copyToClipboard = () => copy(prompt)
    return (
      <Box sx={{ my: { xs: 2, sm: 4 } }}>
        <Card>
          <CardActionArea onClick={copyToClipboard}>
            <CardContent>
              <Typography align='left' paragraph>
                {prompt}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    )
  }

  return (
    <Container maxWidth='sm'  sx={{ my: { xs: 2, sm: 4 } }}>
      <h3>Prompt Generator Screen</h3>
      <PromptGeneratorForm setFormData={setPromptOptions}/>
      <GeneratedPromptOutput />
    </Container>
  )
}
