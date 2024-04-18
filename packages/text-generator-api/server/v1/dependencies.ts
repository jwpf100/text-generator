import { LLMController } from "../modules/llm/llm.controller"
import { ChatGPTService } from "../integrations/chatgpt/chatgpt.service"

export const chatGPTService = new ChatGPTService()

export const llmController = new LLMController(chatGPTService)

export async function initialiseDependencies(env: NodeJS.ProcessEnv){
  try {
    console.log(`PORT: ${env.PORT}`)
    console.log(`apiKey: ${env.OPEN_AI_API_KEY}`)
    console.log('Initialising dependencies...')
    
    await chatGPTService.initialise({
      openaiApiKey: env.OPEN_AI_API_KEY || '',
    })

    await llmController.initialise({})

  } catch (error: unknown) {
    console.log('Error initialising dependencies: ', error)
  }
}