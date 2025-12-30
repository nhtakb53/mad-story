"use client";

import Link from "next/link";
import { FileText, Briefcase, User, Calendar, TrendingUp, Award } from "lucide-react";
import { getBasicInfo, getCareers, getSkills, getProjects, getEducations, getTechStackStatsGrouped } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { TopHeader } from "@/components/top-header";
import { TechStackTreemap } from "@/components/tech-stack-treemap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BasicInfo {
  name: string;
  email: string;
}

interface Career {
  id: string;
  company: string;
  current: boolean;
  start_date: string;
  end_date?: string;
}

interface Skill {
  id: string;
}

interface Project {
  id: string;
}

interface Education {
  id: string;
}

interface TechItem {
  name: string;
  value: number;
}

interface CategoryGroup {
  name: string;
  children: TechItem[];
}

export default function DashboardPage() {
  const { data: basicInfo } = useSupabaseData<BasicInfo>(getBasicInfo, []);
  const { data: careers } = useSupabaseData<Career[]>(getCareers, []);
  const { data: skills } = useSupabaseData<Skill[]>(getSkills, []);
  const { data: projects } = useSupabaseData<Project[]>(getProjects, []);
  const { data: educations } = useSupabaseData<Education[]>(getEducations, []);
  const { data: techStats } = useSupabaseData<CategoryGroup[]>(getTechStackStatsGrouped, []);

  const currentCareer = careers?.find(c => c.current);

  const totalCareerMonths = (careers || []).reduce((total, career) => {
    const start = new Date(career.start_date);
    const end = career.current ? new Date() : new Date(career.end_date || career.start_date);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);

  const years = Math.floor(totalCareerMonths / 12);
  const months = totalCareerMonths % 12;

  return (
    <>
      <TopHeader title="대시보드" />
      <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
        <div className="p-8 flex justify-center">
          <div className="p-6 max-w-7xl">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Calendar className="w-5 h-5 opacity-80" />
                    <Badge className="text-xs bg-white/20 text-white border-none">경력</Badge>
                  </div>
                  <div className="text-xl font-bold mb-0.5">
                    {years > 0 ? `${years}년 ${months}개월` : `${months}개월`}
                  </div>
                  <p className="text-xs opacity-90">총 경력 기간</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Briefcase className="w-5 h-5 opacity-80" />
                    <Badge className="text-xs bg-white/20 text-white border-none">프로젝트</Badge>
                  </div>
                  <div className="text-xl font-bold mb-0.5">{projects?.length || 0}</div>
                  <p className="text-xs opacity-90">완료한 프로젝트</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Award className="w-5 h-5 opacity-80" />
                    <Badge className="text-xs bg-white/20 text-white border-none">기술</Badge>
                  </div>
                  <div className="text-xl font-bold mb-0.5">{skills?.length || 0}</div>
                  <p className="text-xs opacity-90">보유 기술</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <TrendingUp className="w-5 h-5 opacity-80" />
                    <Badge className="text-xs bg-white/20 text-white border-none">회사</Badge>
                  </div>
                  <div className="text-xl font-bold mb-0.5">{careers?.length || 0}</div>
                  <p className="text-xs opacity-90">경력 회사 수</p>
                </CardContent>
              </Card>
            </div>

            {/* 현재 상태 */}
            {currentCareer && (
              <Card className="border-primary/20 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    현재 재직중
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-lg font-semibold mb-0.5">{currentCareer.company}</p>
                  <p className="text-xs text-muted-foreground">{currentCareer.start_date} ~ 현재</p>
                </CardContent>
              </Card>
            )}

            {/* 빠른 작업 */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">빠른 작업</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/resume">
                  <Card className="group hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-base font-bold mb-1">이력서 작성</h3>
                      <p className="text-muted-foreground text-xs">
                        이력서를 작성하고 PDF로 저장하세요
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/career">
                  <Card className="group hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-base font-bold mb-1">경력기술서 작성</h3>
                      <p className="text-muted-foreground text-xs">
                        경력기술서를 작성하고 PDF로 저장하세요
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/profile">
                  <Card className="group hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <User className="w-8 h-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-base font-bold mb-1">내 정보 관리</h3>
                      <p className="text-muted-foreground text-xs">
                        기본정보, 경력, 프로젝트 등을 관리하세요
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* 기술 스택 통계 */}
            {techStats && techStats.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">프로젝트 기술 스택 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <TechStackTreemap data={techStats} height={400} showLegend={true} />
                </CardContent>
              </Card>
            )}

            {/* 데이터 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">데이터 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold">기본사항</span>
                    <Badge variant={basicInfo?.name ? "default" : "destructive"} className={basicInfo?.name ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                      {basicInfo?.name ? '입력완료' : '미입력'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold">경력</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {careers?.length || 0}개
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold">보유기술</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {skills?.length || 0}개
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold">프로젝트</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {projects?.length || 0}개
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold">학력</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      {educations?.length || 0}개
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
