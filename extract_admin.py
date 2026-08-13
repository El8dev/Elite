import re

with open('old_dashboard.tsx', 'r', encoding='utf-16') as f:
    old_content = f.read()

# Extract the AdminPanel block
admin_match = re.search(r'(// AdminPanel Component.*)', old_content, re.DOTALL)
if admin_match:
    admin_code = admin_match.group(1)
    
    # We need to add the types: PendingUser, AdminProfileRow, DashboardProject
    types = '''
export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  personal_profile_only: boolean;
  image_url?: string[];
  live_link?: string;
  github_link?: string;
  created_at?: string;
}

export interface AdminProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  account_status: string | null;
  role: string | null;
  job_title: string | null;
}

export interface PendingUser {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string | null;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  account_status: string | null;
  created_at: string | null;
}
'''
    
    imports = '''import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Shield, Search, Users, CheckCircle, XCircle, Trash2, Loader2, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';

'''

    final_code = imports + types + admin_code
    
    # Remove is_masterpiece from AdminPanel since we deleted it
    final_code = re.sub(r'\s*is_masterpiece:\s*boolean;', '', final_code)
    final_code = re.sub(r'is_masterpiece,\s*', '', final_code)
    
    with open('src/features/admin/components/AdminPanel.tsx', 'w', encoding='utf-8') as out:
        out.write(final_code)
    print("Extracted AdminPanel to src/features/admin/components/AdminPanel.tsx")
else:
    print("AdminPanel Component not found in old_dashboard.tsx")
