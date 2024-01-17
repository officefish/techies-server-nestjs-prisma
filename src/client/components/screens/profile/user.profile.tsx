import { FC } from 'react'
//import { useUser } from '@client/services/user.service'
//import { useUserProfile } from '@client/services/user-profile.service'
//import { StaticImageData } from "next/image"

import {
  Cover,
  ProfileLayout,
  Header,
  BasicInfo,
  ProfileQuote,
  ResentActivities,
} from './components'

import {
  //IBasicInfo,
  IHeaderStatsData,
} from '@client/models/profile.types'

import { ProfileDelimeter } from './styled-profile'

import { IUserProfile } from '@/client/models/user.model'

//const avatar = '/public/team-2-800x800.jpg'

const background =
  'https://images.unsplash.com/photo-1499336315816-097655dcfbda'

const headerData: IHeaderStatsData = {
  followers: 22,
  posts: 12,
  comments: 108,
}

interface IUserProfileProps {
  data: IUserProfile
}

const UserProfile: FC<IUserProfileProps> = ({ data }) => {
  //const { userProfile } = useUserProfile()

  return (
    <div className="relative">
      <Cover background={background} />
      <ProfileLayout avatar={data.avatar.imageUrl}>
        <Header stats={headerData} />
        <BasicInfo data={data.basicInfo} />
        <ProfileDelimeter />
        <ProfileQuote content={data.quote?.content || ''} />
        <ResentActivities />
      </ProfileLayout>
    </div>
  )
}
export default UserProfile
