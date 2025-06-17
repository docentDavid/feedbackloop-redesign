-- Create student_progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id SERIAL PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(student_id),
    learning_outcome_id INTEGER NOT NULL REFERENCES public.learning_outcomes(id),
    feedback_moment_id INTEGER NOT NULL REFERENCES public.feedback_moments(id),
    progress_level TEXT NOT NULL CHECK (progress_level IN ('U', 'O', 'B', 'P', 'A')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, learning_outcome_id, feedback_moment_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON public.student_progress
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert sample progress data for Omar Al-Farsi
INSERT INTO public.student_progress (student_id, learning_outcome_id, feedback_moment_id, progress_level) VALUES
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
ON CONFLICT (student_id, learning_outcome_id, feedback_moment_id) 
DO UPDATE SET progress_level = EXCLUDED.progress_level; 