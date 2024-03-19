import React from 'react'
import { getAPIClient } from '@services/axios'
import { USER_TOKEN_NAME } from '@utils/enums'
import { getCNPQLevelsOptions, getInstitutionTypesOptions } from '@modules/Commons/api'
import { SelectItem } from '@utils/types'
import GraduateEditPage from '@modules/WorkHistoryEdit/GraduateEditPage'
import {
  Fields,
  getGraduateInfoAndWorkHistory,
  GraduateWorkHistoriesInfo,
} from '@modules/WorkHistoryEdit'
import nookies from 'nookies'

interface Props {
  cnpqLevels: SelectItem[]
  graduateInfo: GraduateWorkHistoriesInfo
  hasCurrentCNPQScholarship: number
  hasCurrentWorkHistory: number
  hasPostDoctorate: number
  institutionTypes: SelectItem[]
}

const UserDetail = ({
  cnpqLevels,
  graduateInfo,
  hasCurrentCNPQScholarship,
  hasPostDoctorate,
  hasCurrentWorkHistory,
  institutionTypes,
}: Props) => (
  <GraduateEditPage
    cnpqLevels={cnpqLevels}
    graduateInfo={graduateInfo}
    hasCurrentCNPQScholarship={hasCurrentCNPQScholarship}
    hasCurrentWorkHistory={hasCurrentWorkHistory}
    hasPostDoctorate={hasPostDoctorate}
    institutionTypes={institutionTypes}
  />
)
export default UserDetail

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query
  const apiClient = getAPIClient(ctx)
  const cookies = nookies.get(ctx)

  if (!cookies[USER_TOKEN_NAME]) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const promises = [
    getGraduateInfoAndWorkHistory(apiClient, userId),
    getInstitutionTypesOptions(apiClient),
    getCNPQLevelsOptions(apiClient),
  ]

  const response = await Promise.all(promises)

  const someResult = response.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  const [graduateInfo, institutionTypes, cnpqLevels] = response

  const graduateInfoParsed = graduateInfo as GraduateWorkHistoriesInfo

  const getIfHasField = (field: Fields) => {
    return graduateInfoParsed.pendingFields.includes(field)
      ? -1
      : graduateInfoParsed.emptyFields.includes(field)
      ? 0
      : 1
  }

  const hasCurrentCNPQScholarship = getIfHasField(Fields.CNPQ_SCHOLARSHIP)
  const hasPostDoctorate = getIfHasField(Fields.POST_DOCTORATE)
  const hasCurrentWorkHistory = getIfHasField(Fields.WORK_HISTORY)

  return {
    props: {
      graduateInfo,
      institutionTypes,
      cnpqLevels,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      hasCurrentWorkHistory,
    },
  }
}
