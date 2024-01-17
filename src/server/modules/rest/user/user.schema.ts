import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const firstName = {
  firstName: z.string().min(2).max(24).optional(),
}

const lastName = {
  lastName: z.string().min(2).max(24).optional(),
}

const fullName = z.object({
  ...firstName,
  ...lastName,
})

const company = {
  company: z.string().min(2).max(48).optional(),
}

const role = {
  role: z.string().min(2).max(48).optional(),
}

const career = z.object({
  ...company,
  ...role,
})

const university = {
  university: z.string().min(2).max(48).optional(),
}

const faculty = {
  faculty: z.string().min(2).max(48).optional(),
}

const education = z.object({
  ...university,
  ...faculty,
})

const country = {
  country: z.string().min(2).max(48).optional(),
}

const region = {
  region: z.string().min(2).max(48).optional(),
}

const timeZone = {
  timeZone: z.string().min(2).max(48).optional(),
}

const location = z.object({
  ...country,
  ...region,
  ...timeZone,
})

const basicInfo = z.object({
  fullName: fullName.optional(),
  career: career.optional(),
  education: education.optional(),
  location: location.optional(),
})

const content = {
  content: z.string().min(5).max(120).optional(),
}

const quote = z.object({
  ...content,
})

const value = {
  value: z.string().min(4).max(22).optional(),
}

const domain = z.object({
  ...value,
})

const avatar = z.object({
  imageUrl: z.string().optional(),
  id: z.string().optional(),
})

const UpsetProfileSchema = z.object({
  basicInfo: basicInfo.optional(),
  quote: quote.optional(),
  domain: domain.optional(),
  avatar: avatar.optional(),
})

export class UpsetProfileDto extends createZodDto(UpsetProfileSchema) {}
export class GetDomainDto extends createZodDto(domain) {}
