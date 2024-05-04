import { Request, Response } from 'express'
import { IChatGPTService } from '../../integrations/chatgpt/chatgpt.service'
import { get, template, merge } from 'lodash'

export interface AbstractDependency {
  /**
   * Initialise the dependency with custom options/params
   */
  initialise(...args: unknown[]): Promise<null>
  /**
   * Destroy the dependency
   */
  teardown(...args: unknown[]): Promise<null>
}

export type IConfig = {
  clientId?: string
  clientSecret?: string
  redirectURI?: string
}

export class LLMController {
  private config: IConfig
  private initialised: boolean
  private llmService: IChatGPTService

  constructor(llmService: IChatGPTService) {
    this.config = {}
    this.initialised = false
    this.llmService = llmService
    this.parsePromptInputs = this.parsePromptInputs.bind(this)
  }

  async initialise(config: IConfig) {
    this.config = {
      ...config
    }
    this.initialised = true
    return null
  }

  async teardown() {
    this.initialised = false
    return null
  }

  // Turn config from client into suitable prompt
  async parsePromptInputs(promptInputs: { [key: string]: string }) {
    const defaultPromptInputs = {
      style: 'professional',
      signOff: 'warm'
    }

    const finalPromptInputs = merge({}, defaultPromptInputs, promptInputs)
    console.log("🚀 ~ LLMController ~ parsePromptInputs ~ finalPromptInputs:", finalPromptInputs)
    
    const replacePlaceholders = (string: string) => {
      const compiledTemplate = template(string)
      const replacedString = compiledTemplate(finalPromptInputs)
      return replacedString
    }

    const finalPrompt = [
      {
        role: 'system',
        content: replacePlaceholders(get(finalPromptInputs, 'system', ''))
      },
      {
        role: 'user',
        content: replacePlaceholders(get(finalPromptInputs, 'user', ''))
      },
      {
        role: 'user',
        content: replacePlaceholders(get(finalPromptInputs, 'resumeIntro', ''))
      },
      {
        role: 'user',
        content: get(finalPromptInputs, 'resume', '')
      },
      {
        role: 'user',
        content: replacePlaceholders(get(finalPromptInputs, 'jobDescriptionIntro', ''))
      },
      {
        role: 'user',
        content: get(finalPromptInputs, 'jobDescription', '')
      }
    ]
    console.log("🚀 ~ LLMController ~ parsePromptInputs ~ finalPrompt:", finalPrompt)
    return finalPrompt
  }


  async getStreamedModelResponse(req: Request, res: Response) {
    const prompt = await this.parsePromptInputs(req.body)
    const response = await this.llmService.streamModelResponse(prompt, res)
    return response
  }

  async getStandardModelResponse(req: Request) {
    const prompt = await this.parsePromptInputs(req.body)
    const response = await this.llmService.completionModelResponse(prompt)
    return response
  }
}
