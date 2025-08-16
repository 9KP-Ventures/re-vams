export type ParamValue = string | number | boolean;
export type TransformFunction = (value: ParamValue) => string;
export interface ParamConfig {
  apiKey: string;
  default?: ParamValue;
  transform?: TransformFunction;
}
