"use client";

import { Treemap, ResponsiveContainer } from "recharts";

interface TechItem {
  name: string;
  value: number;
  [key: string]: any;
}

interface CategoryGroup {
  name: string;
  children: TechItem[];
  [key: string]: any;
}

interface TechStackTreemapProps {
  data: CategoryGroup[];
  height?: number;
  showLegend?: boolean;
}

// 기술 스택별 아이콘 URL 매핑
const TECH_ICONS: Record<string, string> = {
  // 프론트엔드
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'Tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',

  // 백엔드
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'Spring': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',

  // 데이터베이스
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'Oracle': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg',

  // 클라우드/인프라
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
  'Nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',

  // 모바일
  'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
};

const CATEGORY_COLORS: Record<string, string> = {
  '프론트엔드': '#475569',      // slate-600
  '백엔드': '#64748b',          // slate-500
  '데이터베이스': '#71717a',    // zinc-500
  '클라우드/인프라': '#78716c',  // stone-500
  '모바일': '#6b7280',          // gray-500
  '기타': '#52525b'             // zinc-600
};

const MAIN_CATEGORIES = ['프론트엔드', '백엔드', '데이터베이스', '클라우드/인프라', '모바일'];

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, value, color } = props;

  // 폰트 크기를 영역 크기에 따라 동적으로 조정
  const area = width * height;
  let baseFontSize: number;

  if (area > 10000) {
    baseFontSize = 14;
  } else if (area > 5000) {
    baseFontSize = 12;
  } else if (area > 2500) {
    baseFontSize = 10;
  } else if (area > 1000) {
    baseFontSize = 9;
  } else {
    baseFontSize = 8;
  }

  // 너비와 높이에 맞게 추가 조정
  baseFontSize = Math.min(baseFontSize, width / 5, height / 2.5);

  const iconSize = Math.min(width * 0.5, height * 0.5, 32);
  const hasIcon = TECH_ICONS[name];
  const shouldShowIcon = hasIcon && width > 30 && height > 30;
  const shouldShowValue = width > 50 && height > 35;

  // 텍스트 줄바꿈 처리
  const truncateText = (text: string, maxWidth: number, fontSize: number) => {
    const avgCharWidth = fontSize * 0.6;
    const maxChars = Math.floor(maxWidth / avgCharWidth);
    if (text.length > maxChars && maxChars > 3) {
      return text.slice(0, maxChars - 2) + '..';
    }
    return text;
  };

  const displayName = truncateText(name || '', width - 12, baseFontSize);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: '#ffffff',
          stroke: color,
          strokeWidth: 2,
        }}
      />
      {width > 30 && height > 25 && (
        <>
          {shouldShowIcon && (
            <image
              x={x + width / 2 - iconSize / 2}
              y={y + height / 2 - iconSize / 2 - (shouldShowValue ? baseFontSize / 2 : 0)}
              width={iconSize}
              height={iconSize}
              href={TECH_ICONS[name]}
              opacity={0.9}
            />
          )}
          <text
            x={x + width / 2}
            y={y + height / 2 + (shouldShowIcon ? iconSize / 2 + baseFontSize / 2 : (shouldShowValue ? -baseFontSize / 2 : baseFontSize / 3))}
            textAnchor="middle"
            fill={color}
            fontSize={baseFontSize}
            fontWeight="700"
            stroke="none"
          >
            {displayName}
          </text>
          {shouldShowValue && !shouldShowIcon && (
            <text
              x={x + width / 2}
              y={y + height / 2 + baseFontSize * 0.8}
              textAnchor="middle"
              fill={color}
              fontSize={baseFontSize * 0.8}
              fontWeight="600"
              opacity={0.7}
              stroke="none"
            >
              {value}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export function TechStackTreemap({ data, height = 400, showLegend = true }: TechStackTreemapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        데이터가 없습니다
      </div>
    );
  }

  // 메인 카테고리만 필터링 및 정렬
  const filteredCategories = data.filter(cat => MAIN_CATEGORIES.includes(cat.name));

  return (
    <div className="grid grid-cols-2 gap-0">
      {filteredCategories.map((category) => {
        const color = CATEGORY_COLORS[category.name] || CATEGORY_COLORS['기타'];
        const categoryHeight = 180;

        return (
          <div key={category.name} className="relative" style={{ border: `2px solid ${color}` }}>
            <div className="absolute top-0 left-0 z-10 flex items-center gap-1.5 px-2 py-1" style={{ backgroundColor: color }}>
              <h3 className="text-xs font-bold text-white">{category.name}</h3>
              <span className="text-xs text-white/80">
                ({category.children.length})
              </span>
            </div>
            <ResponsiveContainer width="100%" height={categoryHeight}>
              <Treemap
                data={category.children}
                dataKey="value"
                stroke="#fff"
                fill={color}
                content={<CustomTreemapContent color={color} />}
                isAnimationActive={false}
              />
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
