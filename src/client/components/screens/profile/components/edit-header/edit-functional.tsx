import { FC, MouseEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useUserProfileStore } from '@client/providers'

import { useUpdateProfile } from '@client/services/user-profile.service'

import { StyledFunctional, SettingsButton } from '../../styled-profile'
import { IUserProfile } from '@/client/models/user.model'
import {
  IAvatar,
  //IBasicInfo,
  ICareer,
  IDomain,
  IEducation,
  IFullName,
  ILocation,
  IQuote,
  ICover,
} from '@/client/models/profile.types'

interface UserProfileDataProps {
  fullName: IFullName
  education: IEducation
  career: ICareer
  location: ILocation
  quote: IQuote
  domain: IDomain
  avatar: IAvatar
  cover: ICover
}

const prepareUserProfileData = async (
  props: UserProfileDataProps,
): Promise<IUserProfile> => {
  const {
    fullName,
    education,
    career,
    location,
    quote,
    domain,
    avatar,
    cover,
  } = props
  const fullNameData: IFullName = {
    firstName:
      fullName.firstName && fullName.firstName.length
        ? fullName.firstName
        : undefined,
    lastName:
      fullName.lastName && fullName.lastName.length
        ? fullName.lastName
        : undefined,
  }

  const locationData: ILocation = {
    country:
      location.country && location.country.length
        ? location.country
        : undefined,
    region:
      location.region && location.region.length ? location.region : undefined,
    timeZone:
      location.timeZone && location.timeZone.length
        ? location.timeZone
        : undefined,
  }

  const careerData: ICareer = {
    company:
      career.company && career.company.length ? career.company : undefined,
    role: career.role && career.role.length ? career.role : undefined,
  }

  const educationData: IEducation = {
    university:
      education.university && education.university.length
        ? education.university
        : undefined,
    faculty:
      education.faculty && education.faculty.length
        ? education.faculty
        : undefined,
  }
  /* BasicInfo, Quote, Domain data preparation */
  const response = {
    basicInfo: {
      fullName: fullNameData,
      location: locationData,
      career: careerData,
      education: educationData,
    },
    quote,
    domain,
  }
  /* Avatar */
  if (avatar.croppedImageUrl) {
    response['avatar'] = { imageUrl: avatar.croppedImageUrl }
  }
  /* Cover */
  console.log(cover.imageUrl)
  response['cover'] = { imageUrl: cover.imageUrl }

  return response
}

const EditHeaderFunctional: FC = () => {
  const [invalidData, setInvalidData] = useState(false)

  const {
    updateUserProfile,
    updateUserProfileResponse,
    updateUserProfileError,
  } = useUpdateProfile()

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
    avatar,
    cover,
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

    prepareUserProfileData({
      fullName,
      location,
      career,
      education,
      quote,
      domain,
      avatar,
      cover,
    }).then((data) => {
      updateUserProfile(data)
    })
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
    if (updateUserProfileResponse) {
      if (
        updateUserProfileResponse.status &&
        updateUserProfileResponse.status === 'ok'
      ) {
        router.push('/me')
      } else if (
        updateUserProfileResponse.statusCode &&
        updateUserProfileResponse.statusCode === 201
      ) {
        router.push('/me')
      }
    }
  }, [updateUserProfileResponse])

  useEffect(() => {
    if (updateUserProfileError) {
      console.log('some server error scenario here')
      console.log(updateUserProfileError)
    }
  }, [updateUserProfileError])

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
