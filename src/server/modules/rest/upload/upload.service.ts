import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { SharpService } from 'nestjs-sharp'
import fs from 'fs'

@Injectable()
export class UploadService {
  constructor(private readonly imageProcessing: SharpService) {}

  async convertToWebp(buffer: Buffer) {
    let fullName = null
    const promise = this.imageProcessing
      .edit(buffer)
      .webp()
      .toBuffer()
      .then((buf: Buffer) => {
        const dist = 'public/media'
        const uuid = randomUUID()
        const uuidTail = uuid.slice(-6)
        const fileName = `techies_${Date.now()}_${uuidTail}.webp`
        fullName = `${dist}/${fileName}`
        const path = `./${fullName}`
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
