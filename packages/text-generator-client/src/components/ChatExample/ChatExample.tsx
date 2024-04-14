import { Container } from '@mui/material'
import { useState } from 'react'
import { ChatCompletionStream } from 'openai/src/lib/ChatCompletionStream.js'
import { ButtonComponent } from '../../modules/TextGenerator/components/FormComponents'

export const ChatExample = () => {
  const [text, setText] = useState('')

  const getText = async () => {
    try{
      const response = await fetch('http://localhost:1234/api/v1/text-generator', {
        method: 'POST',
        body: 'Tell in less than 50 words why cats are better than dogs',
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      if(!response.ok) {
        throw new Error('Error fetching data')
      }

      const runner = ChatCompletionStream.fromReadableStream(response.body)

      runner.on('content', (delta, snapshot) => {
        console.log(delta)
        console.log(snapshot)
        setText(prevText => prevText + delta)
      })

      const finalChatCompletion = await runner.finalChatCompletion()
      console.log("🚀 ~ getText ~ finalChatCompletion:", finalChatCompletion)
      const finalOutput = await runner.finalContent()
      console.dir(finalOutput, { depth: null })
      return finalOutput

    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClick = () => {
    console.log('Clicked')
    const getData = async () => {
      const data = await getText()
      console.info('Final output: ', data)
    }
    getData()
  }
  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await getText()
  //     console.info('Final output: ', data)
  //   }
  //   getData()
  // }, [])

  return (
    <Container fixed>
      <h5>ChatExample:</h5>
      <ButtonComponent variant='contained' type={'button'} fullWidth sx={{ my: 1 }} onClick={handleOnClick}>
        {'Cats'}
      </ButtonComponent>
      <p>{text}</p>
    </Container>
  )
}
