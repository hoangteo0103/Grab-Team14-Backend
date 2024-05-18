import JobSearchBody from './jobSearchBody.interface';

export default interface JobSearchResult {
  id: string;
  hits: {
    total: number;
    hits: Array<{
      _source: JobSearchBody;
    }>;
  };
}
