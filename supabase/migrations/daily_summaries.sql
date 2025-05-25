-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Drop the view if it exists
DROP VIEW IF EXISTS daily_summaries;

-- Create the view
CREATE VIEW daily_summaries AS
SELECT 
    ce.user_id,
    ce.date,
    COALESCE(SUM(CASE WHEN ce.category = 'transportation' THEN ce.emissions ELSE 0 END), 0) as transportation,
    COALESCE(SUM(CASE WHEN ce.category = 'energy' THEN ce.emissions ELSE 0 END), 0) as energy,
    COALESCE(SUM(CASE WHEN ce.category = 'diet' THEN ce.emissions ELSE 0 END), 0) as diet,
    COALESCE(SUM(CASE WHEN ce.category = 'waste' THEN ce.emissions ELSE 0 END), 0) as waste,
    COALESCE(SUM(ce.emissions), 0) as total,
    MIN(ce.created_at) as created_at
FROM carbon_entries ce
GROUP BY ce.user_id, ce.date
ORDER BY ce.date DESC;

-- Grant access to authenticated users
ALTER VIEW daily_summaries OWNER TO authenticated;
GRANT SELECT ON daily_summaries TO authenticated;

-- Enable RLS
ALTER VIEW daily_summaries SET (security_invoker = on);

-- Create RLS policy for the view
CREATE POLICY "Users can view own daily summaries"
    ON daily_summaries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id); 