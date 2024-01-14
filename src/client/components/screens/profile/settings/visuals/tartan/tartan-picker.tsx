import {
  FC,
  useState,
  useEffect,
  //useMemo,
  //useCallback,
  useRef,
  MouseEvent,
} from 'react'

import { getTartanAsRender } from '@client/services/tartan/svg-data.builder'
import { generateRandomPattern } from '@client/services/tartan/random-pattern'

import { styled } from 'styled-components'
import { ITartan, ITartanPatternColors } from '@client/models/profile.types'

//import Image from 'next/image'

export interface WithBackground {
  $background?: string
}

export const CoverImage = styled.div<WithBackground>`
  background-size: auto;
  background-repeat: repeat;
  ${(p) =>
    p.$background ? 'background-image: url("' + p.$background + '")' : ''}
`

interface ITartanPicker extends ITartan {
  setColors: (value: ITartanPatternColors) => void
  setSvgSrc: (value: string | null) => void
  setPngSrc: (value: string | null) => void
  blockRender: boolean
}

const TartanPicker: FC<ITartanPicker> = (props) => {
  const { pngSrc, setPngSrc, colors, setColors, setSvgSrc, blockRender } = props
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      // get svg builder render (valid <svg> html Tag )
      const newSvgData = await getTartanAsRender(colors)
      // conver <svg> tag to data
      const newBuf = `data:image/svg+xml;base64,${btoa(newSvgData)}`
      setSvgSrc(newBuf)

      const image = new Image()
      image.src = newBuf
      image.onload = function () {
        if (canvasRef.current) {
          const canvas: HTMLCanvasElement = canvasRef.current
          const context = canvas.getContext('2d')
          canvas.setAttribute('width', `${image.width}`)
          canvas.setAttribute('height', `${image.height}`)
          if (context) {
            context.drawImage(image, 0, 0)
            const canvasdata = canvas.toDataURL('image/png')
            setPngSrc(canvasdata)
            setIsLoading(false)
          }
        }
      }
    }

    if (pngSrc !== null) return
    if (blockRender) return

    fetchData()
  }, [colors, blockRender])

  const handleRandom = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const generate = async () => {
      setTimeout(async function () {
        //your code to be executed after 1 second
        const colors =
          (await generateRandomPattern()) satisfies ITartanPatternColors
        setColors(colors)
      }, 1000)
    }
    generate()
  }
  //const memoizedPng = useMemo(() => pngSrc, [pngSrc])
  return (
    <div className="w-full grid grid-rows-1 grid-cols-6 gap-4">
      <div className="col-span-4">
        {isLoading || pngSrc === null ? (
          <div className="w-full h-40 outline-none border-2 rounded flex items-center justify-center border-accent dark:border-accent-dark">
            <span className="loading loading-ring text-accent dark:text-accent-dark loading-lg"></span>
          </div>
        ) : (
          <CoverImage
            $background={pngSrc ? pngSrc : undefined}
            className="w-full h-40 rounded"
          />
        )}
        <canvas ref={canvasRef} hidden />
      </div>
      <div className="col-span-2">
        <div className="w-full h-full relative">
          <button
            className="btn btn-accent btn-outline btn-block absolute top-0"
            onClick={handleRandom}
          >
            Random
          </button>
          <button
            className="btn btn-accent btn-outline btn-block absolute bottom-0"
            disabled
          >
            Editor
          </button>
        </div>
      </div>
    </div>
  )
}

export default TartanPicker
