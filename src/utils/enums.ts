export enum Theme {
  gray = 'gray',
  white = 'white',
}

export const USER_TOKEN_NAME = 'user.token'

export enum Role {
  ADMIN = 'ADMIN',
  GRADUATE = 'GRADUATE',
  PROFESSOR = 'PROFESSOR',
}

export const RoleTranslation = {
  [Role.PROFESSOR]: 'Orientador',
  [Role.ADMIN]: 'Administrador',
  [Role.GRADUATE]: 'Egresso',
  multiple: 'Múltiplos',
}

export enum Routes {
  LOGIN = '/',
  GRADUATES = '/egressos',
  GRADUATE = '/egressos/:id',
  MANAGEMENT = '/gerenciamento',
  MANAGEMENT_EMAILS = '/gerenciamento/emails',
  MANAGEMENT_INSTITUTIONS = '/gerenciamento/instituicoes',
  MANAGEMENT_INSTITUTIONS_TYPES = '/gerenciamento/tiposdeinstituicao',
  MANAGEMENT_USERS = '/gerenciamento/usuarios',
  MANAGEMENT_USER = '/gerenciamento/usuarios/:id',
  MANAGEMENT_CNPQ_LEVELS = '/gerenciamento/niveiscnpq',
  MANAGEMENT_CI_PROGRAMS = '/gerenciamento/programasic',
}
