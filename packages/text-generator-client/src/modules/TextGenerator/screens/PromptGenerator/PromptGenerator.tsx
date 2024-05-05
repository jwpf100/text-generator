import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { get, merge, omit } from 'lodash'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { PromptGeneratorForm } from '../../components/PromptGeneratorForm'
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs'
import { PromptOutput } from '../../components/PromptOutput'
import { SwitchComponent } from '../../../../components/Inputs/SwitchComponent'
import {
  IChatCompletionResponse,
  IPromptInputs,
  IPromptTemplateData
} from '../../implementation/PromptGenerator.types'
import { PageLoader } from '../../../../components/PageLoader'
import { IPromptGeneratorFormData } from '../../implementation/PromptGenerator.types'

export const PromptGenerator = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [textOutput, setTextOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [manualSentance, setManualSentance] = useState(true)
  const [promptInputData, setPromptInputData] = useState({
    templateType: '',
    numberOfParagraphs: '',
    applicantName: '',
    jobCompanyName: '',
    jobTitle: '',
    jobSource: '',
    jobDescription: '',
    resume: ''
  })

  const appTitle = 'Chat GPT Cover Letter Assistant'
  const isData = !isLoading && textOutput.length > 0

  const renderStreamingSwitch = () => {
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
  const renderAddManualSentanceSwitch = () => {
    return (
      <Box sx={{ my: { xs: 0, sm: 0 } }}>
        <SwitchComponent
          label={'Add ChatGPT Project Details'}
          checked={manualSentance}
          onChange={() => setManualSentance(!manualSentance)}
          name={'manualSentance'}
        />
      </Box>
    )
  }

  // TODO: Add more intro prompts?
  const generateIntro = (promptInputs: IPromptInputs) => {
    const addOverrideSentance = manualSentance
    const overrideSentance = get(promptInputs, 'overrideSentance')
    let intro = 'Dear Sir/Madam,\n\n'
    if (addOverrideSentance) {
      intro = `${intro}${overrideSentance}\n\n`
    }
    return intro
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
          const intro = generateIntro(promptInputs)
          if (get(message, 'content')) {
            const revisedMessage = `${intro}${get(message, 'content')}`
            setTextOutput(revisedMessage)
          } else if (typeof message === 'string') {
            const revisedMessage = `${intro}${get(message, 'content')}`
            setTextOutput(revisedMessage)
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
    // TODO: Change where this is passed in.
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

  const handleSubmit = (formData: IPromptGeneratorFormData) => {
    const selectedTemplate = get(
      coverLetterConfig,
      `promptTemplates[${formData.templateType}]`,
      { title: '' }
    ) as IPromptTemplateData
    const overrideSentance = get(coverLetterConfig, 'overrideSentance', '')

    const data: IPromptInputs = merge({}, formData, selectedTemplate, {overrideSentance: overrideSentance})

    setPromptInputData(formData)
    getTextPromptResponse(data)
  }

  const handleReset = () => {
    setPromptInputData({
      templateType: '',
      numberOfParagraphs: '',
      applicantName: '',
      jobCompanyName: '',
      jobTitle: '',
      jobSource: '',
      jobDescription: '',
      resume: ''
    })
    setTextOutput('')
  }

  const reSubmitForm = () => {
    handleSubmit(promptInputData)
  }

  const PromptGeneratorContainer = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    return (
      <Container>
        <h3>{appTitle}</h3>
        {isLoading && <PageLoader />}
        {!isLoading && (
          <>
            {renderStreamingSwitch()}
            {renderAddManualSentanceSwitch()}
            {children}
          </>
        )}
      </Container>
    )
  }

  return (
    <PromptGeneratorContainer>
      <PromptGeneratorForm
        inititalValues={promptInputData}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isData={isData}
        handleReset={handleReset}
      />
      {isData && (
        <PromptOutput
          textOutput={textOutput}
          visible={!isLoading && textOutput.length > 0}
          reSubmitForm={reSubmitForm}
        />
      )}
    </PromptGeneratorContainer>
  )
}
