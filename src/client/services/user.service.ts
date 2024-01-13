import {
  useAxiosFetcher_GET,
  useAxios_GET_QueryParams,
  useAxios_POST_RawData_Redirect,
} from './axios.service'
import useSWR from 'swr'
import { SubmitHandler } from 'react-hook-form'
import { FieldValues } from 'react-hook-form'
import { User } from '@client/models/user.model'
//import { useState } from "react"

import { Dispatch, SetStateAction } from 'react'

const API_PREFIX = 'api/v1/user'

export function useUser() {
  const route = 'me'
  const key = `${API_PREFIX}/${route}`

  const { fetcher } = useAxiosFetcher_GET({ api: API_PREFIX, route })

  const { data: user, error, isValidating, mutate } = useSWR<User>(key, fetcher)

  return { user, error, isValidating, mutate }
}

type ForgotPasswordHookProps = {
  setEmail: Dispatch<SetStateAction<string>>
}

export const useResetPassword = () => {
  const { onSubmit, serverError } = useAxios_POST_RawData_Redirect({
    api: API_PREFIX,
    route: 'reset',
    redirect: 'auth/sign-in',
  })
  return { onSubmit, serverError }
}

export const useForgotPassword = <T = object>({
  setEmail,
}: ForgotPasswordHookProps) => {
  const {
    onSubmit: onSubmitMiddleware,
    reply,
    serverError,
  } = useAxios_GET_QueryParams<T>({
    api: API_PREFIX,
    route: 'forgot-password',
  })

  const onSubmit: SubmitHandler<FieldValues> = async ({ email }) => {
    onSubmitMiddleware(email)
    setEmail(email)
  }

  return { onSubmit, reply, serverError }
}
