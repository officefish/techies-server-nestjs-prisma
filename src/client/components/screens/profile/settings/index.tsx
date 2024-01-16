import { FC, MouseEvent, PropsWithChildren, useEffect, useState } from 'react'
//import useOnlyWithUser from "@client/hooks/with-user-only"

import { Cover, ProfileLayout, EditHeader } from '../components'

import BasicInfoSettings from './basic-info'
import StatusSettings from './status'

import { StyledSettingsTab } from '../styled-profile'

import { useUserProfile } from '@client/services/user-profile.service'

const avatar = '/public/team-2-800x800.jpg'
import VisualsSettings from './visuals'
import { useUserProfileStore } from '@/client/providers'
const background =
  'https://images.unsplash.com/photo-1499336315816-097655dcfbda'

enum ESettingsMode {
  BasicInfo,
  Status,
  Visuals,
  StylePreferences,
  Security,
  Integrations,
} // refactor to as const

const ProfileSettings: FC = () => {
  //const { mutate } = useOnlyWithUser()

  const { userProfile } = useUserProfile()
  const {
    setFullName,
    setCareer,
    setEducation,
    setLocation,
    setQuote,
    setDomain,
    //setCover,
    //setAvatar,
    //setTartan
  } = useUserProfileStore()

  useEffect(() => {
    setFullName(userProfile.basicInfo.fullName)
    setCareer(userProfile.basicInfo.career)
    setEducation(userProfile.basicInfo.education)
    setLocation(userProfile.basicInfo.location)
    setQuote(userProfile.quote)
    setDomain(userProfile.domain)
  }, [userProfile])

  const [settingsMode, setSettingsMode] = useState<ESettingsMode>(
    ESettingsMode.BasicInfo,
  )

  const handleInputMode = (
    e: MouseEvent<HTMLButtonElement> & { target: HTMLButtonElement },
  ) => {
    e.preventDefault()
    const { target } = e
    switch (+target.value) {
      case 0: {
        setSettingsMode(ESettingsMode.BasicInfo)
        break
      }
      case 1: {
        setSettingsMode(ESettingsMode.Status)
        break
      }
      case 2: {
        setSettingsMode(ESettingsMode.Visuals)
        break
      }
      case 3: {
        setSettingsMode(ESettingsMode.StylePreferences)
        break
      }
      case 4: {
        setSettingsMode(ESettingsMode.Security)
        break
      }
      case 5: {
        setSettingsMode(ESettingsMode.Integrations)
        break
      }
      default: {
        setSettingsMode(ESettingsMode.BasicInfo)
        break
      }
    }
  }

  return (
    <>
      <div className="relative">
        <Cover background={background} />
        <ProfileLayout avatar={avatar}>
          <EditHeader />
          <Tabs>
            <TabItem
              currentMode={settingsMode}
              mode={ESettingsMode.BasicInfo}
              handler={handleInputMode}
            >
              Basic Info
            </TabItem>
            <TabItem
              currentMode={settingsMode}
              mode={ESettingsMode.Status}
              handler={handleInputMode}
            >
              Status
            </TabItem>
            <TabItem
              currentMode={settingsMode}
              mode={ESettingsMode.Visuals}
              handler={handleInputMode}
            >
              Visuals
            </TabItem>
          </Tabs>
          {renderSettingsMode(settingsMode)}
          <div className="w-full h-2 bg-base-300 dark:bg-base-300-dark rounded-b-xl"></div>
        </ProfileLayout>
      </div>
    </>
  )
}
export default ProfileSettings

const renderSettingsMode = (mode: ESettingsMode) => {
  switch (mode) {
    case ESettingsMode.BasicInfo:
      return <BasicInfoSettings />
    case ESettingsMode.Status:
      return <StatusSettings />
    case ESettingsMode.Visuals:
      return <VisualsSettings />
    default:
      return <></>
  }
}

const Tabs: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="grid mt-8">
        <div className="tabs z-10 -mb-px bg-base-100 dark:bg-base-100-dark pt-2">
          {children}
        </div>
      </div>
      <div className="w-full h-2 bg-base-300 dark:bg-base-300-dark"></div>
    </>
  )
}

interface ITabItem extends PropsWithChildren {
  mode: ESettingsMode
  currentMode: ESettingsMode
  handler: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> & {
      target: HTMLButtonElement
    },
  ) => void
}

const TabItem: FC<ITabItem> = ({ mode, currentMode, handler, children }) => {
  return (
    <StyledSettingsTab
      $active={currentMode === mode}
      value={mode}
      onClick={handler}
    >
      {children}
    </StyledSettingsTab>
  )
}
