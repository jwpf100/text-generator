import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { get, omit } from 'lodash'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs'
import { PromptOutput } from '../../components/PromptOutput'
import { SwitchComponent } from '../../../../components/Inputs/SwitchComponent'
import { IChatCompletionResponse, IPromptInputs, IPromptTemplateData } from '../../implementation/PromptGenerator.types'
import { PageLoader } from '../../../../components/PageLoader'
import { IPromptGeneratorFormData } from '../../components/PromptGeneratorForm/PromptGeneratorForm'

export const PromptGenerator = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [textOutput, setTextOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [promptInputData, setPromptInputData] = useState({
    templateType: '',
    numberOfParagraphs: '',
    jobTitle: '',
    jobSource: '',
    jobDescription: '',
    resume: ''
  })

  const appTitle = 'Chat GPT Cover Letter Assistant'
  const isData = !isLoading && textOutput.length > 0

  const renderStreamingSwitch = () => {
    import.meta.env.VITE_STREAMING_OPTION_ENABLED
    return (
      <Box sx={{ my: { xs: 0, sm: 0 } }}>
        <SwitchComponent
          label={'Stream response'}
          checked={streaming}
          onChange={() => setStreaming(!streaming)}
          name={'streaming'}
          disabled={!import.meta.env.VITE_STREAMING_OPTION_ENABLED}
        />
      </Box>
    )
  }

  const getStreamedResponse = async (promptInputs: IPromptInputs) => {
    const config = {
      method: 'POST',
      body: JSON.stringify(promptInputs),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const baseUrl = import.meta.env.VITE_API_SERVER_URL
    const url = `${baseUrl}/api/v1/stream-text-generator`
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error('Error fetching data')
    }

    if (response.body !== null) {
      const runner = ChatCompletionStream.fromReadableStream(response.body)
      runner.on('content', (delta) => {
        setTextOutput((prevText) => prevText + delta)
      })

      const finalOutput = await runner.finalContent()
      // console.dir(finalOutput, { depth: null })
      return finalOutput
    }
    throw new Error('Error: No data returned')
  }

  const getCompletionResponse = async (promptInputs: IPromptInputs) => {
    const config = {
      method: 'POST',
      body: JSON.stringify(promptInputs),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const baseUrl = import.meta.env.VITE_API_SERVER_URL
    const url = `${baseUrl}/api/v1/completion-text-generator`


    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error('Error fetching data')
      }

      if (response.body !== null) {
        const data = (await response.json()) as IChatCompletionResponse
        const { message, finish_reason } = data

        if (finish_reason === 'stop') {
          if (get(message, 'content')) {
            setTextOutput(get(message, 'content', ''))
          } else if (typeof message === 'string') {
            setTextOutput(message)
          } else {
            setTextOutput('No data from completion')
          }
        } else {
          setTextOutput('Error getting response')
        }
      }
      setIsLoading(false)
    } catch (error) {
      setTextOutput(`Error: ${error}`)
    }
  }

  const getTextPromptResponse = async (promptInputs: IPromptInputs) => {
    const revisedPromptInputs = omit(promptInputs, 'additionalFields')
    try {
      setIsLoading(true)
      if (streaming) {
        await getStreamedResponse(revisedPromptInputs)
      } else {
        await getCompletionResponse(revisedPromptInputs)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('Prompt generation error: ', error)
    }
  }

  const handleSubmitNew = (formData: IPromptGeneratorFormData) => {
    console.log("🚀 ~ handleSubmitNew ~ formData:", formData)
    const selectedTemplate = get(coverLetterConfig, `promptTemplates[${formData.templateType}]`, { title: '' }) as IPromptTemplateData
    const data: IPromptInputs = {
      templateType: formData.templateType as string,
      numberOfParagraphs: formData.numberOfParagraphs as string,
      jobTitle: formData.jobTitle as string,
      jobSource: formData.jobSource as string,
      jobDescription: formData.jobDescription as string,
      resume: formData.resume as string,
      ...selectedTemplate
    }
    setPromptInputData(formData)
    getTextPromptResponse(data)
  }

  const PromptGeneratorContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <Container>
        <h3>{appTitle}</h3>
        {renderStreamingSwitch()}
        {children}
      </Container>
    )
  }

  return (
    <PromptGeneratorContainer>
      {isLoading && <PageLoader />}
      <PromptGeneratorForm inititalValues={promptInputData} handleSubmit={handleSubmitNew} isLoading={isLoading} isData={isData}/>
      {isData && <PromptOutput textOutput={textOutput} visible={!isLoading && textOutput.length > 0} />}
    </PromptGeneratorContainer>
  )
}
