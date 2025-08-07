-- Create table for storing document questions
CREATE TABLE public.document_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    document_title TEXT NOT NULL,
    document_type TEXT,
    question TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    answer TEXT,
    answered_by UUID,
    answered_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own questions and answered questions" 
ON public.document_questions 
FOR SELECT 
USING (
    auth.uid() = user_id 
    OR status = 'answered' 
    OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type = 'admin'
    )
);

CREATE POLICY "Authenticated users can create questions" 
ON public.document_questions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions or officials can answer" 
ON public.document_questions 
FOR UPDATE 
USING (
    auth.uid() = user_id 
    OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type IN ('admin', 'official')
    )
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_document_questions_updated_at
BEFORE UPDATE ON public.document_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_document_questions_user_id ON public.document_questions(user_id);
CREATE INDEX idx_document_questions_status ON public.document_questions(status);
CREATE INDEX idx_document_questions_category ON public.document_questions(category);
CREATE INDEX idx_document_questions_created_at ON public.document_questions(created_at);

-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;