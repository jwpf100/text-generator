import { Card, CardActionArea, CardContent, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { get, map } from 'lodash'
import copy from 'copy-to-clipboard'

export const PromptGenerator = () => {
  const [templateType, setTemplateType] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')

  useEffect(() => {
    const newPrompt = get(coverLetterConfig, `promptTemplate[${templateType}].prompt`, '')
    setPrompt(newPrompt)
  }, [templateType])

  const coverLetterConfig = {
    title: 'Cover Letter',
    numberOfParagraphs: 4,
    paragraphStructure: {
      1: 'personal Intro and how you found the position',
      2: "your experience and why you're a suitable candidate",
      3: "your experience and why you're a suitable candidate",
      4: 'summary and call to action',
      info: 'https://enhancv.com/blog/how-long-should-a-cover-letter-be'
    },
    promptTemplate: {
      standard: {
        title: 'Standard',
        prompt: `I want you to act as a cover letter writer. I'd like you to help me write a cover letter that consists of three paragraphs and follows this standardized structure. In the first paragraph, mention the role I'm applying for [Senior Architect] and that I've learned about it [from a friend who works at the company]. Use the next paragraph to highlight any of my relevant skills, experiences, or accomplishments that align with the job. The third and final paragraph should sign off with my excitement for the role. I'd also like to thank the recruiters for their time in assessing my resume and how I look forward to the next stages of the process. Ensure that the cover letter uses professional language and tone and follows industry best practice examples. If you've understood the assessment, can I please paste in my resume?`
      },
      narrative: {
        title: 'Narrative',
        prompt: `I want you to act as a cover letter writer. I'd like you to help me write a cover letter that consists of three paragraphs and follows this storytelling structure. In the first paragraph, introduce my professional background that is relevant to the job of [3D Artist]. Use the next paragraph to share a relevant story from my experience that demonstrates my skills, experience, or personal qualities. Explain how this story relates to the job requirements. Sum up the cover letter with a paragraph about why I'm a great fit for the role, in terms of skills and enthusiasm for the industry. Use professional language and tone, but at the same time keep this cover letter compact. Follow some best industry practices. If you've understood the task, can I please paste in my resume?`
      },
      technical: {
        title: 'Technical',
        prompt: `I want you to act as a cover letter writer. I'd like you to use the following problem-solving structure to write the cover letter. I'll provide you with both the job advert and my resume. In the first paragraph, mention one specific challenge that this company may face, which the role can solve. The next paragraph should focus on how up to three skills and one of my past professional roles make me the perfect candidate to resolve this problem. Finalize with more information about why I'm the perfect candidate for the role. Use professional language and tone, but at the same time keep this cover letter compact. Follow the best cover letter writing practices. If you've understood the task, can I please paste in my resume?`
      },
      skillBased: {
        title: 'Skill focused',
        prompt: `I want you to act as a cover letter writer. I'd like you to use the following skill-based structure to write the cover letter. List between 3–5 skills from my experience that are relevant to the job. Use my resume to provide brief examples of how I've used those particular skills in the past. Make sure to include both technical and soft skills. Keep this cover letter to be compact with a maximum of four paragraphs. Use professional language and tone. Follow the best cover letter writing practices. If you've understood the task, can I please paste in both my resume and the job advert?`
      },
      jobRequirementBased: {
        title: 'Job Requirement Focussed',
        prompt: `I want you to act as a cover letter writer. I'd like you to use the following T-format structure to write the cover letter. I'll provide you with both the job advert and my resume. Make this cover letter no more than five paragraphs long. List the job requirements or key skills mentioned in the job posting within the left column. In the right column, provide my provide corresponding experiences and qualifications. Use professional language and tone, while following the best cover letter writing practices. If you've understood the task, can I please paste in both my resume and the job advert?`
      },
      fullPrompt: {
        title: 'Full',
        prompt: `I want you to act as a cover letter writer. I will provide you with the job advert and my resume. Use this information to create a professional and effective cover letter. Focus the cover letter to be written using the best practices and industry standards. Tailor the cover letter's content to the specific job and company that I am applying to, highlighting my relevant skills and experience. Also, make sure to explain why I am a strong candidate for the position. Please ensure that the cover letter is clear and concise. The cover letter should have appropriate formatting and layout to make it visually appealing and easy to read. Do make sure that it effectively communicates my qualifications and interest in the job. Finally, don't include any personal opinions or statements. I'll first provide you with my resume, then the job advert. Is that okay?`
      }
    },
    helperPrompts: {
      experienceJobAlignment: `I want you to act as a cover letter writer. I will provide you with information about the job I am applying for and my relevant skills and experience. You will help me discover two things. The first - which areas of my expertise align with the job I'm applying for? The second - what skills would I need to highlight in my cover letter to make a good first impression? Is that understood?`,
      skillsJobAlignment: `Could you be more specific about the skills' alignment between my resume and the job advert? Which ones do you think would be a good idea to focus on, based on my current professional experience?`
    },
    specificSections: {
      introductionAndFirstParagraph: {
        whyYouLikeTheCompany: `Let's build a cover letter introduction for me. I'm a [lawyer, applying for a litigator at Johnson, Johnson & Johnson]. I want to create a custom, authentic, and enthusiastic cover letter introduction of 50 words or less. I want to show that I am genuinely attracted to the company’s brand and have used or followed their products or services before.`,
        referral: `Let's build a cover letter introduction for me. I'm [a lawyer, applying for a litigator at Johnson, Johnson & Johnson]. I want to create a custom, authentic, and enthusiastic cover letter introduction of 50 words or fewer. I was referred to this job by [a former colleague, Kathryn Hydefield], so mention that connection in my cover letter.`
      }
    },
    additionalConsiderations: {
      prompt: `Consider the following as well`,
      general: [`Avoid using extreme words like “greatest” or “best”`, `Show excitement and gratitude`],
      referral: [
        `Keep it brief and let the recommendation speak for itself`,
        `Mention a project you've worked on together previously`,
        `Mention the good intentions of the person recommending you`
      ]
    },
    resume: ``,
    jobAdvert: ``
  }

  const TemplateSelect = () => {
    const label = 'Select letter template:'
    const handleOnChange = (event: SelectChangeEvent<string>) => {
      setTemplateType(event.target.value)
    }
    const templateTypeOptions = map(coverLetterConfig.promptTemplate, (value, key) => {
      return (
        <MenuItem key={key} value={key}>
          {value.title}
        </MenuItem>
      )
    })
    return (
      <FormControl fullWidth>
        <InputLabel id='select-template-type-label'>{label}</InputLabel>
        <Select labelId='select-template-type-label' id='select-template-type' label={label} value={templateType} onChange={handleOnChange}>
          {...templateTypeOptions}
        </Select>
      </FormControl>
    )
  }

  const GeneratedPromptDisplay = () => {
    const copyToClipboard = () => copy(prompt)
    return (
      <Card>
        <CardActionArea onClick={copyToClipboard}>
          <CardContent>
            <Typography align='left' paragraph>
              {prompt}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  return (
    <Container>
      <h3>Prompt Generator Screen</h3>
      <TemplateSelect />
      <GeneratedPromptDisplay />
    </Container>
  )
}
