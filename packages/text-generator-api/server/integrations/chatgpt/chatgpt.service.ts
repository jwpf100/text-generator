import { Response } from 'express'
import { AbstractDependency } from '../../modules/llm/llm.controller'
import { forEach } from 'lodash'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export interface IChatGPTService extends AbstractDependency {
  getExampleResponseFromPrompt(): Promise<string>
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
    this.getExampleResponseFromPrompt = this.getExampleResponseFromPrompt.bind(this)
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

  async getExampleResponseFromPrompt() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      console.log('🚀 ~ ChatGPTService ~ getResponseFromPrompt ~ res:', res)
      const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date'
      console.log(res.status)
      console.log('Date in header: ' + headerDate)
      const users = await res.json()

      forEach(users, (user) => console.log('User: ' + user.name))
      return users
    } catch (error) {
      console.log(error)
      return error
    }
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
      console.log(error)
    }
  }
}
