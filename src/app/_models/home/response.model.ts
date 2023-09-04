import * as internal from "stream";

export interface Response<T> {
  data: T;
  message?: string;
  errorList?: string[];
}

export interface GenericResponse<T> {
  data: T;
  message?: string;
  errorList?: errorListModel[];
}

export interface SuccessResponse {
  data: {
    flag: boolean
  }
  message?: string;
  errorList?: errorListModel[];
}

export interface errorListModel{
  id: number,
  message: string
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
}


