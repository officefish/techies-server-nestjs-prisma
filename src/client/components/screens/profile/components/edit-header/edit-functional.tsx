import { FC, MouseEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useUserProfileStore } from '@client/providers'

import { useUpdateProfile } from '@client/services/user-profile.service'

import { StyledFunctional, SettingsButton } from '../../styled-profile'
import { UserProfile } from '@/client/models/user.model'
// import {
//   IAvatar,
//   ICareer,
//   ICover,
//   IDomain,
//   IEducation,
//   IFullName,
//   ILocation,
//   IQuote,
//   ITartan,
// } from '@client/models/profile.types'

// interface ISettings {
//   fullName: {
//     value?: IFullName
//     valid: boolean
//   }
//   career: {
//     value?: ICareer
//     valid: boolean
//   }
//   location: {
//     value?: ILocation
//     valid: boolean
//   }
//   education: {
//     value?: IEducation
//     valid: boolean
//   }
//   quote: {
//     value?: IQuote
//     valid: boolean
//   }

//   domain: {
//     value?: IDomain
//     valid: boolean
//   }

//   avatar: {
//     value?: IAvatar
//     valid: boolean
//   }

//   cover: {
//     value?: ICover
//     valid: boolean
//   }

//   tartan: {
//     value?: ITartan
//     valid: boolean
//   }
// }

const EditHeaderFunctional: FC = () => {
  const [invalidData, setInvalidData] = useState(false)

  const { updateSettings, updateSettingsResponse, updateSettingsError } =
    useUpdateProfile()

  const {
    isValidFullName,
    isValidCareer,
    isValidEducation,
    isValidLocation,
    isValidQuote,
    isValidDomain,
    isValidTartan,
    isValidAvatar,
    isValidCover,

    fullName,
    career,
    location,
    education,
    quote,
    domain,
    //avatar,
    //cover,
    //tartan,
  } = useUserProfileStore()

  const router = useRouter()

  const settingsClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/me/settings')
  }

  const handleSaveChanges = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!invalidData) return

    //console.log(fullName)

    const data: UserProfile = {
      basicInfo: {
        fullName,
        location,
        career,
        education,
      },
      quote: quote,
      domain: domain,
    }

    //console.log(data)

    // send data to server
    updateSettings(data)
  }

  useEffect(() => {
    if (
      !isValidFullName ||
      !isValidCareer ||
      !isValidEducation ||
      !isValidLocation ||
      !isValidQuote ||
      !isValidDomain ||
      !isValidAvatar ||
      !isValidCover ||
      !isValidTartan
    )
      setInvalidData(true)
  }, [
    isValidFullName,
    isValidCareer,
    isValidEducation,
    isValidLocation,
    isValidQuote,
    isValidDomain,
    isValidTartan,
    isValidAvatar,
    isValidCover,
  ])

  useEffect(() => {
    if (updateSettingsResponse) {
      if (
        updateSettingsResponse.status &&
        updateSettingsResponse.status === 'ok'
      ) {
        router.push('/me')
      } else if (
        updateSettingsResponse.statusCode &&
        updateSettingsResponse.statusCode === 201
      ) {
        router.push('/me')
      }
    }
  }, [updateSettingsResponse])

  useEffect(() => {
    if (updateSettingsError) {
      console.log('some server error scenario here')
      console.log(updateSettingsError)
    }
  }, [updateSettingsError])

  return (
    <StyledFunctional>
      <button
        className="btn btn-accent btn-outline"
        disabled={!invalidData}
        onClick={handleSaveChanges}
      >
        Save changes
      </button>
      <SettingsButton
        $active={true}
        disabled={false}
        type="button"
        onClick={settingsClick}
      >
        Settings
        <FontAwesomeIcon icon={faGear} />
      </SettingsButton>
    </StyledFunctional>
  )
}
export default EditHeaderFunctional
