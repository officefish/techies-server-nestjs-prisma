import { FC } from 'react'
import { QuoteContainer, QuoteWrapper, QuoteParagraph } from '../styled-profile'

import { IQuote } from '@client/models/profile.types'

const ProfileQuote: FC<IQuote> = ({ value }) => {
  return (
    <QuoteContainer>
      <QuoteWrapper>
        <QuoteParagraph>{value}</QuoteParagraph>
      </QuoteWrapper>
    </QuoteContainer>
  )
}

export default ProfileQuote
