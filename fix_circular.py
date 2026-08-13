import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'export interface DashboardProject \{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'export interface AdminProfileRow \{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'export interface PendingUser \{.*?\}', '', content, flags=re.DOTALL)

# Add the import
if "import { DashboardProject" not in content:
    content = content.replace("import { AdminPanel }", "import { AdminPanel } from '@/features/admin/components/AdminPanel';\nimport { DashboardProject, AdminProfileRow, PendingUser } from '@/features/admin/types';")
    # Clean up double import from my sloppy replace above if it happened
    content = content.replace("import { AdminPanel } from '@/features/admin/components/AdminPanel';\nimport { AdminPanel } from '@/features/admin/components/AdminPanel';", "import { AdminPanel } from '@/features/admin/components/AdminPanel';")

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/features/admin/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = admin_content.replace("@/pages/Dashboard", "@/features/admin/types")

with open('src/features/admin/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)
