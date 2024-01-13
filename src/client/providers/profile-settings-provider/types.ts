import {
  ICareer,
  IEducation,
  IFullName,
  ILocation,
  IQuote,
  IDomain,
  IAvatar,
  ICover,
  ITartan,
} from '@client/models/profile.types'

export interface ISettingsState {
  fullName?: IFullName
  setFullName: (newFullName: IFullName) => void
  isValidFullName: boolean
  invalidFullName: () => void
  location?: ILocation
  setLocation: (newLocation: ILocation) => void
  isValidLocation: boolean
  invalidLocation: () => void
  career?: ICareer
  setCareer: (newCareer: ICareer) => void
  isValidCareer: boolean
  invalidCareer: () => void
  education?: IEducation
  setEducation: (newEducation: IEducation) => void
  isValidEducation: boolean
  invalidEducation: () => void
  quote?: IQuote
  setQuote: (newQuote: IQuote) => void
  isValidQuote: boolean
  invalidQuote: () => void
  domain?: IDomain
  setDomain: (newDomain: IDomain) => void
  isValidDomain: boolean
  invalidDomain: () => void
  avatar?: IAvatar
  setAvatar: (newAvatar: IAvatar) => void
  isValidAvatar: boolean
  invalidAvatar: () => void
  cover?: ICover
  setCover: (newCover: ICover) => void
  isValidCover: boolean
  invalidCover: () => void
  tartan?: ITartan
  setTartan: (newTartan: ITartan) => void
  isValidTartan: boolean
  invalidTartan: () => void
}
