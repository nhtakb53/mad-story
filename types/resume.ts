export interface BasicInfo {
  name: string;
  nameEn?: string;
  nickname?: string;
  email: string;
  phone: string;
  github?: string;
  blog?: string;
  linkedin?: string;
  introduce?: string;
  profileImage?: string;
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
  level: 1 | 2 | 3;
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
