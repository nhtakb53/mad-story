"use client";

import Link from 'next/link';
import { ArrowRight, FileText, Briefcase, Sparkles, Mail, Phone, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// 예시 데이터
const sampleData = {
  basicInfo: {
    name: "김개발",
    name_en: "Kim Developer",
    email: "developer@example.com",
    phone: "010-1234-5678",
    github: "github.com/developer",
    tags: ["풀스택", "팀리더", "문제해결"]
  },
  career: {
    company: "테크컴퍼니",
    position: "시니어 백엔드 개발자",
    start_date: "2021.03",
    current: true,
    achievements: [
      "마이크로서비스 아키텍처 전환으로 **응답속도 40% 개선** 및 **서버 비용 30% 절감**",
      "Redis 캐싱 전략 도입으로 **데이터베이스 부하 60% 감소**"
    ]
  },
  skills: {
    "언어": [
      { name: "TypeScript", level: 3 },
      { name: "Python", level: 3 },
      { name: "Java", level: 2 },
      { name: "Go", level: 2 }
    ],
    "프레임워크": [
      { name: "Next.js", level: 3 },
      { name: "Spring Boot", level: 3 },
      { name: "FastAPI", level: 2 },
      { name: "Express", level: 3 }
    ]
  },
  project: {
    name: "전자상거래 플랫폼 구축",
    start_date: "2023.01",
    end_date: "2023.12",
    description: "월 100만 건 이상의 주문을 처리하는 대규모 이커머스 플랫폼 설계 및 개발",
    tech_stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "AWS", "Docker"]
  }
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-8 py-20 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            개발자를 위한 이력 관리 솔루션
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Mad Story
          </h1>
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-semibold">M</span>y <span className="font-semibold">D</span>ev Hi<span className="font-semibold">story</span>
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            이력서와 경력기술서를 한 곳에서 관리하고<br />
            PDF로 바로 출력하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group rounded-xl shadow-lg hover:shadow-xl">
              <Link href="/resume">
                이력서 작성하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/career">
                경력기술서 작성하기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Example Section - 상단 배치 */}
      <section className="px-8 py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">깔끔하고 전문적인 디자인</h2>
            <p className="text-lg text-muted-foreground">
              Mad Story가 제공하는 이력서와 경력기술서를 확인해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 이력서 예시 */}
            <Card className="overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
                <h3 className="text-xl font-bold text-white">이력서 예시</h3>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto pt-6">
                {/* 기본사항 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{sampleData.basicInfo.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{sampleData.basicInfo.name_en}</p>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span>{sampleData.basicInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{sampleData.basicInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github size={14} />
                      <span className="truncate">{sampleData.basicInfo.github}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleData.basicInfo.tags.map((tag) => (
                      <Badge key={tag} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 경력 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">경력</h4>
                    <Badge variant="secondary" className="text-xs bg-gray-800 dark:bg-gray-600 text-white">
                      최신
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{sampleData.career.company}</h5>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{sampleData.career.position}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {sampleData.career.start_date} ~ {sampleData.career.current ? "재직중" : ""}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {sampleData.career.achievements.map((achievement, idx) => (
                      <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="mr-1.5 font-bold">•</span>
                        <span className="line-clamp-2">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 기술스택 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">보유 기술</h4>
                  <div className="space-y-2">
                    {Object.entries(sampleData.skills).map(([category, categorySkills]) => (
                      <div key={category}>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{category}</div>
                        <div className="flex flex-wrap gap-1">
                          {categorySkills.map((skill) => (
                            <Badge key={skill.name} variant="secondary" className="bg-gray-800 dark:bg-gray-600 text-white">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 프로젝트 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">프로젝트</h4>
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{sampleData.project.name}</h5>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {sampleData.project.start_date} ~ {sampleData.project.end_date}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {sampleData.project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sampleData.project.tech_stack.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-800 dark:bg-gray-600 text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/resume">
                    이력서 작성하기
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* 경력기술서 예시 */}
            <Card className="overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
                <h3 className="text-xl font-bold text-white">경력기술서 예시</h3>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto pt-6">
                {/* 헤더 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">경력기술서</h3>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">{sampleData.basicInfo.name}</h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                    <div>{sampleData.basicInfo.email}</div>
                    <div>{sampleData.basicInfo.phone}</div>
                  </div>
                </div>

                {/* 경력 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">경력</h4>
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{sampleData.career.company}</h5>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{sampleData.career.position}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {sampleData.career.start_date} ~ {sampleData.career.current ? "현재" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">주요 성과</p>
                    <div className="space-y-1">
                      {sampleData.career.achievements.map((achievement, idx) => (
                        <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="mr-1.5 font-bold">•</span>
                          <span className="line-clamp-2">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 프로젝트 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">프로젝트</h4>
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{sampleData.project.name}</h5>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {sampleData.project.start_date} ~ {sampleData.project.end_date}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {sampleData.project.description}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">사용 기술</p>
                    <div className="flex flex-wrap gap-1">
                      {sampleData.project.tech_stack.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-800 dark:bg-gray-600 text-white">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 보유 기술 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">보유 기술</h4>
                  <div className="space-y-2">
                    {Object.entries(sampleData.skills).map(([category, categorySkills]) => (
                      <div key={category}>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{category}</div>
                        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
                          {categorySkills.map((skill) => (
                            <div key={skill.name} className="flex justify-between">
                              <span>{skill.name}</span>
                              <span>Lv.{skill.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/career">
                    경력기술서 작성하기
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">왜 Mad Story인가요?</h2>
          <p className="text-lg text-muted-foreground">
            개발자의 커리어를 효율적으로 관리하는 모든 기능
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:border-primary hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">간편한 데이터 관리</h3>
              <p className="text-muted-foreground leading-relaxed">
                기본사항, 경력, 기술스택, 학력, 프로젝트를<br />
                직관적인 인터페이스로 쉽게 입력하고 관리하세요
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">맞춤형 문서 생성</h3>
              <p className="text-muted-foreground leading-relaxed">
                필요한 섹션만 선택하여 상황에 맞는<br />
                이력서와 경력기술서를 자유롭게 구성하세요
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">즉시 PDF 출력</h3>
              <p className="text-muted-foreground leading-relaxed">
                A4 형식으로 미리보기하고<br />
                버튼 클릭 한 번으로 PDF 다운로드
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">3단계로 완성하는 이력서</h2>
            <p className="text-lg text-muted-foreground">
              간단한 프로세스로 전문적인 이력서를 만들어보세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <Badge className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                1
              </Badge>
              <Card className="h-full pt-12 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-3">데이터 입력</h3>
                  <p className="text-muted-foreground">
                    좌측 메뉴에서 기본정보, 경력, 기술스택, 학력, 프로젝트 정보를 단계별로 입력하세요
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="relative">
              <Badge className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                2
              </Badge>
              <Card className="h-full pt-12 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-3">섹션 선택</h3>
                  <p className="text-muted-foreground">
                    이력서나 경력기술서 페이지에서 포함할 섹션을 토글로 간편하게 선택하세요
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="relative">
              <Badge className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                3
              </Badge>
              <Card className="h-full pt-12 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-3">PDF 저장</h3>
                  <p className="text-muted-foreground">
                    미리보기로 최종 확인 후 PDF로 저장하여 어디서든 활용하세요
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-32 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            몇 분이면 완성되는 전문적인 이력서
          </p>
          <Button asChild size="lg" className="group px-10 py-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl">
            <Link href="/data/basic">
              무료로 시작하기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
