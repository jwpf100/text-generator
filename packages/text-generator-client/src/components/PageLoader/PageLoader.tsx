import { Box, CircularProgress } from '@mui/material'
import styled from 'styled-components'

export const PageLoader = () => {

  const StyledBox = styled(Box)`
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100%;
`

  return (
    <StyledBox className={'styled-box'}>
      <CircularProgress />
    </StyledBox>
  )
}
