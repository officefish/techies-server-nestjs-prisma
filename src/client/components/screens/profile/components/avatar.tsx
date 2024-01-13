import { FC } from 'react'
import Image, { StaticImageData } from 'next/image'

import {
  StyledAvatarLayout,
  StyledAvatarWrapper,
  AvatarImageClasses,
} from '../styled-profile'

interface AvatarProps {
  avatar: StaticImageData
}

const Avatar: FC<AvatarProps> = ({ avatar }) => {
  return (
    <StyledAvatarLayout>
      <StyledAvatarWrapper>
        <Image
          alt="avatar"
          src={avatar.src}
          width={120}
          height={120}
          className={AvatarImageClasses}
        />
      </StyledAvatarWrapper>
    </StyledAvatarLayout>
  )
}
export default Avatar
