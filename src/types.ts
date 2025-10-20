export interface UrbanDictionaryResult {
  term: string;
  definitions: Array<{
    definition: string;
    example: string;
    author: string;
  }>;
}

export interface UrbanDictionaryResponse {
  statusCode: number;
  term: string;
  found: boolean;
  data: Array<{
    word: string;
    meaning: string;
    example: string;
    contributor: string;
    date: string;
  }>;
}
