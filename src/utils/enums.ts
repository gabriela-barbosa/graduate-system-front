export enum Theme {
  gray = 'gray',
  white = 'white',
}

export enum Roles {
  ADMIN = 'ADMIN',
  GRADUATE = 'GRADUATE',
  PROFESSOR = 'PROFESSOR',
}

export const RoleTranslation = {
  [Roles.PROFESSOR]: 'Orientador',
  [Roles.ADMIN]: 'Administrador',
  [Roles.GRADUATE]: 'Egresso',
}
