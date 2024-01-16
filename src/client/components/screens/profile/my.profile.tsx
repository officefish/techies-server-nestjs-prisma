import { FC } from 'react'
//import { useUser } from '@client/services/user.service'
import { useUserProfile } from '@client/services/user-profile.service'
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

const avatar = '/public/team-2-800x800.jpg'

const background =
  'https://images.unsplash.com/photo-1499336315816-097655dcfbda'

const headerData: IHeaderStatsData = {
  followers: 22,
  posts: 12,
  comments: 108,
}

const MyProfile: FC = () => {
  const { userProfile } = useUserProfile()

  return (
    <>
      {userProfile ? (
        <div className="relative">
          <Cover background={background} />
          <ProfileLayout avatar={avatar}>
            <Header stats={headerData} />
            <BasicInfo data={userProfile.basicInfo} />
            <ProfileDelimeter />
            <ProfileQuote content={userProfile.quote?.content || ''} />
            <ResentActivities />
          </ProfileLayout>
        </div>
      ) : (
        <div>You need to be authorized!</div>
      )}
    </>
  )
}
export default MyProfile
