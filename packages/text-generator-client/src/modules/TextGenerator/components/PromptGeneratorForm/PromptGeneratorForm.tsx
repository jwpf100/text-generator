import { SelectComponent } from '../../../../components/Inputs/SelectComponent'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { get, map, range, includes } from 'lodash'
import { Box, SelectChangeEvent } from '@mui/material'
import { TextFieldComponent } from '../../../../components/Inputs/TextFieldComponent'
import { ButtonComponent } from '../../../../components/Inputs/ButtonComponent'
import { useState } from 'react'

export interface IPromptGeneratorFormData {
  templateType: string
  numberOfParagraphs: string
  jobTitle: string
  jobSource: string
  jobDescription: string
  resume: string
}
interface IPromptGeneratorFormProps {
  handleSubmit: (formData: IPromptGeneratorFormData) => void
  isLoading: boolean
  isData: boolean
  inititalValues: IPromptGeneratorFormData
}

export interface IEventTarget {
  name: string
  value: string
}

export interface IBoxProps {
  visible: boolean
}

export const PromptGeneratorForm = ({
  handleSubmit,
  inititalValues,
  isData
}: IPromptGeneratorFormProps) => {
  const [visible, setVisble] = useState(isData ? false : true)
  const [formData, setFormData] = useState(inititalValues)

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target
    event.preventDefault()
    setFormData({ ...formData, [name]: value })
  }

  const toggleFormVisibility = () => {
    setVisble((prevVisible) => !prevVisible)
  }

  const fields = get(
    coverLetterConfig,
    `promptTemplates[${formData.templateType}].additionalFields`,
    []
  )

  const handleResetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [formData.templateType]: ''
    }))
  }

  // Sets the tone of the prompt
  const templateTypes = get(coverLetterConfig, 'promptTemplates')
  const templateTypeSelectOptions = map(templateTypes, (value, key) => {
    return {
      value: key,
      label: `${value.title}`
    }
  })

  const numberOfParagraphs = get(coverLetterConfig, 'numberOfParagraphs')
  const paragraphSelectOptions = range(1, numberOfParagraphs + 1).map(
    (number) => {
      return {
        value: number.toString(),
        label: `${number}`
      }
    }
  )

  const handleFormSubmit = () => {
    handleSubmit(formData)
  }

  return (
    <>
      {isData && (
        <ButtonComponent
          variant='contained'
          type={'button'}
          onClick={toggleFormVisibility}
          fullWidth
          sx={{ my: 1 }}
        >
          {visible ? 'Hide Form' : 'Show Form'}
        </ButtonComponent>
      )}
      {visible && (
        <Box>
          <form>
            <SelectComponent
              id='select-template-type'
              label='Select letter template:'
              name='templateType'
              selectOptions={templateTypeSelectOptions}
              value={formData.templateType}
              onChange={handleOnChange}
            />
            {includes(fields, 'numberOfParagraphs') && (
              <SelectComponent
                id='select-paragraph-number'
                label='Select number of paragraphs:'
                name='numberOfParagraphs'
                selectOptions={paragraphSelectOptions}
                value={formData.numberOfParagraphs}
                onChange={handleOnChange}
              />
            )}
            {includes(fields, 'jobTitle') && (
              <TextFieldComponent
                id='text-field-job-title'
                key='text-field-job-title'
                label='What is the job title you are applying for:'
                name='jobTitle'
                rows={1}
                value={formData.jobTitle}
                onChange={handleOnChange}
              />
            )}
            {includes(fields, 'jobSource') && (
              <TextFieldComponent
                id='text-field-job-source'
                label='Where did you hear about the job:'
                name='jobSource'
                rows={1}
                value={formData.jobSource}
                onChange={handleOnChange}
              />
            )}
            {includes(fields, 'jobDescription') && (
              <TextFieldComponent
                id='text-field-job-description'
                label='Job description:'
                name='jobDescription'
                rows={6}
                value={formData.jobDescription}
                onChange={handleOnChange}
              />
            )}
            {includes(fields, 'resume') && (
              <TextFieldComponent
                id='text-field-resume'
                label='Paste your resume:'
                name='resume'
                rows={6}
                value={formData.resume}
                onChange={handleOnChange}
              />
            )}

            <ButtonComponent
              variant='contained'
              type={'button'}
              fullWidth
              sx={{ my: 1 }}
              onClick={handleFormSubmit}
            >
              {'Submit'}
            </ButtonComponent>
            <ButtonComponent
              variant='outlined'
              type={'button'}
              onClick={handleResetForm}
              fullWidth
              sx={{ my: 1 }}
            >
              {'Reset Form'}
            </ButtonComponent>
          </form>
        </Box>
      )}
    </>
  )
}
