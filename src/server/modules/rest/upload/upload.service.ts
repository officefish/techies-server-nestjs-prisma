import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { SharpService } from 'nestjs-sharp'
import fs from 'fs'
import { ResizeOptions } from 'sharp'

@Injectable()
export class UploadService {
  constructor(private readonly imageProcessing: SharpService) {}

  async bufferFromURI(uri: string) {
    const response = await fetch(uri)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async convertToWebp(
    buffer: Buffer,
    width = 160,
    height = 160,
    options = {
      //kernel: sharp.kernel.nearest,
      fit: 'contain',
      position: 'right top',
      background: { r: 255, g: 255, b: 255, alpha: 0.5 },
    } as ResizeOptions,
  ) {
    let fullName = null
    const promise = this.imageProcessing
      .edit(buffer)
      .webp()
      .resize(width, height, options)
      .toBuffer()
      .then((buf: Buffer) => {
        const dist = 'public/media'
        const uuid = randomUUID()
        const uuidTail = uuid.slice(-6)
        const fileName = `techies_${Date.now()}_${uuidTail}.webp`
        fullName = `/${dist}/${fileName}`
        const path = `.${fullName}`
        const stream = fs.createWriteStream(path)
        stream.once('open', function () {
          stream.write(buf)
          stream.end()
        })
      })
    //   .catch((err) => {
    //     console.log(err)
    //     return null
    //   })
    await promise
    return fullName
    //console.log('finish')
    //return null
  }
}
