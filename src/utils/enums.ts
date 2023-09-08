export enum Status {
  ACTIVE = 'Ativo',
  BLOCKED = 'Bloqueado',
  CANCELLED = 'Cancelado',
  PENDING = 'Pendente',
}

export enum BillingStatus {
  CANCELLED = 'Cancelado',
  EXEMPTED = 'Isento',
  PENDING = 'Pendente',
  PAID = 'Quitado',
  OVERDUE = 'Vencido',
}

export enum BillingTypes {
  DF = 'DF',
  DV = 'DV',
  DA = 'DA',
  RF = 'RF',
  RV = 'RV',
  RA = 'RA',
}
