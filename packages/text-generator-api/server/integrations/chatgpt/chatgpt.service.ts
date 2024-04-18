import { Response } from 'express'
import { AbstractDependency } from '../../modules/llm/llm.controller'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export interface IChatGPTService extends AbstractDependency {
  streamModelResponse(prompt: unknown, res: Response): Promise<void>
}

export interface IChatGPTServiceConfig {
  openaiApiKey?: string
}

export class ChatGPTService implements AbstractDependency {
  private config: IChatGPTServiceConfig
  private initialised: boolean
  private openai: OpenAI | null

  constructor() {
    this.config = {}
    this.initialised = false
    this.openai = null
    this.streamModelResponse = this.streamModelResponse.bind(this)
  }

  async initialise(config: IChatGPTServiceConfig) {
    this.config = {
      ...config
    }
    this.openai = new OpenAI({apiKey: config.openaiApiKey})
    this.initialised = true
    console.log('🚀 ~ ChatGPTService ~ initialise', this.initialised)
    return null
  }

  async teardown() {
    this.initialised = false
    return null
  }

  async streamModelResponse(prompt: ChatCompletionMessageParam[], res: Response) {
    try {
      if(this.openai){
        console.log('Received prompt:', prompt)
        const stream = this.openai.beta.chat.completions.stream({
          model: 'gpt-3.5-turbo',
          stream: true,
          messages: [...prompt],
        })

        res.header('Content-Type', 'text/plain')
        for await (const chunk of stream.toReadableStream()) {
          res.write(chunk)
        }
        res.end()
      }
    } catch (error) {
      console.log('Error streaming response: ', error)
    }
  }
}
