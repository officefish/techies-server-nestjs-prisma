import { StaticImageData } from 'next/image'
import { IBasicInfo, IQuote, IDomain } from './profile.types'
/**
 * Model User
 *
 */
const Role = {
  GUEST: 'GUEST',
  MEMBER: 'MEMBER',
  PUBLISHER: 'PUBLISHER',
  DEVELOPER: 'DEVELOPER',
  ADMIN: 'ADMIN',
}

export type Role = (typeof Role)[keyof typeof Role]

export interface UserMin {
  name?: string | null
  avatar?: StaticImageData
}

export interface User extends UserMin {
  id: string
  email: string
  verified: boolean
  authenticated: boolean
  role: Role
}

export interface UserProfile {
  basicInfo?: IBasicInfo
  quote?: IQuote
  domain?: IDomain
}
