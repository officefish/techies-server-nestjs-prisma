import { FC, useState, ChangeEvent, useEffect } from 'react'
import useComponentOutside from '@client/hooks/component-outside'

import {
  StyledCollapseSection,
  StyledCollapseSectionTitle,
  StyledCollapseSectionContent,
  SettingsContentDelimeter,
  StyledSettingsForm,
  StyledSettingsField,
  StyledSettingsLabel,
  StyledSettingsInput,
} from '../../styled-profile'

import { useProfileSettingStore } from '@client/providers'

const BasicInfoFullname: FC = () => {
  const { ref, isComponentOutside } = useComponentOutside(true)
  const [forseCollapse, setForseCollapse] = useState(false)

  const { fullName, setFullName, invalidFullName } = useProfileSettingStore()

  const setFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setFullName({ ...fullName, firstName: e.target.value })
    invalidFullName()
  }

  const setSecondName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setFullName({ ...fullName, secondName: e.target.value })
    invalidFullName()
  }

  useEffect(() => {
    setForseCollapse(!isComponentOutside)
  }, [isComponentOutside])

  return (
    <StyledCollapseSection ref={ref} $forceCollapse={forseCollapse}>
      <input type="checkbox" className="w-[1px] h-[1px]" />
      <StyledCollapseSectionTitle>Fullname:</StyledCollapseSectionTitle>
      <StyledCollapseSectionContent>
        <SettingsContentDelimeter />
        <StyledSettingsForm action="">
          <StyledSettingsField>
            <StyledSettingsLabel>First name:</StyledSettingsLabel>
            <StyledSettingsInput
              type="text"
              value={fullName?.firstName}
              onChange={setFirstName}
            />
          </StyledSettingsField>
          <StyledSettingsField>
            <StyledSettingsLabel>Last name:</StyledSettingsLabel>
            <StyledSettingsInput
              type="text"
              value={fullName?.secondName}
              onChange={setSecondName}
            />
          </StyledSettingsField>
        </StyledSettingsForm>
      </StyledCollapseSectionContent>
    </StyledCollapseSection>
  )
}

export default BasicInfoFullname
