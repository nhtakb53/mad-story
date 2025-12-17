"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BasicInfo, Career, Skill, Education, Project } from "@/types/resume";
import { useState } from "react";
import Link from "next/link";

export default function CareerStatementPage() {
  const [basicInfo] = useLocalStorage<BasicInfo>("basicInfo", {
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [careers] = useLocalStorage<Career[]>("careers", []);
  const [skills] = useLocalStorage<Skill[]>("skills", []);
  const [educations] = useLocalStorage<Education[]>("educations", []);
  const [projects] = useLocalStorage<Project[]>("projects", []);

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

  const CareerContent = () => (
    <div className="max-w-4xl bg-white p-12 shadow-lg">
      {selectedSections.basic && (
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">경력기술서</h1>
          <h2 className="text-2xl font-semibold mb-2">{basicInfo.name || "이름 없음"}</h2>
          <div className="text-sm text-gray-600 space-y-1">
            {basicInfo.email && <p>이메일: {basicInfo.email}</p>}
            {basicInfo.phone && <p>전화번호: {basicInfo.phone}</p>}
            {basicInfo.address && <p>주소: {basicInfo.address}</p>}
          </div>
        </div>
      )}

      {selectedSections.career && careers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-300 pb-2">경력 사항</h2>
          <div className="space-y-8">
            {careers.map((career) => (
              <div key={career.id}>
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{career.company}</h3>
                    <p className="text-sm font-medium text-gray-600">
                      {career.startDate} ~ {career.current ? "현재" : career.endDate}
                    </p>
                  </div>
                  <p className="text-lg text-gray-700 font-semibold">{career.position}</p>
                </div>
                {career.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">업무 내용:</h4>
                    <p className="text-gray-700 leading-relaxed">{career.description}</p>
                  </div>
                )}
                {career.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">주요 성과 및 기여:</h4>
                    <ul className="space-y-2">
                      {career.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700 leading-relaxed flex">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
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

      {selectedSections.projects && projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-300 pb-2">
            주요 프로젝트 수행 경험
          </h2>
          <div className="space-y-8">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <p className="text-sm font-medium text-gray-600">
                      {project.startDate} ~ {project.endDate}
                    </p>
                  </div>
                  <p className="text-gray-700 font-semibold mb-2">{project.role}</p>
                  <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                </div>
                {project.techStack.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">사용 기술:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">성과 및 기여도:</h4>
                    <ul className="space-y-2">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700 leading-relaxed flex">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.url && (
                  <div className="mt-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      프로젝트 링크: {project.url}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.skills && Object.keys(groupedSkills).length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-300 pb-2">보유 기술</h2>
          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-600">({skill.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSections.education && educations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-300 pb-2">학력</h2>
          <div className="space-y-4">
            {educations.map((education) => (
              <div key={education.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{education.school}</h3>
                    <p className="text-gray-700">
                      {education.major} ({education.degree})
                    </p>
                    {education.gpa && <p className="text-sm text-gray-600">학점: {education.gpa}</p>}
                  </div>
                  <p className="text-sm text-gray-600">
                    {education.startDate} ~ {education.endDate}
                  </p>
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
      <div className="min-h-screen bg-gray-100">
        <div className="fixed top-4 right-4 z-10">
          <button
            onClick={() => setIsPreview(false)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-lg"
          >
            편집 모드로 돌아가기
          </button>
        </div>
        <div className="p-8 flex justify-center">
          <CareerContent />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">경력기술서</h1>
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
              checked={selectedSections.career}
              onChange={() => toggleSection("career")}
              className="mr-3 w-4 h-4"
            />
            <span>경력 ({careers.length}개)</span>
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
        <CareerContent />
      </div>
    </div>
  );
}
