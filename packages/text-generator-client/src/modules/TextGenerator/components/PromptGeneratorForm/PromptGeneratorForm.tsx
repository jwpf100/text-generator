import { SelectComponent } from '../FormComponents/SelectComponent'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { get, map, range, includes } from 'lodash'
import { Box } from '@mui/material'
import { TextFieldComponent } from '../FormComponents/TextFieldComponent'
import { ButtonComponent } from '../FormComponents/ButtonComponent'
import { useState } from 'react'

interface IPromptGeneratorFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  visible: boolean
}

export interface IEventTarget {
  name: string
  value: string
}

export const PromptGeneratorForm = ({ handleSubmit, visible }: IPromptGeneratorFormProps) => {
  const [key, setKey] = useState(1)
  const [formData, setFormData] = useState({
    templateType: '',
    numberOfParagraphs: '',
    jobTitle: '',
    jobSource: '',
    jobDescription: '',
    resume: ''
  })
  const handleChange = (target: IEventTarget) => {
    const { name, value } = target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  const fields = get(coverLetterConfig, `promptTemplates[${formData.templateType}].additionalFields`, [])

  const handleResetForm = () => {
    setFormData((prevFormData) => ({ ...prevFormData, [formData.templateType]: '' }))
    setKey(key + 1)
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
  const paragraphSelectOptions = range(1, numberOfParagraphs + 1).map((number) => {
    return {
      value: number.toString(),
      label: `${number}`
    }
  })

  const styling = visible ? {} : { display: 'none' }
  return (
    <Box sx={styling}>
      <form key={key} onSubmit={handleSubmit}>
        <SelectComponent
          id='select-template-type'
          label='Select letter template:'
          name='templateType'
          selectOptions={templateTypeSelectOptions}
          value={formData.templateType}
          onChange={handleChange}
        />

        {includes(fields, 'numberOfParagraphs') && (
          <SelectComponent
            id='select-paragraph-number'
            label='Select number of paragraphs:'
            name='numberOfParagraphs'
            selectOptions={paragraphSelectOptions}
            value={formData.numberOfParagraphs}
            onChange={handleChange}
          />
        )}
        {includes(fields, 'jobTitle') && (
          <TextFieldComponent
            id='text-field-job-source'
            label='What is the job title you are applying for:'
            name='jobTitle'
            rows={1}
            value={formData.jobTitle}
            onChange={handleChange}
          />
        )}
        {includes(fields, 'jobSource') && (
          <TextFieldComponent
            id='text-field-job-source'
            label='Where did you hear about the job:'
            name='jobSource'
            rows={1}
            value={formData.jobSource}
            onChange={handleChange}
          />
        )}
        {includes(fields, 'jobDescription') && (
          <TextFieldComponent
            id='text-field-job-description'
            label='Job description:'
            name='jobDescription'
            rows={6}
            value={formData.jobDescription}
            onChange={handleChange}
          />
        )}
        {includes(fields, 'resume') && (
          <TextFieldComponent
            id='text-field-resume'
            label='Paste your resume:'
            name='resume'
            rows={6}
            value={formData.resume}
            onChange={handleChange}
          />
        )}

        <ButtonComponent variant='contained' type={'submit'} fullWidth sx={{ my: 1 }}>
          {'Submit'}
        </ButtonComponent>
        <ButtonComponent variant='outlined' type={'button'} onClick={handleResetForm} fullWidth sx={{ my: 1 }}>
          {'Reset Form'}
        </ButtonComponent>
      </form>
    </Box>
  )
}
