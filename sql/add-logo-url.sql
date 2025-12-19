-- Add logo_url and logo_fit columns to careers, educations, and projects tables
-- Migration Date: 2025-12-19

-- Add logo_url column to careers table
ALTER TABLE careers ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE careers ADD COLUMN IF NOT EXISTS logo_fit VARCHAR(10) DEFAULT 'contain';

-- Add logo_url column to educations table
ALTER TABLE educations ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE educations ADD COLUMN IF NOT EXISTS logo_fit VARCHAR(10) DEFAULT 'contain';

-- Add logo_url column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo_fit VARCHAR(10) DEFAULT 'contain';
