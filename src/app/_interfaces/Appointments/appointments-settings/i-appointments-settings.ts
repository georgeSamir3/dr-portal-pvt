export interface IAppointmentsSettings{
  WorkingHours:IWorkingHoursSettings[],
  DaysOff:IDaysOffSettings[],

}

export interface IWorkingHoursSettings{
  dayOfWeek: number,
  startTime: string,
  endTime: string
}

export interface IDaysOffSettings{
  dayOfWeek: number,
}

export interface IConsulationDuration{
  flag:boolean;
}
