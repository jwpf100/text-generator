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

export interface IChatMessage {
  role: string
  content: string
}
export interface IChatCompletionResponse {
  finish_reason: string
  message: string | IChatMessage
}

export interface IChatMessage {
  role: string
  content: string
}
export interface IChatCompletionResponse {
  finish_reason: string
  message: string | IChatMessage
}
