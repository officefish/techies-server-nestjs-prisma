import { FC, PropsWithChildren } from 'react'
import Avatar from './avatar'
//import { StaticImageData } from 'next/image'

import {
  StyledProfileLayout,
  StyledProfileWrapper,
  StyledProfileBody,
} from '../styled-profile'

interface AvatarProps {
  avatar?: string
}

const ProfileLayout: FC<PropsWithChildren<AvatarProps>> = ({
  children,
  avatar,
}) => {
  return (
    <StyledProfileLayout>
      <StyledProfileWrapper>
        {avatar && <Avatar avatar={avatar} />}
        <StyledProfileBody $fontFamily="display">{children}</StyledProfileBody>
      </StyledProfileWrapper>
      <div className="h-24"></div>
    </StyledProfileLayout>
  )
}
export default ProfileLayout
