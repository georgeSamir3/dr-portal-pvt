export interface IMedicalTestDetails{
    id: number;
    patientPersonalDetails: IPatientPersonalDetailsDTO;
    testRequestInformation: IEhrTestRequestInformationDTO;
    paymentInformation: PatientPaymentInformationDTO;
    medicalTests: IMedicalTestDetailDTO;
    physiotherapies: IMedicalTestDetailDTO;
    radiologies: IMedicalTestDetailDTO;
    testRequestLocation: IEhrTestRequestLocationDTO;
}

export interface IPatientPersonalDetailsDTO{
    fullName: string;
    phone: string;
    nationalId: string;
}

export interface IEhrTestRequestInformationDTO{
    id: number;
    creationDate: Date;
    channel: ChannelDTO;
    centerNames: string[];
    status: string;
}

interface ChannelDTO{
    id: number;
    name: string;
}

interface PatientPaymentInformationDTO{
    invoiceNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    invoice: EhrTestRequestInvoiceDTO;
}

interface EhrTestRequestInvoiceDTO{
    totalFeesBeforeDiscount: number;
    promoCode: string;
    discount: number;
    totalFeesAfterDiscount: number
}

export interface IMedicalTestDetailDTO{
    testRequestResults: IFileDTO[];
    testRequestDetails: IMedicalTestRequestDetailsDTO[];
}

export interface IMedicalTestRequestDetailsDTO{
    id: number;
    test: TestDTO;
    promoCode: string;
    Fees: number;
    resultFiles: IFileDTO[]
}

interface TestDTO{
    id: number;
    name: string;
}

export interface IFileDTO{
    id: number;
    path: string;
}

export interface IEhrTestRequestLocationDTO{
    location: string;
    patientAddress: string;
    branch: BranchDTO;
}

interface BranchDTO{
    id: number;
    name: string;
    phone: string;
    address: string
}

export interface IMedicalTestFilesDetailsDTO{
    title?: string;
    filePaths: string[];
    uploadedFilesCount: number;
}

export interface IAttachmentsFilesDTO{
    attachmentUrls: IFileDTO[]
}