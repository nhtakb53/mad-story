export interface BasicInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  github?: string;
  blog?: string;
  linkedin?: string;
}

export interface Career {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: "초급" | "중급" | "고급" | "전문가";
}

export interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  role: string;
  techStack: string[];
  achievements: string[];
  url?: string;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  careers: Career[];
  skills: Skill[];
  educations: Education[];
  projects: Project[];
}
