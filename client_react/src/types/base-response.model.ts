export interface BaseDataResponse<T> {
  isSuccess: boolean;
  data?: T;
  errorText?: string;
}
