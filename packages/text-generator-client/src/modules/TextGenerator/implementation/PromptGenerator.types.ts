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
  overrideSentanceIntro?: string
  overrideSentance? : string
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
export interface IPromptGeneratorFormData {
  templateType: string
  numberOfParagraphs: string
  jobTitle: string
  jobSource: string
  jobDescription: string
  resume: string
  applicantName: string
  jobCompanyName: string
}
export interface IPromptGeneratorFormProps {
  handleSubmit: (formData: IPromptGeneratorFormData) => void
  isLoading: boolean
  isData: boolean
  inititalValues: IPromptGeneratorFormData
  handleReset: () => void
}
