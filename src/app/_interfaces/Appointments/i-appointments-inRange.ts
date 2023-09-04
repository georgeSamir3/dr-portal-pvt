export interface IAppointmentsInRange {
  physicalAppointments: IAppointments[];
  workingHours:IWorkingHours[];
  daysOff:IDaysOff[];
  hourSegment: number;
  deleteAppointments:IDeleteAppointments[];

}
export interface IDeleteAppointments extends IAppointments{
  flag:boolean
}

export interface IAppointments {
  patientName: string,
  appointmentId: number,
  startTime: string,
  endTime: string,
  patientId: number
}


export interface IWorkingHours {
  workingHoursId: number,
  day: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
}

export interface IDaysOff {
  dayOffId?: number,
  dayName?: string,
  dayOfWeek: number
}

export interface ISearchPatient{
  patientId: number,
  fullName: string,
  phone: string
}

export interface IPatientDetails{
  fullName: string,
  phone: string,
  height: number,
  weight: number,
  gender: string,
  birthdate: string
}
