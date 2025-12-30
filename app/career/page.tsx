"use client";

import { getBasicInfo, getCareers, getSkills, getEducations, getProjects } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BasicInfo {
  id: string;
  name: string;
  nameEn?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  profile_image?: string;
  introduce?: string;
}

interface Career {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements: string[];
}

interface Skill {
  id: string;
  category: string;
  name: string;
  level: 1 | 2 | 3;
}

interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Project {
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

export default function CareerStatementPage() {
  const { data: basicInfo, loading: loadingBasic } = useSupabaseData<BasicInfo>(getBasicInfo, []);
  const { data: careers, loading: loadingCareers } = useSupabaseData<Career[]>(getCareers, []);
  const { data: skills, loading: loadingSkills } = useSupabaseData<Skill[]>(getSkills, []);
  const { data: educations, loading: loadingEducations } = useSupabaseData<Education[]>(getEducations, []);
  const { data: projects, loading: loadingProjects } = useSupabaseData<Project[]>(getProjects, []);

  const [selectedSections, setSelectedSections] = useState({
    basic: true,
    career: false,
    skills: true,
    education: false,
    projects: true,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sortedCareers = careers
    ? [...careers].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
      })
    : [];

  const sortedProjects = projects
    ? [...projects].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
      })
    : [];

  const groupedSkills = skills
    ? skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>)
    : {};

  const loading = loadingBasic || loadingCareers || loadingSkills || loadingEducations || loadingProjects;

  const CareerContent = () => (
    <div className="a4-page bg-white">
      {selectedSections.basic && basicInfo && (
        <Card className="mb-4 print:break-inside-avoid">
          <CardContent className="p-4">
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
                {(basicInfo.nameEn || basicInfo.nickname) && (
                  <p className="text-md text-gray-600 mb-3">
                    {[basicInfo.nameEn, basicInfo.nickname].filter(Boolean).join(" / ")}
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
                </div>
                {basicInfo.tags && basicInfo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {basicInfo.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {basicInfo.introduce && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {basicInfo.introduce}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedSections.career && sortedCareers.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">경력</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            {sortedCareers.map((career) => (
              <Card key={career.id} className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{career.company}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 whitespace-nowrap">
                        {career.startDate} ~ {career.current ? "현재" : career.endDate}
                      </Badge>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{career.position}</p>
                </div>
                {career.description && (
                  <div className="mb-3 pb-2 border-b border-gray-200">
                    <h4 className="font-semibold text-xs text-gray-900 mb-2">업무 내용</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{career.description}</p>
                  </div>
                )}
                {career.achievements && career.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900 mb-2">주요 성과 및 기여</h4>
                    <div className="rounded-md bg-white p-2.5 border border-gray-100">
                      <ul className="space-y-1.5">
                        {career.achievements.map((achievement, index) => (
                          <li key={index} className="text-xs text-gray-700 leading-relaxed flex items-start">
                            <span className="mr-2 text-gray-900 font-bold leading-none mt-0.5">•</span>
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
            ))}
          </div>
          </CardContent>
        </Card>
      )}

      {selectedSections.projects && sortedProjects.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">프로젝트</h2>
          <div>
            {sortedProjects.map((project, index) => (
              <div key={project.id}>
                <div className="rounded-md bg-white p-3 shadow-sm border border-gray-200 print:break-inside-avoid"
                  style={{ marginBottom: index < sortedProjects.length - 1 ? '12px' : '0' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-gray-400 text-xs font-bold shrink-0 overflow-hidden p-1">
                      LOGO
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="secondary">
                          {project.role}
                        </Badge>
                        <Badge variant="outline">
                          {project.startDate} ~ {project.endDate}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 mb-3"></div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-700 leading-relaxed">{project.description}</p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-xs text-gray-900 mb-1.5">사용 기술</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <Badge
                              key={tech}
                              className="bg-gray-800 text-white text-xs"
                            >
                              {tech}
                            </Badge>
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
                    {project.url && (
                      <div className="pt-2">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-900 underline transition-colors"
                        >
                          {project.url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      )}

      {selectedSections.skills && Object.keys(groupedSkills).length > 0 && (
        <Card className="mb-4 print:break-inside-avoid">
          <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b">보유 기술</h2>
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
          </CardContent>
        </Card>
      )}

      {selectedSections.education && educations && educations.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base font-bold">학력</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 whitespace-nowrap ml-2">
                    {education.startDate} ~ {education.endDate}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-100 print:bg-white">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4 flex justify-end gap-2 print:hidden">
          <Button onClick={() => setIsPreview(false)}>
            편집 모드로 돌아가기
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            PDF 저장
          </Button>
        </div>
        <div className="py-8 flex justify-center print:p-0">
          <CareerContent />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <TopHeader title="경력기술서" />
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
        title="경력기술서"
        actions={
          <>
            <div className="flex items-center gap-2 text-sm border-r pr-4">
              <Button
                onClick={() => toggleSection("basic")}
                variant={selectedSections.basic ? "default" : "outline"}
                size="sm"
              >
                기본사항
              </Button>
              <Button
                onClick={() => toggleSection("projects")}
                variant={selectedSections.projects ? "default" : "outline"}
                size="sm"
              >
                프로젝트
              </Button>
              <Button
                onClick={() => toggleSection("skills")}
                variant={selectedSections.skills ? "default" : "outline"}
                size="sm"
              >
                보유기술
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm border-r pr-4">
              <span className="text-gray-700 font-medium">정렬:</span>
              <Button
                onClick={() => setSortOrder("latest")}
                variant={sortOrder === "latest" ? "default" : "outline"}
                size="sm"
              >
                최신순
              </Button>
              <Button
                onClick={() => setSortOrder("oldest")}
                variant={sortOrder === "oldest" ? "default" : "outline"}
                size="sm"
              >
                과거순
              </Button>
            </div>
            <Button onClick={() => setIsPreview(true)}>
              미리보기
            </Button>
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
            <CareerContent />
          </div>
        </div>
      </div>
    </>
  );
}
