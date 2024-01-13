import { useAxios_POST_RawData } from './axios.service'

interface ISuccessResponse {
  status: string
}

export const useUpdateProfile = () => {
  const {
    onSubmit: updateSettings,
    data: updateSettingsResponse,
    serverError: updateSettingsError,
  } = useAxios_POST_RawData<ISuccessResponse>({
    api: 'api/user-settings',
    route: 'update',
  })
  return {
    updateSettings,
    updateSettingsResponse,
    updateSettingsError,
  }
}
