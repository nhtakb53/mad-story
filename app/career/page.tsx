"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { BasicInfo, Career, Skill, Education, Project } from "@/types/resume";
import { useState } from "react";
import Link from "next/link";

export default function CareerStatementPage() {
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
    education: false,
    projects: true,
  });

  const [isPreview, setIsPreview] = useState(false);

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const loading = loadingBasic || loadingCareers || loadingSkills || loadingEducations || loadingProjects;

  const CareerContent = () => (
    <div className="a4-page bg-white shadow-sm border">
      {selectedSections.basic && (
        <div className="mb-6 pb-4 border-b text-center">
          <h1 className="text-lg font-semibold text-foreground mb-4 tracking-tight">경력기술서</h1>
          <h2 className="text-base font-semibold text-foreground mb-1">{basicInfo.name || "이름 없음"}</h2>
          {(basicInfo.nameEn || basicInfo.nickname) && (
            <p className="text-xs text-muted-foreground mb-2">
              {[basicInfo.nameEn, basicInfo.nickname].filter(Boolean).join(" / ")}
            </p>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            {basicInfo.email && (
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium text-foreground">Email</span>
                <span>{basicInfo.email}</span>
              </div>
            )}
            {basicInfo.phone && (
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium text-foreground">Phone</span>
                <span>{basicInfo.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedSections.career && careers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">경력</h2>
          <div className="space-y-4">
            {careers.map((career) => (
              <div key={career.id} className="pl-4 border-l-4 border-primary/20 rounded-md bg-card p-3 shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{career.company}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{career.position}</p>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-medium whitespace-nowrap ml-2">
                    {career.startDate} ~ {career.current ? "현재" : career.endDate}
                  </span>
                </div>
                {career.description && (
                  <div className="mb-3 pb-2 border-b">
                    <h4 className="font-semibold text-xs text-foreground mb-2">업무 내용</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{career.description}</p>
                  </div>
                )}
                {career.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs text-foreground mb-2">주요 성과 및 기여</h4>
                    <div className="rounded-md bg-muted/50 p-2.5">
                      <ul className="space-y-1.5">
                        {career.achievements.map((achievement, index) => (
                          <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start">
                            <span className="mr-2 text-primary font-bold leading-none mt-0.5">•</span>
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">프로젝트</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="pl-4 border-l-4 border-primary/20 rounded-md bg-card p-3 shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{project.role}</p>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-medium whitespace-nowrap ml-2">
                    {project.startDate} ~ {project.endDate}
                  </span>
                </div>
                <div className="mb-3 pb-2 border-b">
                  <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
                {project.techStack.length > 0 && (
                  <div className="mb-3 pb-2 border-b">
                    <h4 className="font-semibold text-xs text-foreground mb-2">사용 기술</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.achievements.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-xs text-foreground mb-2">성과 및 기여</h4>
                    <div className="rounded-md bg-muted/50 p-2.5">
                      <ul className="space-y-1.5">
                        {project.achievements.map((achievement, index) => (
                          <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start">
                            <span className="mr-2 text-primary font-bold leading-none mt-0.5">•</span>
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {project.url && (
                  <div className="pt-2 border-t">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      {project.url}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.skills && Object.keys(groupedSkills).length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">보유 기술</h2>
          <div className="space-y-2.5">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-xs font-bold text-gray-900 mb-1.5">{category}</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-600">Lv.{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.education && educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">학력</h2>
          <div className="space-y-3">
            {educations.map((education) => (
              <div key={education.id}>
                <div className="flex justify-between items-start bg-gray-50/30 p-2 rounded border border-gray-100">
                  <div>
                    <h3 className="font-bold text-xs text-gray-900">{education.school}</h3>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {education.major} / {education.degree}
                    </p>
                    {education.gpa && <p className="text-xs text-gray-600 mt-0.5">학점: {education.gpa}</p>}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium whitespace-nowrap ml-2">
                    {education.startDate} ~ {education.endDate}
                  </span>
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
          <CareerContent />
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
        <h1 className="text-3xl font-bold">경력기술서</h1>
        <button
          onClick={() => setIsPreview(true)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          미리보기
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 text-sm">
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
          onClick={() => toggleSection("projects")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedSections.projects
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
          }`}
        >
          프로젝트 ({projects.length})
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
        <CareerContent />
      </div>
    </div>
  );
}
