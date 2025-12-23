import { supabase } from './supabase'
import { getCurrentUser } from './auth'

// Basic Info API
export async function getBasicInfo(userId?: string) {
  let query = supabase.from('basic_info').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.single()

  if (error) throw error
  return data
}

export async function updateBasicInfo(info: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('basic_info')
    .upsert({ ...info, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

// Careers API
export async function getCareers(userId?: string) {
  let query = supabase.from('careers').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('start_date', { ascending: false })

  if (error) throw error
  return data
}

export async function createCareer(career: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('careers')
    .insert({ ...career, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCareer(id: string, career: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('careers')
    .update(career)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCareer(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('careers')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Educations API
export async function getEducations(userId?: string) {
  let query = supabase.from('educations').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('start_date', { ascending: false })

  if (error) throw error
  return data
}

export async function createEducation(education: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('educations')
    .insert({ ...education, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEducation(id: string, education: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('educations')
    .update(education)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEducation(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('educations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Projects API
export async function getProjects(userId?: string) {
  let query = supabase.from('projects').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('start_date', { ascending: false })

  if (error) throw error
  return data
}

export async function createProject(project: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, project: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Skills API
export async function getSkills(userId?: string) {
  let query = supabase.from('skills').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('category', { ascending: true })

  if (error) throw error
  return data
}

export async function createSkill(skill: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('skills')
    .insert({ ...skill, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSkill(id: string, skill: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSkill(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Other Items API
export async function getOtherItems(userId?: string) {
  let query = supabase.from('other_items').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.order('display_order', { ascending: true })

  if (error) throw error
  return data
}

export async function createOtherItem(item: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('other_items')
    .insert({ ...item, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOtherItem(id: string, item: any) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('other_items')
    .update(item)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOtherItem(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('other_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Tech Stack Categories
const TECH_CATEGORIES: Record<string, string[]> = {
  '프론트엔드': [
    'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind', 'Bootstrap',
    'jQuery', 'Redux', 'Recoil', 'MobX', 'Zustand', 'Sass', 'SCSS',
    'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier'
  ],
  '백엔드': [
    'Node.js', 'Express', 'NestJS', 'Fastify', 'Koa',
    'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring', 'Spring Boot',
    'Go', 'Gin', 'Echo',
    'Ruby', 'Rails',
    'PHP', 'Laravel',
    'C#', '.NET', 'ASP.NET',
    'Rust', 'Actix'
  ],
  '데이터베이스': [
    'MySQL', 'PostgreSQL', 'MariaDB', 'Oracle', 'MS SQL',
    'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
    'Supabase', 'Firebase', 'Firestore',
    'Cassandra', 'CouchDB', 'SQLite'
  ],
  '클라우드/인프라': [
    'AWS', 'Azure', 'GCP', 'Heroku', 'Vercel', 'Netlify',
    'Docker', 'Kubernetes', 'K8s',
    'Jenkins', 'GitHub Actions', 'GitLab CI',
    'Terraform', 'Ansible', 'CloudFormation',
    'Nginx', 'Apache'
  ],
  '모바일': [
    'React Native', 'Flutter', 'Swift', 'Kotlin',
    'iOS', 'Android', 'Expo', 'Ionic', 'Xamarin'
  ],
  '데이터/AI': [
    'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
    'Pandas', 'NumPy', 'Jupyter',
    'Spark', 'Hadoop', 'Kafka', 'Airflow'
  ],
  '기타': []
}

function getCategoryForTech(tech: string): string {
  const techLower = tech.toLowerCase().trim()

  // 정확히 일치하는 경우 먼저 체크
  for (const [category, techs] of Object.entries(TECH_CATEGORIES)) {
    if (techs.some(t => t.toLowerCase() === techLower)) {
      return category
    }
  }

  // 부분 일치 체크 (긴 것부터 먼저 매칭)
  for (const [category, techs] of Object.entries(TECH_CATEGORIES)) {
    const sortedTechs = [...techs].sort((a, b) => b.length - a.length)
    for (const t of sortedTechs) {
      const tLower = t.toLowerCase()
      // 정확한 단어 매칭 (공백이나 특수문자로 구분된 단어)
      const regex = new RegExp(`\\b${tLower}\\b`, 'i')
      if (regex.test(techLower)) {
        return category
      }
    }
  }

  return '기타'
}

// Tech Stack Statistics (Flat structure)
export async function getTechStackStats(userId?: string) {
  const projects = await getProjects(userId)

  const techCount: Record<string, { value: number; category: string }> = {}

  projects?.forEach((project: any) => {
    if (project.tech_stack && Array.isArray(project.tech_stack)) {
      project.tech_stack.forEach((tech: string) => {
        if (!techCount[tech]) {
          techCount[tech] = {
            value: 0,
            category: getCategoryForTech(tech)
          }
        }
        techCount[tech].value += 1
      })
    }
  })

  return Object.entries(techCount).map(([name, data]) => ({
    name,
    value: data.value,
    category: data.category
  })).sort((a, b) => b.value - a.value)
}

// Tech Stack Statistics (Hierarchical structure for grouped treemap)
export async function getTechStackStatsGrouped(userId?: string) {
  const projects = await getProjects(userId)

  const categoryData: Record<string, { name: string; children: { name: string; value: number }[] }> = {}

  projects?.forEach((project: any) => {
    if (project.tech_stack && Array.isArray(project.tech_stack)) {
      project.tech_stack.forEach((tech: string) => {
        const category = getCategoryForTech(tech)

        if (!categoryData[category]) {
          categoryData[category] = {
            name: category,
            children: []
          }
        }

        const existingTech = categoryData[category].children.find(t => t.name === tech)
        if (existingTech) {
          existingTech.value += 1
        } else {
          categoryData[category].children.push({
            name: tech,
            value: 1
          })
        }
      })
    }
  })

  return Object.values(categoryData).map(cat => ({
    ...cat,
    children: cat.children.sort((a, b) => b.value - a.value)
  }))
}
