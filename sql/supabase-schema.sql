-- Basic Info Table
CREATE TABLE basic_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  github VARCHAR(255),
  blog VARCHAR(255),
  linkedin VARCHAR(255),
  introduce TEXT,
  profile_image VARCHAR(255),
  nickname VARCHAR(50),
  tags TEXT[], -- PostgreSQL array for tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One basic_info per user
);

-- Careers Table
CREATE TABLE careers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  start_date VARCHAR(7), -- YYYY-MM format
  end_date VARCHAR(7),
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[], -- PostgreSQL array for achievements
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Educations Table
CREATE TABLE educations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  school VARCHAR(255) NOT NULL,
  major VARCHAR(255),
  degree VARCHAR(255),
  start_date VARCHAR(7), -- YYYY-MM format
  end_date VARCHAR(7),
  gpa VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date VARCHAR(7), -- YYYY-MM format
  end_date VARCHAR(7),
  role VARCHAR(100),
  tech_stack TEXT[], -- PostgreSQL array for tech stack
  achievements TEXT[], -- PostgreSQL array for achievements
  url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  level INTEGER CHECK (level >= 1 AND level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Other Items Table (기타 사항: 논문, 자격증, 수상 등)
CREATE TABLE other_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- User-customizable type (논문, 자격증, 수상, etc.)
  organization VARCHAR(255), -- Issuing organization (optional)
  date VARCHAR(7), -- YYYY-MM format (optional)
  description TEXT, -- Details/description (optional)
  display_order INTEGER DEFAULT 0, -- For drag-and-drop ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE basic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON basic_info FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON careers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON educations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON skills FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON other_items FOR SELECT USING (true);

-- Create policies for authenticated users (insert, update, delete) - only own data
CREATE POLICY "Users can insert own data" ON basic_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON basic_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON basic_info FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON careers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON careers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON careers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON educations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON educations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON educations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON skills FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON other_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON other_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data" ON other_items FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_basic_info_user_id ON basic_info(user_id);
CREATE INDEX idx_careers_user_id ON careers(user_id);
CREATE INDEX idx_careers_start_date ON careers(start_date DESC);
CREATE INDEX idx_educations_user_id ON educations(user_id);
CREATE INDEX idx_educations_start_date ON educations(start_date DESC);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_start_date ON projects(start_date DESC);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_other_items_user_id ON other_items(user_id);
CREATE INDEX idx_other_items_date ON other_items(date DESC);
CREATE INDEX idx_other_items_category ON other_items(category);
CREATE INDEX idx_other_items_display_order ON other_items(user_id, display_order);
