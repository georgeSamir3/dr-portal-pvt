export interface GenericResponse<T> {
    data: T;
    message?: string;
    errorList?: errorListModel[];
}

export interface errorListModel{
    id: number,
    message: string
}
