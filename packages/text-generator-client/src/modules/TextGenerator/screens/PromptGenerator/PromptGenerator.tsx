import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography
} from '@mui/material'
import Markdown from 'react-markdown'
import { fromPairs, get, map, omit } from 'lodash'
import copy from 'copy-to-clipboard'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'
import { ChatCompletionStream } from 'openai/src/lib/ChatCompletionStream.js'
interface IPromptOptions {
  numberOfParagraphs: number
  templateType: string
}

export const PromptGenerator = () => {
  const [textOutput, setTextOutput] = useState('')
  console.log("🚀 ~ PromptGenerator ~ textOutput:", textOutput)
  const [prompt, setPrompt] = useState<string>('')
  const [promptOptions, setPromptOptions] = useState<IPromptOptions | object>({})


  const getTextPromptResponse = async (data) => {
    // console.log("🚀 ~ getTextPromptResponse ~ data:", data)
    const revisedData = omit(data, 'additionalFields')
    console.log("🚀 ~ getTextPromptResponse ~ revisedData:", revisedData)
    try {

      const config = {
        method: 'POST',
        body: JSON.stringify(revisedData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:1234/api/v1/text-generator', config)

      if(!response.ok) {
        throw new Error('Error fetching data')
      }

      const runner = ChatCompletionStream.fromReadableStream(response.body)
      runner.on('content', (delta, snapshot) => {
        // console.log(delta)
        // console.log(snapshot)
        setTextOutput(prevText => prevText + delta)
      })
      const finalChatCompletion = await runner.finalChatCompletion()
      console.log("🚀 ~ getTextPromptResponse ~ finalChatCompletion:", finalChatCompletion)

      const finalOutput = await runner.finalContent()
      console.dir(finalOutput, { depth: null })
      return finalOutput

    } catch (error) {
      console.log("🚀 ~ getTextPromptResponse ~ error:", error)
    }
  }


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const formData = fromPairs(map([...form.entries()], ([key, value]) => [key, value]))
    const selectedTemplate = get(coverLetterConfig, `promptTemplates[${formData.templateType}]`, [])
    const data = {
      ...formData, 
      ...selectedTemplate
    }
    getTextPromptResponse(data)
  }





  useEffect(() => {
    const selectedTemplateType = get(promptOptions, 'templateType', '')
    const newPrompt = get(coverLetterConfig, `promptTemplates[${selectedTemplateType}].prompt`, '')
    setPrompt(newPrompt)
  }, [promptOptions])

  const GeneratedPromptOutput = () => {
    const copyToClipboard = () => copy(prompt)
    return (
      <Box sx={{ my: { xs: 2, sm: 4 } }}>
        <Card>
          <CardActionArea onClick={copyToClipboard}>
            <CardContent>
              {/* <Typography align='left' paragraph>
                {textOutput}
              </Typography> */}
              <Markdown>
                {textOutput}
              </Markdown>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    )
  }

  return (
    <Container maxWidth='sm'  sx={{ my: { xs: 2, sm: 4 } }}>
      <h3>Prompt Generator Screen</h3>
      <PromptGeneratorForm handleSubmit={handleSubmit}/>
      <GeneratedPromptOutput />
    </Container>
  )
}
