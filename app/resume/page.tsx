"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Github } from "lucide-react";
import { getBasicInfo, getCareers, getSkills, getEducations, getProjects } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { TopHeader } from "@/components/top-header";

interface BasicInfo {
  name: string;
  name_en?: string;
  nickname?: string;
  email: string;
  phone: string;
  github?: string;
  blog?: string;
  linkedin?: string;
  introduce?: string;
  profile_image?: string;
  tags?: string[];
}

interface Career {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  achievements: string[];
  logo_url?: string;
  logo_fit?: "contain" | "cover";
}

interface Skill {
  id: string;
  category: string;
  name: string;
  level: number;
}

interface Education {
  id: string;
  school: string;
  major?: string;
  degree?: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  logo_url?: string;
  logo_fit?: "contain" | "cover";
}

interface Project {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  role?: string;
  tech_stack: string[];
  achievements: string[];
  url?: string;
  logo_url?: string;
  logo_fit?: "contain" | "cover";
}

const getLevelText = (level: number) => {
  const levels = {
    1: "기본적인 사용 경험과 협업에 필요한 지식 보유",
    2: "매우 능숙하지는 않지만 업무 수행 가능",
    3: "관련 지식과 경험이 풍부하며 능숙하게 업무 진행 가능",
  };
  return levels[level as keyof typeof levels] || "";
};

const highlightKeywords = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const keyword = part.slice(2, -2);
      return <span key={index} className="font-bold">{keyword}</span>;
    }
    return part;
  });
};

export default function ResumePage() {
  const { data: basicInfo, loading: loadingBasic } = useSupabaseData<BasicInfo>(getBasicInfo, []);
  const { data: careers, loading: loadingCareers } = useSupabaseData<Career[]>(getCareers, []);
  const { data: skills, loading: loadingSkills } = useSupabaseData<Skill[]>(getSkills, []);
  const { data: educations, loading: loadingEducations } = useSupabaseData<Education[]>(getEducations, []);
  const { data: projects, loading: loadingProjects } = useSupabaseData<Project[]>(getProjects, []);

  const [selectedSections, setSelectedSections] = useState({
    basic: true,
    career: true,
    skills: true,
    education: true,
    projects: true,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sortedCareers = careers ? [...careers].sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  }) : [];

  const sortedProjects = projects ? [...projects].sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  }) : [];

  const groupedSkills = (skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const totalCareerMonths = (careers || []).reduce((total, career) => {
    const start = new Date(career.start_date);
    const end = career.current ? new Date() : new Date(career.end_date || career.start_date);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);

  const years = Math.floor(totalCareerMonths / 12);
  const months = totalCareerMonths % 12;

  const loading = loadingBasic || loadingCareers || loadingSkills || loadingEducations || loadingProjects;

  const ResumeContent = () => (
    <div className="a4-page bg-white">
      {selectedSections.basic && basicInfo && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm print:break-inside-avoid">
          <div className="flex flex-row-reverse items-start gap-4">
            {basicInfo.profile_image && (
                <img
                    src={basicInfo.profile_image}
                    alt={basicInfo.name}
                    className="w-65 h-75 object-cover rounded-lg"
                />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-0.5 tracking-tight mb-2">
                {basicInfo.name || "이름 없음"}
              </h1>
              {(basicInfo.name_en || basicInfo.nickname) && (
                  <p className="text-md text-gray-600 mb-3">
                    {[basicInfo.name_en, basicInfo.nickname].filter(Boolean).join(" / ")}
                  </p>
              )}
              <div className="flex flex-col gap-1 text-xs text-gray-600">
                {basicInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="shrink-0" />
                      <a href={`mailto:${basicInfo.email}`} className="hover:text-gray-900 transition-colors">
                        {basicInfo.email}
                      </a>
                    </div>
                )}
                {basicInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="shrink-0" />
                      <span>{basicInfo.phone}</span>
                    </div>
                )}
                {basicInfo.github && (
                    <div className="flex items-center gap-2">
                      <Github size={18} className="shrink-0" />
                      <a
                          href={
                            basicInfo.github.startsWith("http")
                                ? basicInfo.github
                                : `https://github.com/${basicInfo.github.replace("@", "")}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-gray-900 transition-colors truncate"
                          title={basicInfo.github}
                      >
                        {basicInfo.github}
                      </a>
                    </div>
                )}
              </div>
              {basicInfo.tags && basicInfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {basicInfo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {basicInfo.introduce && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {highlightKeywords(basicInfo.introduce)}
              </p>
            </div>
          )}
        </div>
      )}

      {selectedSections.career && sortedCareers.length > 0 && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <h2 className="text-base font-semibold text-gray-900">경력</h2>
            <span className="text-xs px-2 py-0.5 rounded border border-gray-800 text-gray-800 bg-white">
              총 {years > 0 ? `${years}년 ${months}개월` : `${months}개월`}
            </span>
          </div>
          <div className="space-y-3">
            {sortedCareers.map((career) => {
              const start = new Date(career.start_date);
              const end = career.current ? new Date() : new Date(career.end_date || career.start_date);
              const careerMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
              const careerYears = Math.floor(careerMonths / 12);
              const careerRemainingMonths = careerMonths % 12;

              return (
                <div key={career.id} className="rounded-md bg-white p-3 shadow-sm border border-gray-200 print:break-inside-avoid">
                  {/* 상단: 로고 + 제목/정보 */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* 로고 영역 */}
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-gray-400 text-xs font-bold shrink-0 overflow-hidden p-1">
                      {career.logo_url ? (
                        <img src={career.logo_url} alt={career.company} className={`w-full h-full ${career.logo_fit === "cover" ? "object-cover" : "object-contain"}`} />
                      ) : (
                        "LOGO"
                      )}
                    </div>
                    {/* 제목 및 정보 영역 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-gray-900">{career.company}</h3>
                        {career.current && (
                          <span className="text-xs px-2 py-0.5 rounded border border-blue-500 text-blue-700 bg-blue-50 font-medium">
                            재직중
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-700 bg-gray-50">
                          {career.position}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded border border-gray-800 text-gray-800 bg-white">
                          {career.start_date} ~ {career.current ? "현재" : career.end_date}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded border border-gray-800 text-gray-800 bg-white">{careerYears > 0 ? `${careerYears}년 ${careerRemainingMonths}개월` : `${careerRemainingMonths}개월`}</span>
                      </div>
                    </div>
                  </div>
                  {/* 구분선 */}
                  <div className="border-t border-gray-200 mb-3"></div>
                  {/* 하단: 상세 내용 */}
                  <div className="space-y-2">
                    {career.description && (
                      <p className="text-xs text-gray-700 leading-relaxed">{career.description}</p>
                    )}
                    {career.achievements && career.achievements.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {career.achievements.map((achievement, index) => {
                          const indent = achievement.match(/^(\s*)/)?.[0].length || 0;
                          const level = Math.min(Math.floor(indent / 2), 2);
                          return (
                            <li key={index} className="flex items-start" style={{ paddingLeft: `${level * 0.75}rem` }}>
                              <span className="mr-2 text-gray-900 font-bold leading-none mt-0.5">•</span>
                              <span className="flex-1">{achievement.trim()}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedSections.education && educations && educations.length > 0 && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">학력</h2>
          <div className="space-y-3">
            {educations.map((education) => (
              <div key={education.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm print:break-inside-avoid">
                {/* 로고 + 제목/정보 */}
                <div className="flex items-start gap-3">
                  {/* 로고 영역 */}
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-gray-400 text-xs font-bold shrink-0 overflow-hidden p-1">
                    {education.logo_url ? (
                      <img src={education.logo_url} alt={education.school} className={`w-full h-full ${education.logo_fit === "cover" ? "object-cover" : "object-contain"}`} />
                    ) : (
                      "LOGO"
                    )}
                  </div>
                  {/* 제목 및 정보 영역 */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{education.school}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-700 bg-gray-50">
                        {education.major} / {education.degree}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded border border-gray-800 text-gray-800 bg-white">
                        {education.start_date} ~ {education.end_date}
                      </span>
                      {education.gpa && (
                        <span className="text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-700 bg-gray-50">
                          학점: {education.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.skills && Object.keys(groupedSkills).length > 0 && (
          <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm print:break-inside-avoid">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">보유 기술</h2>
            <div className="bg-gray-50 p-2.5 rounded-md mb-3 border border-gray-200">
              <div className="space-y-1 text-xs text-gray-700">
                <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-2 text-xs">3</span>{getLevelText(3)}</p>
                <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-2 text-xs">2</span>{getLevelText(2)}</p>
                <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-2 text-xs">1</span>{getLevelText(1)}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="flex gap-3">
                    <div className="w-20 font-semibold text-xs text-gray-900">{category}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white text-xs font-bold">
                          {skill.level}
                        </span>
                              <span className="text-xs text-gray-900">{skill.name}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
      )}

      {selectedSections.projects && sortedProjects.length > 0 && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">프로젝트</h2>
          <div className="space-y-3">
            {sortedProjects.map((project) => (
              <div key={project.id} className="rounded-md bg-white p-3 shadow-sm border border-gray-200 print:break-inside-avoid">
                {/* 상단: 로고 + 제목/정보 */}
                <div className="flex items-start gap-3 mb-3">
                  {/* 로고 영역 */}
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-gray-400 text-xs font-bold shrink-0 overflow-hidden p-1">
                    {project.logo_url ? (
                      <img src={project.logo_url} alt={project.name} className={`w-full h-full ${project.logo_fit === "cover" ? "object-cover" : "object-contain"}`} />
                    ) : (
                      "LOGO"
                    )}
                  </div>
                  {/* 제목 및 정보 영역 */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{project.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-700 bg-gray-50">
                        {project.role}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded border border-gray-800 text-gray-800 bg-white">
                        {project.start_date} ~ {project.end_date}
                      </span>
                    </div>
                  </div>
                </div>
                {/* 구분선 */}
                <div className="border-t border-gray-200 mb-3"></div>
                {/* 하단: 상세 내용 */}
                <div className="space-y-2">
                  {project.description && (
                    <p className="text-xs text-gray-700 leading-relaxed">{project.description}</p>
                  )}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div>
                      <span className="font-semibold text-xs text-gray-900 block mb-1.5">기술스택</span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech, idx) => (
                          <span key={idx} className="bg-gray-800 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.achievements && project.achievements.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {project.achievements.map((achievement, index) => {
                        const indent = achievement.match(/^(\s*)/)?.[0].length || 0;
                        const level = Math.min(Math.floor(indent / 2), 2);
                        return (
                          <li key={index} className="flex items-start" style={{ paddingLeft: `${level * 0.75}rem` }}>
                            <span className="mr-2 text-gray-900 font-bold leading-none mt-0.5">•</span>
                            <span className="flex-1">{achievement.trim()}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-100 print:bg-white">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4 flex justify-end gap-2 print:hidden">
          <button
            onClick={() => setIsPreview(false)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow text-sm"
          >
            편집 모드로 돌아가기
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 shadow text-sm"
          >
            PDF 저장
          </button>
        </div>
        <div className="py-8 flex justify-center print:p-0">
          <ResumeContent />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <TopHeader title="이력서" />
        <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopHeader
        title="이력서"
        actions={
          <>
            <div className="flex items-center gap-2 text-sm border-r pr-4">
              <button
                onClick={() => toggleSection("basic")}
                className={`px-2 py-1 rounded border transition-colors ${
                  selectedSections.basic
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                기본사항
              </button>
              <button
                onClick={() => toggleSection("career")}
                className={`px-2 py-1 rounded border transition-colors ${
                  selectedSections.career
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                경력
              </button>
              <button
                  onClick={() => toggleSection("education")}
                  className={`px-2 py-1 rounded border transition-colors ${
                      selectedSections.education
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                  }`}
              >
                학력
              </button>
              <button
                onClick={() => toggleSection("skills")}
                className={`px-2 py-1 rounded border transition-colors ${
                  selectedSections.skills
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                보유기술
              </button>
              <button
                onClick={() => toggleSection("projects")}
                className={`px-2 py-1 rounded border transition-colors ${
                  selectedSections.projects
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                프로젝트
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm border-r pr-4">
              <span className="text-gray-700 font-medium">정렬:</span>
              <button
                onClick={() => setSortOrder("latest")}
                className={`px-2 py-1 rounded border transition-colors ${
                  sortOrder === "latest"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                className={`px-2 py-1 rounded border transition-colors ${
                  sortOrder === "oldest"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                과거순
              </button>
            </div>
            <button
              onClick={() => setIsPreview(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              미리보기
            </button>
          </>
        }
      />
      <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
        <div className="p-6">
          {!basicInfo?.name && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            데이터를 입력하지 않았습니다.{" "}
            <Link href="/data/basic" className="text-blue-600 hover:underline font-medium">
              데이터 입력하러 가기
            </Link>
          </p>
        </div>
      )}

          <div className="bg-gray-50 p-8 rounded-lg">
            <ResumeContent />
          </div>
        </div>
      </div>
    </>
  );
}
