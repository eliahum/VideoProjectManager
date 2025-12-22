export interface BaseResponse {
    isSuccess: boolean;
    errorText?: string;
}

export interface BaseDataResponse<T> extends BaseResponse {
    data?: T;
}
