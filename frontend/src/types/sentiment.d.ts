declare module "sentiment" {
  export interface AnalyzeOptions {
    extras?: Record<string, number>;
  }

  export interface AnalyzeResult {
    score: number;
    comparative: number;
    calculation: Array<[string, number]>;
    tokens: string[];
    words: string[];
  }

  export default class Sentiment {
    analyze(text: string, options?: AnalyzeOptions): AnalyzeResult;
  }
}
