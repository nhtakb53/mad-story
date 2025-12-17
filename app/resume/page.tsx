"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { BasicInfo, Career, Skill, Education, Project } from "@/types/resume";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Github } from "lucide-react";

const getLevelText = (level: number) => {
  const levels = {
    1: "기본적인 사용 경험과 협업에 필요한 지식 보유",
    2: "매우 능숙하지는 않지만 업무 수행 가능",
    3: "관련 지식과 경험이 풍부하며 능숙하게 업무 진행 가능",
  };
  return levels[level as keyof typeof levels] || "";
};

const highlightKeywords = (text: string) => {
  // 키워드 패턴: ** 로 감싸진 텍스트를 찾음
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const keyword = part.slice(2, -2);
      return (
        <span
          key={index}
          className="font-semibold text-blue-600 bg-blue-50 px-1 rounded"
        >
          {keyword}
        </span>
      );
    }
    return part;
  });
};

export default function ResumePage() {
  const [basicInfo, , loadingBasic] = useFileStorage<BasicInfo>("basic-info", {
    name: "",
    nameEn: "",
    email: "",
    phone: "",
  });
  const [careers, , loadingCareers] = useFileStorage<Career[]>("careers", []);
  const [skills, , loadingSkills] = useFileStorage<Skill[]>("skills", []);
  const [educations, , loadingEducations] = useFileStorage<Education[]>("educations", []);
  const [projects, , loadingProjects] = useFileStorage<Project[]>("projects", []);

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

  const sortedCareers = [...careers].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const totalCareerMonths = careers.reduce((total, career) => {
    const start = new Date(career.startDate);
    const end = career.current ? new Date() : new Date(career.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);

  const years = Math.floor(totalCareerMonths / 12);
  const months = totalCareerMonths % 12;

  const loading = loadingBasic || loadingCareers || loadingSkills || loadingEducations || loadingProjects;

  const ResumeContent = () => (
    <div className="a4-page bg-white">
      {selectedSections.basic && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-row-reverse items-start gap-4">
            {basicInfo.profileImage && (
                <img
                    src={basicInfo.profileImage}
                    alt={basicInfo.name}
                    className="w-65 h-75 object-cover rounded-lg"
                />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-0.5 tracking-tight mb-2">
                {basicInfo.name || "이름 없음"}
              </h1>
              {(basicInfo.nameEn || basicInfo.nickname) && (
                  <p className="text-md text-gray-600 mb-3">
                    {[basicInfo.nameEn, basicInfo.nickname].filter(Boolean).join(" / ")}
                  </p>
              )}
              <div className="flex flex-col gap-1 text-xs text-gray-600">
                {basicInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="shrink-0" />
                      <a
                          href={`mailto:${basicInfo.email}`}
                          className="hover:text-gray-900 transition-colors"
                      >
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
          <div className="flex justify-between items-end mb-3 pb-2 border-b">
            <h2 className="text-base font-semibold text-gray-900">경력</h2>
            <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded-md font-medium">총 {years}년 {months}개월</span>
          </div>
          <div className="space-y-3">
            {sortedCareers.map((career) => {
              const start = new Date(career.startDate);
              const end = career.current ? new Date() : new Date(career.endDate);
              const careerMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
              const careerYears = Math.floor(careerMonths / 12);
              const careerRemainingMonths = careerMonths % 12;

              return (
                <div key={career.id} className="rounded-md bg-gray-50 p-3 shadow-sm border border-gray-200">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{career.company}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                        {career.startDate} ~ {career.current ? "현재" : career.endDate}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-semibold">
                        {careerYears}년 {careerRemainingMonths}개월
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{career.position}</p>
                  </div>
                  {career.description && (
                    <div className="mb-3 pb-2 border-b border-gray-200">
                      <p className="text-xs text-gray-700 leading-relaxed">{career.description}</p>
                    </div>
                  )}
                  {career.achievements.length > 0 && (
                    <div className="rounded-md bg-white p-2.5 border border-gray-100">
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {career.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-gray-900 font-bold leading-none mt-0.5">•</span>
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedSections.skills && Object.keys(groupedSkills).length > 0 && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
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

      {selectedSections.education && educations.length > 0 && (
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">학력</h2>
          <div className="space-y-3">
            {educations.map((education) => (
              <div key={education.id} className="bg-gray-50 p-2.5 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-xs text-gray-900">{education.school}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                    {education.startDate} ~ {education.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{education.major} / {education.degree}</p>
                {education.gpa && <p className="text-xs text-gray-600 mt-0.5">학점: {education.gpa}</p>}
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
              <div key={project.id} className="rounded-md bg-gray-50 p-3 shadow-sm border border-gray-200">
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                      {project.startDate} ~ {project.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{project.role}</p>
                </div>
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <p className="text-xs text-gray-700 leading-relaxed">{project.description}</p>
                </div>
                {project.techStack.length > 0 && (
                  <div className="mb-3 pb-2 border-b border-gray-200">
                    <span className="font-semibold text-xs text-gray-900 block mb-2">기술스택</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-gray-800 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.achievements.length > 0 && (
                  <div className="rounded-md bg-white p-2.5 border border-gray-100">
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-gray-900 font-bold leading-none mt-0.5">•</span>
                          <span className="flex-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
        <div className="fixed top-4 right-4 z-10 print:hidden">
          <button
            onClick={() => setIsPreview(false)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-lg mr-2"
          >
            편집 모드로 돌아가기
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 shadow-lg"
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
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">이력서</h1>
        <button
          onClick={() => setIsPreview(true)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          미리보기
        </button>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => toggleSection("basic")}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              selectedSections.basic
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
            }`}
          >
            기본사항
          </button>
        <button
          onClick={() => toggleSection("career")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedSections.career
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
          }`}
        >
          경력 ({careers.length})
        </button>
        <button
          onClick={() => toggleSection("skills")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedSections.skills
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
          }`}
        >
          보유기술 ({skills.length})
        </button>
        <button
          onClick={() => toggleSection("education")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedSections.education
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
          }`}
        >
          학력 ({educations.length})
        </button>
        <button
          onClick={() => toggleSection("projects")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedSections.projects
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
          }`}
        >
          프로젝트 ({projects.length})
        </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700 font-medium">정렬:</span>
          <button
            onClick={() => setSortOrder("latest")}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              sortOrder === "latest"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              sortOrder === "oldest"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
            }`}
          >
            과거순
          </button>
        </div>
      </div>

      {!basicInfo.name && (
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
  );
}
