export interface IAppVersionResponse {
  patientVersionApp: AppVersionDTO[]
}

export interface AppVersionDTO {
  id: number,
  version: string,
  description: string,
  dentifier?: number,
  updateDate?: Date,
  forceUpdate?: boolean,
  minimumVersion: string
}
