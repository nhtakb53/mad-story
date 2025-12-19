"use client";

import Link from "next/link";
import { User, Briefcase, Award, GraduationCap, FolderKanban, Settings } from "lucide-react";
import { TopHeader } from "@/components/top-header";

export default function ProfilePage() {
  return (
    <>
      <TopHeader
        title="내 정보"
        description="이력서 및 경력기술서에 사용될 정보를 관리하세요"
      />
      <div className="pt-[73px] pl-64 print:pt-0 print:pl-0">
        <div className="p-6 max-w-7xl">
        {/* 정보 관리 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/data/basic"
          className="group bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">기본사항</h3>
              <p className="text-xs text-muted-foreground">개인정보 관리</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            이름, 연락처, GitHub, 블로그, 자기소개 등을 입력하세요
          </p>
        </Link>

        <Link
          href="/data/career"
          className="group bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-purple-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">경력</h3>
              <p className="text-xs text-muted-foreground">회사 및 직무 관리</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            회사명, 직책, 재직기간, 업무 내용 및 주요 성과를 입력하세요
          </p>
        </Link>

        <Link
          href="/data/skills"
          className="group bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-green-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">보유기술</h3>
              <p className="text-xs text-muted-foreground">기술 스택 관리</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            카테고리별 기술 스택 및 숙련도를 입력하세요
          </p>
        </Link>

        <Link
          href="/data/education"
          className="group bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-orange-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">학력</h3>
              <p className="text-xs text-muted-foreground">학력 정보 관리</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            학교, 전공, 학위, 학점 정보를 입력하세요
          </p>
        </Link>

        <Link
          href="/data/projects"
          className="group bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-pink-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">프로젝트</h3>
              <p className="text-xs text-muted-foreground">프로젝트 이력 관리</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            프로젝트명, 설명, 기간, 역할, 기술 스택, 주요 성과를 입력하세요
          </p>
        </Link>

        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow border border-gray-300 dark:border-gray-700 opacity-60">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">계정 설정</h3>
              <p className="text-xs text-muted-foreground">준비중</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            계정 설정 기능이 곧 추가됩니다
          </p>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-bold mb-1 text-blue-900 dark:text-blue-200">💡 안내</h3>
        <p className="text-xs text-blue-800 dark:text-blue-300">
          각 항목을 클릭하여 정보를 입력하거나 수정할 수 있습니다.
          입력한 정보는 자동으로 저장되며, 이력서와 경력기술서 작성 시 활용됩니다.
        </p>
      </div>
        </div>
      </div>
    </>
  );
}
