import { IFile } from "@interfaces/Generic/i-file";

export interface IPatientMedicalTest {
    id: number;
    testDate: string;
    centerName: string;
    testCount?: number;
    isEditable: boolean;
    attachmentUrls: IFile[];
    testNames: string[];
    physiotherapyNames: string[];
    channelId: number;
    typeIds: number[];
    sourceType: number
}