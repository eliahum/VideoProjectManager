export interface BaseResponseDTO {
    isSuccess: boolean;
    errorText?: string;
}

export interface BaseDataResponseDTO<T> extends BaseResponseDTO {
    data?: T;
}
