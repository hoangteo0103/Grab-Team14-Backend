export default interface JobSearchBody {
  id: number;
  title: string;
  desciption?: string;
  location?: string;
  type?: string;
  experience?: string;
  industry?: string;
  workingMode?: string;
  date?: Date;
  requirements?: [string];
  company: string;
  companyLink: string;
  companyImageUrl?: string;
  companyLocation?: string;
  jobLink: string;
  applyLink?: string;
  time?: string;
}
