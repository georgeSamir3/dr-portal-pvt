export interface ILoggedinUser {
  doctorId: number;
  fullName: string;
  imagePath: string;
  accessToken: string;
  permissions: string[];
  refreshToken: string;
}
