export interface IReserveAppointments {
  patientName: string,
  appointmentId: number,
  startTime: string,
  endTime: string,
  patientId: any
}

export interface IAddNewPatientAndReserveRequest {
  birthdate: Date,
  fullName: string,
  gender: string,
  height: number,
  phone: string,
  weight: number,
  startDateTime: string
}
