import { useState } from 'react'
import {
  Container
} from '@mui/material'
import { fromPairs, get, map, omit } from 'lodash'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'
import { ChatCompletionStream } from 'openai/src/lib/ChatCompletionStream.js'
import { PromptOutput } from '../../components/PromptOutput'

export interface IFormData {
  templateType: string
  numberOfParagraphs?: string | number
  jobTitle?: string
  jobSource?: string
  jobDescription?: string
  resume?: string
}

export interface IPromptTemplateData {
  title: string
  system?: string
  user?: string
  resumeIntro?: string
  jobDescriptionIntro?: string
  additionalFields?: string[]
}
export interface IPromptInputs extends IFormData, IPromptTemplateData {} 

export const PromptGenerator = () => {
  const [textOutput, setTextOutput] = useState('')

  const getTextPromptResponse = async (promptInputs: IPromptInputs) => {
    const revisedPromptInputs = omit(promptInputs, 'additionalFields')
    try {
      const config = {
        method: 'POST',
        body: JSON.stringify(revisedPromptInputs),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:1234/api/v1/text-generator', config)

      if(!response.ok) {
        throw new Error('Error fetching data')
      }

      if(response.body !== null) {
        const runner = ChatCompletionStream.fromReadableStream(response.body)
        runner.on('content', (delta) => {
          setTextOutput(prevText => prevText + delta)
        })
  
        const finalOutput = await runner.finalContent()
        // console.dir(finalOutput, { depth: null })
        return finalOutput
      }
      throw new Error('Error: No data returned')
    } catch (error) {
      console.log("Prompt generation error: ", error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const formData = fromPairs(map([...form.entries()], ([key, value]) => [key, value]))
    const selectedTemplate = get(coverLetterConfig, `promptTemplates[${formData.templateType}]`, {title: ''}) as IPromptTemplateData
    const data: IPromptInputs = {
      templateType: formData.templateType as string,
      numberOfParagraphs: formData.numberOfParagraphs as string,
      jobTitle: formData.jobTitle as string,
      jobSource: formData.jobSource as string,
      jobDescription: formData.jobDescription as string,
      resume: formData.resume as string,
      ...selectedTemplate
    }
    getTextPromptResponse(data)
  }

  return (
    <Container maxWidth='sm'  sx={{ my: { xs: 2, sm: 4 } }}>
      <h3>Prompt Generator Screen</h3>
      <PromptGeneratorForm handleSubmit={handleSubmit}/>
      <PromptOutput textOutput={textOutput} />
    </Container>
  )
}
