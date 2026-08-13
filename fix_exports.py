import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("interface DashboardProject {", "export interface DashboardProject {")
content = content.replace("interface AdminProfileRow {", "export interface AdminProfileRow {")
content = content.replace("interface PendingUser {", "export interface PendingUser {")

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/features/admin/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = re.sub(r'export interface DashboardProject \{.*?\}', '', admin_content, flags=re.DOTALL)
admin_content = re.sub(r'export interface AdminProfileRow \{.*?\}', '', admin_content, flags=re.DOTALL)
admin_content = re.sub(r'export interface PendingUser \{.*?\}', '', admin_content, flags=re.DOTALL)
admin_content = admin_content.replace("import { toast } from 'sonner';", "import { toast } from 'sonner';\nimport { DashboardProject, AdminProfileRow, PendingUser } from '@/pages/Dashboard';")

with open('src/features/admin/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_content)
