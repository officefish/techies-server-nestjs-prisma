import { FC, useState } from 'react'

import CollapseSection from '../../ui/collapse.section'

import {
  StyledSettingsDiv,
  StyledSettingsField,
  StyledSettingsLabel,
} from '../../../styled-profile'

import { useUserProfileStore } from '@client/providers'

import { ITartanPatternColors } from '@client/models/profile.types'
import TartanPicker from './tartan-picker'

const VisualsTartan: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { tartan, setTartan, invalidTartan } = useUserProfileStore()

  const setColors = (newColors: ITartanPatternColors) => {
    if (tartan === undefined) return
    setTartan({
      id: tartan.id ? tartan.id : '1',
      svgSrc: null,
      pngSrc: null,
      colors: [...newColors],
    })
    invalidTartan()
  }

  const setSvgSrc = (svgSrc: string | null) => {
    if (tartan === undefined) return
    setTartan({ ...tartan, svgSrc })
    //invalidTartan()
  }

  const setPngSrc = (pngSrc: string | null) => {
    if (tartan === undefined) return
    setTartan({ ...tartan, pngSrc })
    //invalidTartan()
  }

  const handleCollabse = (newIsCollapsed: boolean) => {
    setIsCollapsed(newIsCollapsed)
  }

  return (
    <CollapseSection name="Tartan" onCollapse={handleCollabse}>
      <StyledSettingsDiv>
        <StyledSettingsField>
          <StyledSettingsLabel>Tartan pattern:</StyledSettingsLabel>
          <div className="flex flex-row w-full">
            <TartanPicker
              colors={tartan?.colors}
              setColors={setColors}
              pngSrc={tartan?.pngSrc ? tartan.pngSrc : null}
              setPngSrc={setPngSrc}
              svgSrc={tartan?.svgSrc ? tartan.svgSrc : null}
              setSvgSrc={setSvgSrc}
              blockRender={!isCollapsed}
            />
          </div>
        </StyledSettingsField>
      </StyledSettingsDiv>
    </CollapseSection>
  )
}

export default VisualsTartan
