'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, getSession } from '@/lib/auth'
import { CheckCircle2, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminPage() {
  const [userId, setUserId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await getCurrentUser()
        const session = await getSession()

        if (user) {
          setUserId(user.id)
          setUserEmail(user.email || '')
          setUserName(user.user_metadata?.full_name || user.user_metadata?.name || '')
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-4">
            GitHub 계정으로 로그인해주세요.
          </p>
          <Button asChild>
            <a href="/">홈으로 돌아가기</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">관리자 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 사용자 정보 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">사용자 정보</h2>
              <div className="space-y-3">
                {userName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <div className="mt-1 text-gray-900">{userName}</div>
                  </div>
                )}
                {userEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <div className="mt-1 text-gray-900">{userEmail}</div>
                  </div>
                )}
              </div>
            </div>

            {/* User ID */}
            <div>
              <h2 className="text-lg font-semibold mb-4">User ID (마이그레이션 필요)</h2>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
                  {userId}
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="gap-2"
                  title="클립보드에 복사"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>복사</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 마이그레이션 안내 */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 text-base">
                  데이터 마이그레이션 방법
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>위의 User ID를 복사합니다</li>
                <li>터미널을 열고 프로젝트 디렉토리로 이동합니다</li>
                <li>
                  다음 명령어를 실행합니다:
                  <div className="mt-2 p-2 bg-white rounded font-mono text-xs overflow-x-auto">
                    npm run migrate {userId}
                  </div>
                </li>
                <li>마이그레이션이 완료될 때까지 기다립니다</li>
              </ol>
                <div className="mt-3 text-xs text-blue-700">
                  자세한 내용은 <code className="bg-white px-1 py-0.5 rounded">MIGRATION.md</code> 파일을 참고하세요.
                </div>
              </CardContent>
            </Card>

            {/* 환경 변수 확인 */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-900 text-base">
                  ⚠️ 마이그레이션 전 확인사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                <li>.env.local 파일에 SUPABASE_SERVICE_KEY가 설정되어 있는지 확인</li>
                <li>Supabase 대시보드에서 스키마(테이블)가 생성되어 있는지 확인</li>
                <li>tsx 패키지가 설치되어 있는지 확인 (npm install)</li>
                </ul>
              </CardContent>
            </Card>

            {/* 링크 */}
            <div className="flex gap-3">
              <Button variant="secondary" asChild>
                <a href="/">홈으로</a>
              </Button>
              <Button asChild>
                <a href="/data/basic">데이터 관리</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
