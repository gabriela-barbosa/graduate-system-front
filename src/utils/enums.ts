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
