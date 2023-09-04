import { IPreviousMedicalTest } from "./i-previous-medical-test";
import { IRecentMedicalTest } from "./i-recent-medical-test";

export interface IEmrMedicalTests {
  recentTestRequests: IRecentMedicalTest[];
  previousTestRequests: IPreviousMedicalTest[];
}
