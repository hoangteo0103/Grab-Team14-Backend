import JobSearchBody from './jobSearchBody.interface';

export default interface JobSearchResult {
  id: string;
  total: {
    value: number;
  };
  hits: {
    total: number;
    hits: Array<{
      _source: JobSearchBody;
      _score: number;
    }>;
  };
}
