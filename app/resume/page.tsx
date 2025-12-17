"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { BasicInfo, Career, Skill, Education, Project } from "@/types/resume";
import { useState } from "react";
import Link from "next/link";

const getLevelText = (level: number) => {
  const levels = {
    1: "기본적인 사용 경험과 협업에 필요한 지식 보유",
    2: "매우 능숙하지는 않지만 업무 수행 가능",
    3: "관련 지식과 경험이 풍부하며 능숙하게 업무 진행 가능",
  };
  return levels[level as keyof typeof levels] || "";
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
    introduce: true,
    career: true,
    skills: true,
    education: true,
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
    <div className="a4-page bg-white shadow-lg">
      {selectedSections.basic && (
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <div className="flex items-start gap-4">
            {basicInfo.profileImage && (
              <img
                src={basicInfo.profileImage}
                alt={basicInfo.name}
                className="w-20 h-20 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">
                {basicInfo.name || "이름 없음"}
              </h1>
              {basicInfo.nameEn && (
                <p className="text-sm text-gray-600 mb-2">{basicInfo.nameEn}</p>
              )}
              <div className="flex flex-col gap-0.5 text-xs text-gray-700">
                {basicInfo.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email</span>
                    <a href={`mailto:${basicInfo.email}`} className="hover:text-gray-900">
                      {basicInfo.email}
                    </a>
                  </div>
                )}
                {basicInfo.phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone</span>
                    <span>{basicInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSections.introduce && basicInfo.introduce && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">소개</h2>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{basicInfo.introduce}</p>
        </div>
      )}

      {selectedSections.career && careers.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2 pb-1.5 border-b border-gray-300">
            <h2 className="text-base font-bold text-gray-900">경력</h2>
            <p className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded font-medium">총 {years}년 {months}개월</p>
          </div>
          <div className="space-y-4">
            {careers.map((career) => {
              const start = new Date(career.startDate);
              const end = career.current ? new Date() : new Date(career.endDate);
              const careerMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
              const careerYears = Math.floor(careerMonths / 12);
              const careerRemainingMonths = careerMonths % 12;

              return (
                <div key={career.id} className="pl-3 border-l-2 border-gray-800 bg-gray-50/30 pb-3 pt-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900">{career.company}</h3>
                      <p className="text-xs text-gray-700 font-medium mt-0.5">{career.position}</p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-0.5">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                        {career.startDate} ~ {career.current ? "현재" : career.endDate}
                      </span>
                      <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded font-medium">
                        {careerYears}년 {careerRemainingMonths}개월
                      </span>
                    </div>
                  </div>
                  {career.description && (
                    <div className="mb-3 pb-2 border-b border-gray-200">
                      <p className="text-xs text-gray-700 leading-relaxed">{career.description}</p>
                    </div>
                  )}
                  {career.achievements.length > 0 && (
                    <div className="bg-white/50 rounded p-2 border border-gray-100">
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {career.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-gray-400 font-bold leading-none mt-0.5">•</span>
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
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">보유 기술</h2>
          <div className="bg-gray-50 p-2 rounded mb-2">
            <div className="space-y-0.5 text-xs text-gray-600">
              <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-1.5 text-xs">3</span>{getLevelText(3)}</p>
              <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-1.5 text-xs">2</span>{getLevelText(2)}</p>
              <p><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white font-bold mr-1.5 text-xs">1</span>{getLevelText(1)}</p>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="flex gap-3">
                <div className="w-20 font-bold text-xs text-gray-900">{category}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white text-xs font-bold">
                          {skill.level}
                        </span>
                        <span className="text-xs text-gray-700">{skill.name}</span>
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
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">학력</h2>
          <div className="space-y-3">
            {educations.map((education) => (
              <div key={education.id} className="flex justify-between items-start bg-gray-50/30 p-2 rounded border border-gray-100">
                <div>
                  <h3 className="font-bold text-xs text-gray-900">{education.school}</h3>
                  <p className="text-xs text-gray-700 mt-0.5">{education.major} / {education.degree}</p>
                  {education.gpa && <p className="text-xs text-gray-600 mt-0.5">학점: {education.gpa}</p>}
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium whitespace-nowrap ml-2">
                  {education.startDate} ~ {education.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">프로젝트</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="pl-3 border-l-2 border-gray-800 bg-gray-50/30 pb-3 pt-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-700 font-medium mt-0.5">{project.role}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium whitespace-nowrap ml-2">
                    {project.startDate} ~ {project.endDate}
                  </span>
                </div>
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <p className="text-xs text-gray-700 leading-relaxed">{project.description}</p>
                </div>
                {project.techStack.length > 0 && (
                  <div className="mb-3 pb-2 border-b border-gray-200">
                    <span className="font-semibold text-xs text-gray-900 block mb-1.5">기술스택</span>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-gray-800 text-white px-1.5 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.achievements.length > 0 && (
                  <div className="bg-white/50 rounded p-2 border border-gray-100">
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-gray-400 font-bold leading-none mt-0.5">•</span>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">이력서</h1>
        <button
          onClick={() => setIsPreview(true)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          미리보기
        </button>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">포함할 섹션 선택</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.basic}
              onChange={() => toggleSection("basic")}
              className="mr-3 w-4 h-4"
            />
            <span>기본사항</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.introduce}
              onChange={() => toggleSection("introduce")}
              className="mr-3 w-4 h-4"
            />
            <span>자기소개</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.career}
              onChange={() => toggleSection("career")}
              className="mr-3 w-4 h-4"
            />
            <span>경력 ({careers.length}개)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.skills}
              onChange={() => toggleSection("skills")}
              className="mr-3 w-4 h-4"
            />
            <span>보유기술 ({skills.length}개)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.education}
              onChange={() => toggleSection("education")}
              className="mr-3 w-4 h-4"
            />
            <span>학력 ({educations.length}개)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSections.projects}
              onChange={() => toggleSection("projects")}
              className="mr-3 w-4 h-4"
            />
            <span>프로젝트 ({projects.length}개)</span>
          </label>
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
