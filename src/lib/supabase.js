import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hojyseoprjeuepeujdkp.supabase.co'
const supabaseKey = 'sb_publishable_jD7BsMu-yMh1cb5RGPDV5w_Iw_0h9ai'

// Revisa que esta línea tenga el "export" antes del "const"
export const supabase = createClient(supabaseUrl, supabaseKey)
