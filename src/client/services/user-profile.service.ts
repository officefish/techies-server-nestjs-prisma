import { useAxiosFetcher_GET, useAxios_POST_RawData } from './axios.service'
import useSWR from 'swr'

import { UserProfile } from '@client/models/user.model'
interface ISuccessResponse {
  status?: string
  statusCode?: number
}

const API_PREFIX = 'api/v1'
const DIRECTORY = 'user/profile'

export const useUpdateProfile = () => {
  const {
    onSubmit: updateSettings,
    data: updateSettingsResponse,
    serverError: updateSettingsError,
  } = useAxios_POST_RawData<ISuccessResponse>({
    api: API_PREFIX,
    route: `${DIRECTORY}`,
  })
  return {
    updateSettings,
    updateSettingsResponse,
    updateSettingsError,
  }
}

export const useUserProfile = () => {
  const route = DIRECTORY
  const key = `${API_PREFIX}/${route}`

  const { fetcher } = useAxiosFetcher_GET({ api: API_PREFIX, route })

  const {
    data: userProfile,
    error,
    isValidating,
    mutate,
  } = useSWR<UserProfile>(key, fetcher)

  return { userProfile, error, isValidating, mutate }
}
