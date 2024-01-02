import { Injectable } from '@nestjs/common'
import { PrismaService } from '@modules/prisma/prisma.service'
import { User, Prisma, BasicInfo, Quote, Domain } from '@prisma/client'

interface FullNameInput {
  firstName?: string
  lastName?: string
}

interface CareerInput {
  company?: string
  role?: string
}

interface EducationInput {
  university?: string
  faculty?: string
}

interface LocationInput {
  country?: string
  region?: string
  timeZone?: string
}

interface BasicInfoInput {
  fullName?: FullNameInput
  career?: CareerInput
  education?: EducationInput
  location?: LocationInput
}

interface QuoteInput {
  content?: string
}

interface DomainInput {
  value?: string
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })
    if (user) return user

    return this.prisma.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({ where })

    const basicInfo = await this.prisma.basicInfo.findUnique({
      where: { userId: user.id },
    })

    if (basicInfo) {
      await this.prisma.$transaction([
        this.prisma.fullName.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.career.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.education.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.location.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.basicInfo.delete({ where: { id: basicInfo.id } }),
      ])
    }

    const quote = await this.prisma.quote.findUnique({
      where: { userId: user.id },
    })

    if (quote) {
      await this.prisma.quote.delete({ where: { id: quote.id } })
    }

    const domain = await this.prisma.domain.findUnique({
      where: { userId: user.id },
    })

    if (domain) {
      await this.prisma.domain.delete({ where: { id: domain.id } })
    }

    return this.prisma.user.delete({
      where,
    })
  }

  async upsetUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserCreateInput
  }): Promise<User> {
    const { where, data } = params

    return this.prisma.user.upsert({
      where,
      update: { ...data },
      create: { ...data },
    })
  }

  getBaseInfoCreateInputs = (data: BasicInfoInput) => {
    const firstName = data.fullName?.firstName || ''
    const lastName = data.fullName?.lastName || ''
    const company = data.career?.company || ''
    const role = data.career?.role || ''
    const university = data.education?.university || ''
    const faculty = data.education?.faculty || ''
    const country = data.location?.country || ''
    const region = data.location?.region || ''
    const timeZone = data.location?.timeZone || ''

    const fullNameCreateInput: Prisma.FullNameCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          firstName,
          lastName,
        },
      }
    const careerCreateInput: Prisma.CareerCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          company,
          role,
        },
      }
    const educationCreateInput: Prisma.EducationCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          university,
          faculty,
        },
      }
    const locationCreateInput: Prisma.LocationCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          country,
          region,
          timeZone,
        },
      }
    return {
      fullNameCreateInput,
      careerCreateInput,
      educationCreateInput,
      locationCreateInput,
    }
  }

  getBaseInfoUpdateInputs = (data: BasicInfoInput) => {
    const firstName = data.fullName?.firstName || ''
    const lastName = data.fullName?.lastName || ''
    const company = data.career?.company || ''
    const role = data.career?.role || ''
    const university = data.education?.university || ''
    const faculty = data.education?.faculty || ''
    const country = data.location?.country || ''
    const region = data.location?.region || ''
    const timeZone = data.location?.timeZone || ''

    const fullNameUpdateInput: Prisma.FullNameUpdateOneWithoutBasicInfoNestedInput =
      data.fullName
        ? {
            update: {
              firstName,
              lastName,
            },
          }
        : {}
    const careerUpdateInput: Prisma.CareerUpdateOneWithoutBasicInfoNestedInput =
      data.career
        ? {
            update: {
              company,
              role,
            },
          }
        : {}

    const educationUpdateInput: Prisma.EducationUpdateOneWithoutBasicInfoNestedInput =
      data.education
        ? {
            update: {
              university,
              faculty,
            },
          }
        : {}

    const locationUpdateInput: Prisma.LocationUpdateOneWithoutBasicInfoNestedInput =
      data.location
        ? {
            update: {
              country,
              region,
              timeZone,
            },
          }
        : {}

    return {
      fullNameUpdateInput,
      careerUpdateInput,
      educationUpdateInput,
      locationUpdateInput,
    }
  }

  async upsetBasicInfo(params: {
    user: Prisma.UserWhereUniqueInput
    data: BasicInfoInput
  }): Promise<BasicInfo> {
    const { user, data } = params

    /* Create Inputs */
    const {
      fullNameCreateInput,
      careerCreateInput,
      educationCreateInput,
      locationCreateInput,
    } = this.getBaseInfoCreateInputs(data)

    const basicInfoCreateInput: Prisma.BasicInfoCreateInput = {
      user: { connect: { id: user.id } },
      fullName: fullNameCreateInput,
      career: careerCreateInput,
      education: educationCreateInput,
      location: locationCreateInput,
    }

    /* Update Inputs */
    const {
      fullNameUpdateInput,
      careerUpdateInput,
      educationUpdateInput,
      locationUpdateInput,
    } = this.getBaseInfoUpdateInputs(data)

    const basicInfoUpdateInput: Prisma.BasicInfoUpdateInput = {
      user: { connect: { id: user.id } },
      fullName: fullNameUpdateInput,
      career: careerUpdateInput,
      education: educationUpdateInput,
      location: locationUpdateInput,
    }

    return this.prisma.basicInfo.upsert({
      where: { userId: user.id },
      create: basicInfoCreateInput,
      update: basicInfoUpdateInput,
    })
  }

  async upsetQuote(params: {
    user: Prisma.UserWhereUniqueInput
    data: QuoteInput
  }): Promise<Quote> {
    const { user, data } = params

    const content = data.content || ''

    const quoteCreateInput: Prisma.QuoteCreateInput = {
      user: { connect: { id: user.id } },
      content,
    }

    const quoteUpdateInput: Prisma.QuoteUpdateInput = {
      user: { connect: { id: user.id } },
      content,
    }

    return this.prisma.quote.upsert({
      where: { userId: user.id },
      create: quoteCreateInput,
      update: quoteUpdateInput,
    })
  }

  async upsetDomain(params: {
    user: Prisma.UserWhereUniqueInput
    data: DomainInput
  }): Promise<Domain> {
    const { user, data } = params

    const value = data.value || ''

    if (value.length) {
      const notUniqueValue = await this.domain({ value })
      if (notUniqueValue) return null
    }

    const domainCreateInput: Prisma.DomainCreateInput = {
      user: { connect: { id: user.id } },
      value,
    }

    const domainUpdateInput: Prisma.DomainUpdateInput = {
      user: { connect: { id: user.id } },
      value,
    }

    return this.prisma.domain.upsert({
      where: { userId: user.id },
      create: domainCreateInput,
      update: domainUpdateInput,
    })
  }

  async domain(
    domainWhereUniqueInput: Prisma.DomainWhereUniqueInput,
  ): Promise<Domain | null> {
    return this.prisma.domain.findUnique({
      where: domainWhereUniqueInput,
    })
  }
}
