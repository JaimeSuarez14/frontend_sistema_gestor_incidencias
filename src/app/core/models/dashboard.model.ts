export interface DashboardAdmin {
  incidentStats: IncidentStatsDTO,
  userStats: UserStats,
  latestUsers: LatestUserDTO []
}


interface IncidentStatsDTO {
  total: number, abiertas: number, enProgreso: number, cerradas: number
}

interface UserStats {
  totalUsuarios : number,
  areas: AreasTotal[]

}

interface AreasTotal {
  area: string, cantidad:number
}

interface LatestUserDTO {
  nombre: string, estado: string
}
