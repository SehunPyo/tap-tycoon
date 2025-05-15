// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksaxkpuibqnphsqsjoip.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXhrcHVpYnFucGhzcXNqb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTExMzksImV4cCI6MjA2MjY4NzEzOX0.6nByh5BW3tG6iUApKgdUrJfidiiNhan5flHa5aPA0bk'

export const supabase = createClient(supabaseUrl, supabaseKey)
