import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const SignInSchema = z.object({
  email: z.string().email(),
  password: z
    .password() // string with advanced schemas
    .min(8) // Expect password length to be greater or equal to 8
    .max(36) // Expect password length to be less or equal to 100
    .atLeastOne('digit') // Expect password to have at least one digit
    .atLeastOne('lowercase') // Expect password to have at least one lowercase letter
    .atLeastOne('uppercase') // Expect password to have at least one uppercase letter
    .atLeastOne('special'), // Expect password to have at least one special symbol
})

const SignInSuccessSchema = z.object({
  statusCode: z.number(),
  userId: z.string(),
})

const FailSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export class SignInDto extends createZodDto(SignInSchema) {}
export class SignInSuccessDto extends createZodDto(SignInSuccessSchema) {}
export class FailDto extends createZodDto(FailSchema) {}
