
     export interface IPatientList {
        items : IItems [];
        pagination : IPagination;
     }

     export interface IItems {
        patientId : number,
        fullName : string,
        phone : string
     }
     
     export interface IPagination {
        currentPage : number,
        totalPages : number,
        totalItems : number
     }
        