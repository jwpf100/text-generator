import { Response } from 'express'
import { AbstractDependency } from '../../modules/llm/llm.controller'
import OpenAI from 'openai'
import {
  ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionMessage
} from 'openai/resources/index.mjs'

export interface IChatGPTService extends AbstractDependency {
  streamModelResponse(prompt: unknown, res: Response): Promise<void>
  completionModelResponse(prompt: unknown): Promise<unknown>
}

export interface IChatGPTServiceConfig {
  openaiApiKey?: string
}

export interface IChatCompletionResponse {
  finish_reason: string
  message: string | ChatCompletionMessage
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
    this.openai = new OpenAI({ apiKey: config.openaiApiKey })
    this.initialised = true
    return null
  }

  async teardown() {
    this.initialised = false
    return null
  }

  async streamModelResponse(
    prompt: ChatCompletionMessageParam[],
    res: Response
  ) {
    try {
      console.log('Received check if openai initialised:')
      console.log('🚀 ~ ChatGPTService ~ streamModelResponse ~ prompt:', prompt)
      if (this.openai) {
        const stream = this.openai.beta.chat.completions.stream({
          model: 'gpt-3.5-turbo',
          stream: true,
          messages: [...prompt]
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

  async completionModelResponse(
    prompt: ChatCompletionMessageParam[]
  ): Promise<IChatCompletionResponse | undefined> {
    console.log(
      '🚀 ~ ChatGPTService completionModel ~ streamModelResponse ~ prompt:',
      prompt
    )
    try {
      console.log('completionModel: Check if openai initialised:')
      if (this.openai) {
        console.log('Open ai initialised')
        const completion: ChatCompletion =
          await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: false,
            messages: [...prompt]
          })

        const { choices } = completion
        const { finish_reason, message } = choices[0] || {
          finish_reason: 'No data',
          message: 'No data'
        }
        return { finish_reason, message }
      }
    } catch (error) {
      console.log('Error getting response: ', error)
    }
  }
}
