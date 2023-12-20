import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { User, Prisma, BasicInfo } from '@prisma/client'

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

    // const basicInfo2 = await this.prisma.basicInfo.findUnique({
    //   where: { user: { email: where.email } },
    // })

    if (basicInfo) {
      await this.prisma.$transaction([
        this.prisma.fullName.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.career.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.education.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.location.delete({ where: { basicInfoId: basicInfo.id } }),
        this.prisma.basicInfo.delete({ where: { id: basicInfo.id } }),
      ])
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
    const fullNameCreateInput: Prisma.FullNameCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          firstName: data.fullName.firstName,
          lastName: data.fullName.lastName,
        },
      }
    const careerCreateInput: Prisma.CareerCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          company: data.career.company,
          role: data.career.role,
        },
      }
    const educationCreateInput: Prisma.EducationCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          university: data.education.university,
          faculty: data.education.faculty,
        },
      }
    const locationCreateInput: Prisma.LocationCreateNestedOneWithoutBasicInfoInput =
      {
        create: {
          country: data.location.country,
          region: data.location.region,
          timeZone: data.location.timeZone,
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
    const fullNameUpdateInput: Prisma.FullNameUpdateOneWithoutBasicInfoNestedInput =
      {
        update: {
          firstName: data.fullName.firstName,
          lastName: data.fullName.lastName,
        },
      }
    const careerUpdateInput: Prisma.CareerUpdateOneWithoutBasicInfoNestedInput =
      {
        update: {
          company: data.career.company,
          role: data.career.role,
        },
      }
    const educationUpdateInput: Prisma.EducationUpdateOneWithoutBasicInfoNestedInput =
      {
        update: {
          university: data.education.university,
          faculty: data.education.faculty,
        },
      }
    const locationUpdateInput: Prisma.LocationUpdateOneWithoutBasicInfoNestedInput =
      {
        update: {
          country: data.location.country,
          region: data.location.region,
          timeZone: data.location.timeZone,
        },
      }
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
}
