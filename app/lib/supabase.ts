// Note: This file requires the @supabase/supabase-js package to be installed.
// Run: npm install @supabase/supabase-js
// or: yarn add @supabase/supabase-js
// to resolve the linter error.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add debug log
console.log("=== DEBUG: Supabase URL ===", supabaseUrl);

// SQL schema for tables
export const schema = `
-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  class_id INTEGER REFERENCES classes(id)
);

-- Create learning_outcomes table
CREATE TABLE IF NOT EXISTS learning_outcomes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT DEFAULT 'undefined'
);

-- Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(student_id),
  learning_outcome_id INTEGER NOT NULL REFERENCES learning_outcomes(id),
  feedback_moment_id INTEGER NOT NULL REFERENCES feedback_moments(id),
  progress_level TEXT NOT NULL CHECK (progress_level IN ('U', 'O', 'B', 'P', 'A')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, learning_outcome_id, feedback_moment_id)
);

-- Create feedback_moments table
CREATE TABLE IF NOT EXISTS feedback_moments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Insert classes
INSERT INTO classes (name) VALUES
  ('Media - Semester 2 - Tilburg'),
  ('Media Semester 3 - Tilburg'),
  ('Main - Front End Development - Tilburg'),
  ('Main - Front End Development - Eindhoven')
ON CONFLICT (name) DO NOTHING;

-- Insert students (example for one class, repeat for others)
INSERT INTO students (name, email, student_id, avatar, class_id) VALUES
  ('Daan de Vries', 'd.devries@student.fontys.nl', 'S1002001', 'https://randomuser.me/api/portraits/men/1.jpg', 1),
  ('Lieke Bakker', 'l.bakker@student.fontys.nl', 'S1002002', 'https://randomuser.me/api/portraits/women/2.jpg', 1),
  ('Tim van Dijk', 't.vandijk@student.fontys.nl', 'S1002003', 'https://randomuser.me/api/portraits/men/3.jpg', 1),
  ('Sanne Jansen', 's.jansen@student.fontys.nl', 'S1002004', 'https://randomuser.me/api/portraits/women/4.jpg', 1),
  ('Niels Visser', 'n.visser@student.fontys.nl', 'S1002005', 'https://randomuser.me/api/portraits/men/5.jpg', 1),
  ('Femke Smit', 'f.smit@student.fontys.nl', 'S1002006', 'https://randomuser.me/api/portraits/women/6.jpg', 1),
  ('Bram Vermeulen', 'b.vermeulen@student.fontys.nl', 'S1002007', 'https://randomuser.me/api/portraits/men/7.jpg', 1),
  ('Eva Mulder', 'e.mulder@student.fontys.nl', 'S1002008', 'https://randomuser.me/api/portraits/women/8.jpg', 1),
  ('Ruben de Jong', 'r.dejong@student.fontys.nl', 'S1002009', 'https://randomuser.me/api/portraits/men/9.jpg', 1),
  ('Lisa van den Berg', 'l.vandenberg@student.fontys.nl', 'S1002010', 'https://randomuser.me/api/portraits/women/10.jpg', 1),
  ('Jasper Willems', 'j.willems@student.fontys.nl', 'S1002011', 'https://randomuser.me/api/portraits/men/11.jpg', 1),
  ('Sophie Peters', 's.peters@student.fontys.nl', 'S1002012', 'https://randomuser.me/api/portraits/women/12.jpg', 1),
  ('Tom van Leeuwen', 't.vanleeuwen@student.fontys.nl', 'S1002013', 'https://randomuser.me/api/portraits/men/13.jpg', 1),
  ('Mila Vos', 'm.vos@student.fontys.nl', 'S1002014', 'https://randomuser.me/api/portraits/women/14.jpg', 1),
  -- Media Semester 3 - Tilburg students
  ('Rick de Groot', 'r.degroot@student.fontys.nl', 'S1002021', 'https://randomuser.me/api/portraits/men/21.jpg', 2),
  ('Julia Kuipers', 'j.kuipers@student.fontys.nl', 'S1002022', 'https://randomuser.me/api/portraits/women/22.jpg', 2),
  ('Max van Dam', 'm.vandam@student.fontys.nl', 'S1002023', 'https://randomuser.me/api/portraits/men/23.jpg', 2),
  ('Emma de Boer', 'e.deboer@student.fontys.nl', 'S1002024', 'https://randomuser.me/api/portraits/women/24.jpg', 2),
  ('Lars Smits', 'l.smits@student.fontys.nl', 'S1002025', 'https://randomuser.me/api/portraits/men/25.jpg', 2),
  ('Tessa Jacobs', 't.jacobs@student.fontys.nl', 'S1002026', 'https://randomuser.me/api/portraits/women/26.jpg', 2),
  ('Dylan van der Meer', 'd.vandermeer@student.fontys.nl', 'S1002027', 'https://randomuser.me/api/portraits/men/27.jpg', 2),
  ('Noa de Wit', 'n.dewit@student.fontys.nl', 'S1002028', 'https://randomuser.me/api/portraits/women/28.jpg', 2),
  ('Jelle Bakker', 'j.bakker@student.fontys.nl', 'S1002029', 'https://randomuser.me/api/portraits/men/29.jpg', 2),
  ('Saar van Dongen', 's.vandongen@student.fontys.nl', 'S1002030', 'https://randomuser.me/api/portraits/women/30.jpg', 2),
  ('Mats de Bruin', 'm.debruin@student.fontys.nl', 'S1002031', 'https://randomuser.me/api/portraits/men/31.jpg', 2),
  ('Fleur Smit', 'f.smit2@student.fontys.nl', 'S1002032', 'https://randomuser.me/api/portraits/women/32.jpg', 2),
  ('Joris van Vliet', 'j.vanvliet@student.fontys.nl', 'S1002033', 'https://randomuser.me/api/portraits/men/33.jpg', 2),
  ('Lotte de Jong', 'l.dejong@student.fontys.nl', 'S1002034', 'https://randomuser.me/api/portraits/women/34.jpg', 2),
  -- Main - Front End Development - Tilburg students
  ('Pim van der Linden', 'p.vanderlinden@student.fontys.nl', 'S1002041', 'https://randomuser.me/api/portraits/men/41.jpg', 3),
  ('Sven de Graaf', 's.degraaf@student.fontys.nl', 'S1002042', 'https://randomuser.me/api/portraits/men/42.jpg', 3),
  ('Nina van den Heuvel', 'n.vandenheuvel@student.fontys.nl', 'S1002043', 'https://randomuser.me/api/portraits/women/43.jpg', 3),
  ('Ahmed El Amrani', 'a.elamrani@student.fontys.nl', 'S1002044', 'https://randomuser.me/api/portraits/men/44.jpg', 3),
  ('Yasmin Benali', 'y.benali@student.fontys.nl', 'S1002045', 'https://randomuser.me/api/portraits/women/45.jpg', 3),
  ('Omar Al-Farsi', 'o.alfarsi@student.fontys.nl', 'S1002046', 'https://randomuser.me/api/portraits/men/46.jpg', 3),
  ('Ayşe Yılmaz', 'a.yilmaz@student.fontys.nl', 'S1002047', 'https://randomuser.me/api/portraits/women/47.jpg', 3),
  ('Mehmet Kaya', 'm.kaya@student.fontys.nl', 'S1002048', 'https://randomuser.me/api/portraits/men/48.jpg', 3),
  ('Fatima Zahra', 'f.zahra@student.fontys.nl', 'S1002049', 'https://randomuser.me/api/portraits/women/49.jpg', 3),
  ('James Smith', 'j.smith@student.fontys.nl', 'S1002050', 'https://randomuser.me/api/portraits/men/50.jpg', 3),
  ('Emily Johnson', 'e.johnson@student.fontys.nl', 'S1002051', 'https://randomuser.me/api/portraits/women/51.jpg', 3),
  ('Pierre Dubois', 'p.dubois@student.fontys.nl', 'S1002052', 'https://randomuser.me/api/portraits/men/52.jpg', 3),
  ('Sophie Lefevre', 's.lefevre@student.fontys.nl', 'S1002053', 'https://randomuser.me/api/portraits/women/53.jpg', 3),
  ('Giulia Rossi', 'g.rossi@student.fontys.nl', 'S1002054', 'https://randomuser.me/api/portraits/women/54.jpg', 3),
  -- Main - Front End Development - Eindhoven students
  ('Carlos García', 'c.garcia@student.fontys.nl', 'S1002061', 'https://randomuser.me/api/portraits/men/61.jpg', 4),
  ('Maria Fernandez', 'm.fernandez@student.fontys.nl', 'S1002062', 'https://randomuser.me/api/portraits/women/62.jpg', 4),
  ('Ali Hassan', 'a.hassan@student.fontys.nl', 'S1002063', 'https://randomuser.me/api/portraits/men/63.jpg', 4),
  ('Sofia Romano', 's.romano@student.fontys.nl', 'S1002064', 'https://randomuser.me/api/portraits/women/64.jpg', 4),
  ('John Brown', 'j.brown@student.fontys.nl', 'S1002065', 'https://randomuser.me/api/portraits/men/65.jpg', 4),
  ('Amina El Idrissi', 'a.elidrissi@student.fontys.nl', 'S1002066', 'https://randomuser.me/api/portraits/women/66.jpg', 4),
  ('Lucas Moreau', 'l.moreau@student.fontys.nl', 'S1002067', 'https://randomuser.me/api/portraits/men/67.jpg', 4),
  ('Sara Bianchi', 's.bianchi@student.fontys.nl', 'S1002068', 'https://randomuser.me/api/portraits/women/68.jpg', 4),
  ('Mohammed Bouzid', 'm.bouzid@student.fontys.nl', 'S1002069', 'https://randomuser.me/api/portraits/men/69.jpg', 4),
  ('Emma Dubois', 'e.dubois@student.fontys.nl', 'S1002070', 'https://randomuser.me/api/portraits/women/70.jpg', 4),
  ('David Wilson', 'd.wilson@student.fontys.nl', 'S1002071', 'https://randomuser.me/api/portraits/men/71.jpg', 4),
  ('Fatma Yildiz', 'f.yildiz@student.fontys.nl', 'S1002072', 'https://randomuser.me/api/portraits/women/72.jpg', 4),
  ('Hugo Martin', 'h.martin@student.fontys.nl', 'S1002073', 'https://randomuser.me/api/portraits/men/73.jpg', 4),
  ('Isabella Costa', 'i.costa@student.fontys.nl', 'S1002074', 'https://randomuser.me/api/portraits/women/74.jpg', 4)
ON CONFLICT (student_id) DO NOTHING;

-- Insert learning outcomes
INSERT INTO learning_outcomes (title, description) VALUES
  ('LO1 - Conceptualize, design, and develop interactive media products', 'You create engaging concepts and translate them into interactive validated media products by applying user-centred design principles, and visual design techniques and by exploring emerging trends and developments in media, design and technologies.'),
  ('LO2 - Transferable production', 'You document and comment on your code using version control in a personal and team context and communicate technical recommendations.'),
  ('LO3 - Creative iterations', 'You present the successive iterations of your creative process, and the connections between them, of your methodically substantiated, iterative design and development process.'),
  ('LO4 - Professional standards', 'Both individually and in teams, you apply a relevant methodological approach used in the professional field to formulate project goals, involve stakeholders, conduct applied (BA) or action-oriented (AD) research, provide advice, make decisions, and deliver reports. In doing so, you consider the relevant ethical, intercultural, and sustainable aspects.'),
  ('LO5 - Personal leadership', 'You are aware of your strengths and weaknesses, both in ICT and your personal development. You choose actions aligning with your core values to promote your personal growth and develop your learning attitude.')
ON CONFLICT (title) DO NOTHING;

-- Insert feedback moments
INSERT INTO feedback_moments (name, date, description) VALUES
  ('Portfolio / FeedPulse - versie 1 (Week 6)', '2023-03-30', 'First iteration of your portfolio'),
  ('Portfolio / FeedPulse - versie 2 (Week 10)', '2023-05-04', 'Second iteration of your portfolio'),
  ('Portfolio / FeedPulse - versie 3 (Week 15)', '2023-06-15', 'Third iteration of your portfolio'),
  ('Portfolio / FeedPulse - versie 4 (Week 18)', '2023-07-02', 'Fourth/Final iteration of your portfolio')
ON CONFLICT (name) DO NOTHING;

-- Insert sample progress data for Omar Al-Farsi
INSERT INTO student_progress (student_id, learning_outcome_id, feedback_moment_id, progress_level) VALUES
  -- Moment 1 (Week 6)
  ('S1002046', 1, 1, 'O'),
  ('S1002046', 2, 1, 'B'),
  ('S1002046', 3, 1, 'O'),
  ('S1002046', 4, 1, 'O'),
  ('S1002046', 5, 1, 'B'),
  -- Moment 2 (Week 10)
  ('S1002046', 1, 2, 'B'),
  ('S1002046', 2, 2, 'P'),
  ('S1002046', 3, 2, 'B'),
  ('S1002046', 4, 2, 'B'),
  ('S1002046', 5, 2, 'P'),
  -- Moment 3 (Week 15)
  ('S1002046', 1, 3, 'P'),
  ('S1002046', 2, 3, 'A'),
  ('S1002046', 3, 3, 'P'),
  ('S1002046', 4, 3, 'P'),
  ('S1002046', 5, 3, 'A'),
  -- Moment 4 (Week 18)
  ('S1002046', 1, 4, 'A'),
  ('S1002046', 2, 4, 'A'),
  ('S1002046', 3, 4, 'A'),
  ('S1002046', 4, 4, 'A'),
  ('S1002046', 5, 4, 'A')
ON CONFLICT (student_id, learning_outcome_id, feedback_moment_id) DO UPDATE
SET progress_level = EXCLUDED.progress_level;
`;
