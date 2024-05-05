import { SelectComponent } from '../../../../components/Inputs/SelectComponent'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import dummyDataConfig from '../../config/dummyData.json'
import { get, map, range, includes, merge } from 'lodash'
import { Box, SelectChangeEvent } from '@mui/material'
import { TextFieldComponent } from '../../../../components/Inputs/TextFieldComponent'
import { ButtonComponent } from '../../../../components/Inputs/ButtonComponent'
import { useState } from 'react'
import { IPromptGeneratorFormProps } from '../../implementation/PromptGenerator.types'

export const PromptGeneratorForm = ({
  handleSubmit,
  inititalValues,
  isLoading,
  isData
}: IPromptGeneratorFormProps) => {
  const [visible, setVisble] = useState(isData || isLoading ? false : true)
  const [formData, setFormData] = useState(inititalValues)
  const dummyData = { ...dummyDataConfig }

  // Sets the tone of the prompt
  const fields = get(
    coverLetterConfig,
    `promptTemplates[${formData.templateType}].additionalFields`,
    []
  )

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

  const toggleFormVisibility = () => {
    setVisble((prevVisible) => !prevVisible)
  }

  const handleOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target
    event.preventDefault()
    setFormData({ ...formData, [name]: value })
  }

  const handleResetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [formData.templateType]: ''
    }))
  }

  const handleFormSubmit = () => {
    handleSubmit(formData)
  }

  const useDummyData = () => {
    const updatedFormData = merge({}, formData, dummyData)
    setFormData(updatedFormData)
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
            <ButtonComponent
              variant='contained'
              type={'button'}
              onClick={useDummyData}
              fullWidth
              sx={{ my: 1 }}
            >
              {'Populate form with example data'}
            </ButtonComponent>
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
