import { SelectComponent } from '../FormComponents/SelectComponent'
import coverLetterConfig from '../../config/coverLetterConfig.json'
import { get, map, range, includes } from 'lodash'
import { Box } from '@mui/material'
import { TextFieldComponent } from '../FormComponents/TextFieldComponent'
import { ButtonComponent } from '../FormComponents/ButtonComponent'
import { useState } from 'react'

export const PromptGeneratorForm = ({ handleSubmit }) => {
  const [key, setKey] = useState(1)
  const [templateType, setTemplateType] = useState(undefined)
  const fields = get(coverLetterConfig, `promptTemplates[${templateType}].additionalFields`, [])
  
  const handleResetForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTemplateType(undefined)
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
      value: number,
      label: `${number}`
    }
  })

  return (
    <Box>
      <form key={key} onSubmit={handleSubmit}>
        <SelectComponent id='select-template-type' label='Select letter template:' name='templateType' selectOptions={templateTypeSelectOptions} value={templateType} onClick={setTemplateType}/>

        {includes(fields, 'numberOfParagraphs') && 
        <SelectComponent id='select-paragraph-number' label='Select number of paragraphs:' name='numberOfParagraphs' selectOptions={paragraphSelectOptions} />
        }
        {includes(fields, 'jobTitle') && 
        <TextFieldComponent id='text-field-job-source' label='What is the job title you are applying for:' name='jobTitle' rows={1} />
        }
        {includes(fields, 'jobSource') && 
        <TextFieldComponent id='text-field-job-source' label='Where did you hear about the job:' name='jobSource' rows={1} />
        }
        {includes(fields, 'jobDescription') && 
        <TextFieldComponent id='text-field-job-description' label='Job description:' name='jobDescription' rows={6} />
        }
        {includes(fields, 'resume') && 
        <TextFieldComponent id='text-field-resume' label='Paste your resume:' name='resume' rows={6} />
        }      

        <ButtonComponent variant='contained' type={'submit'} fullWidth sx={{ my: 1 }}>
          {'Submit'}
        </ButtonComponent>
        <ButtonComponent variant='outlined' type={'reset'} onClick={handleResetForm} fullWidth sx={{ my: 1 }}>
          {'Reset Form'}
        </ButtonComponent>
      </form>
    </Box>
  )
}
