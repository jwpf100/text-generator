import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { fromPairs, get, map, omit } from 'lodash'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs'
import { PromptOutput } from '../../components/PromptOutput'
import { SwitchComponent } from '../../components/FormComponents/SwitchComponent'
import { IChatCompletionResponse, IPromptInputs, IPromptTemplateData } from '../../implementation/PromptGenerator.types'
import { PageLoader } from '../../../../components/PageLoader'

export const PromptGenerator = () => {
  const [showForm, setShowForm] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [textOutput, setTextOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const appTitle = 'Chat GPT Cover Letter Assistant'

  // 1 - Filling in form = show form && hide Response
  //     textOutput = '' / isLoading === false && show form === true

  // 2 - fething Data = hide form && show loading screen
  //     isLoading = true

  // 3 - data recieved = hide form ((button to show form)) && show response
  //     isLoading = false && textoutput.length > 0 && show form === false

  // 4 - data recieved = show form ((button to hide form)) && show response
  //     textoutput.length > 0 && isLoading = false &&  show form === true show form === true

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

  const renderShowFormSwitch = () => {
    import.meta.env.VITE_STREAMING_OPTION_ENABLED
    return (
      <Box sx={{ my: { xs: 0, sm: 0 } }}>
        <SwitchComponent label={'Show form'} checked={showForm} onChange={() => setShowForm(!showForm)} name={'showForm'} disabled={isLoading} />
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

    setIsLoading(true)
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
      setShowForm(false)
      setIsLoading(false)
    } catch (error) {
      setTextOutput(`Error: ${error}`)
      setShowForm(false)
      setIsLoading(false)
    }
  }

  const getTextPromptResponse = async (promptInputs: IPromptInputs) => {
    const revisedPromptInputs = omit(promptInputs, 'additionalFields')
    try {
      if (streaming) {
        await getStreamedResponse(revisedPromptInputs)
      } else {
        await getCompletionResponse(revisedPromptInputs)
      }
    } catch (error) {
      console.log('Prompt generation error: ', error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const formData = fromPairs(map([...form.entries()], ([key, value]) => [key, value]))
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
    getTextPromptResponse(data)
  }

  const PromptGeneratorContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <Container>
        <h3>{appTitle}</h3>
        {renderStreamingSwitch()}
        {renderShowFormSwitch()}
        {children}
      </Container>
    )
  }

  return (
    <PromptGeneratorContainer>
      {showForm && <PromptGeneratorForm handleSubmit={handleSubmit} visible={!isLoading && showForm} />}
      {isLoading && <PageLoader />}
      {textOutput.length > 0 && <PromptOutput textOutput={textOutput} visible={!isLoading && textOutput.length > 0} />}
    </PromptGeneratorContainer>
  )
}
