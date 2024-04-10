import { SelectComponent } from '../FormComponents/SelectComponent'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { fromPairs, get, map, range } from 'lodash'
import { Box } from '@mui/material'
import { TextFieldComponent } from '../FormComponents/TextFieldComponent'
import { ButtonComponent } from '../FormComponents/ButtonComponent'
import { useState } from 'react'

export const PromptGeneratorForm = ({
  setFormData
}) => {
  const [key, setKey] = useState(1)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const formData = fromPairs(map([...form.entries()], ([key, value]) => [key, value]))
    setFormData(formData)
  }

  const numberOfParagraphs = get(coverLetterConfig, 'numberOfParagraphs')
  const paragraphSelectOptions = range(1, numberOfParagraphs + 1).map((number) => {
    return {
      value: number,
      label: `${number}`
    }
  })
  const templateTypes = get(coverLetterConfig, 'promptTemplates')
  const templateTypeSelectOptions = map(templateTypes, (value, key) => {
    return {
      value: key,
      label: `${value.title}`
    }
  })

  return (
    <Box>
      <form key={key} onSubmit={handleSubmit}>
        
        <SelectComponent id='select-template-type' label='Select letter template:' name='templateType' selectOptions={templateTypeSelectOptions} />
        
        <SelectComponent id='select-paragraph-number' label='Select number of paragraphs:' name='numberOfParagraphs' selectOptions={paragraphSelectOptions} />
        
        <TextFieldComponent id='text-field-resume' label='Paste your resume:' name='resume' rows={6}/>
        
        <TextFieldComponent id='text-field-job-title' label='Job title:' name='job title' rows={1} />

        <TextFieldComponent id='text-field-job-description' label='Job description:' name='job Description' rows={6} />

        <ButtonComponent variant='contained' type={'submit'}>{'Submit'}</ButtonComponent>
        <ButtonComponent variant='outlined' type={'reset'} onClick={() => setKey(key + 1)}>{'Reset Form'}</ButtonComponent>
      </form>
    </Box>
  )
}
