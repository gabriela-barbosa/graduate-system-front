export interface PaginationType {
  page: number
  size: number
  total: number
}

export interface ListGraduatesFilters {
  name: string
  institutionName: string
  institutionType: number
}
