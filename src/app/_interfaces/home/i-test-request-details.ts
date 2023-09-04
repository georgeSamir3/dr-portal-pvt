export interface ITestRequestDetails {
  patientPersonalDetails: IPatientPersonalDetails;
  testRequestInformation: ITestRequestInformation;
  testRequestPlace: ITestRequestPlace;
  medicalTests: ITestMedicalTest[];
  paymentInformation: IPaymentInformation;
  physiotherapies: string[]
}

export interface IPatientPersonalDetails {
  fullName?: string;
  nationalId?: string;
  phone?: string;
}

export interface ITestRequestInformation {
  centerName?: string;
  channelId?: number;
  creationDate?: string;
  id?: number;
  status?: string;
}

export interface ITestRequestPlace {
  branch?: string;
  branchAddress?: string;
  branchPhone?: string;
  patientAddress?: string;
  place?: string;
}

export interface ITestMedicalTest {
  fees?: number;
  promoCode?: string;
  resultPath?: string;
  results?: string;
  testId?: number;
  testName?: string;
}

export interface IPaymentInformation {
  invoice?: IInvoiceInformation;
  invoiceNumber?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface IInvoiceInformation {
  discount?: number;
  promoCode?: string;
  totalFeesAfterDiscount?: number;
  totalFeesBeforeDiscount?: number;
}
