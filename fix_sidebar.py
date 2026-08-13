import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

desktop_target = r"""            \{isSystemAdmin && \(
              <button 
                onClick=\{.*?\}
                className=\{.*?\}
              >
                <Star size=\{18\} />
                <span>Manage Reviews</span>
              </button>
            \}"""

desktop_replacement = r"""            {isSystemAdmin && (
              <>
                <button 
                  onClick={() => setActiveTab('team')}
                  className={w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all }
                >
                  <Shield size={18} />
                  <span>Manage Team</span>
                </button>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all }
                >
                  <Star size={18} />
                  <span>Manage Reviews</span>
                </button>
              </>
            )}"""

mobile_target = r"""                \{isSystemAdmin && \(
                  <button 
                    onClick=\{.*?\}
                    className=\{.*?\}
                  >
                    <Star size=\{18\} />
                    <span>Manage Reviews</span>
                  </button>
                \}\)"""

mobile_replacement = r"""                {isSystemAdmin && (
                  <>
                    <button 
                      onClick={() => { setActiveTab('team'); setMobileSidebarOpen(false); }}
                      className={w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all }
                    >
                      <Shield size={18} />
                      <span>Manage Team</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('admin'); setMobileSidebarOpen(false); }}
                      className={w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all }
                    >
                      <Star size={18} />
                      <span>Manage Reviews</span>
                    </button>
                  </>
                )}"""

content = re.sub(desktop_target, desktop_replacement, content, flags=re.DOTALL)
content = re.sub(mobile_target, mobile_replacement, content, flags=re.DOTALL)

# Add header title mapping
content = content.replace("{activeTab === 'admin' && 'Manage Reviews'}", "{activeTab === 'admin' && 'Manage Reviews'}\n              {activeTab === 'team' && 'Manage Team'}")

# Import AdminPanel
if "AdminPanel" not in content[:500]:
    content = content.replace("import { ManageReviewsPanel }", "import { AdminPanel } from '@/features/admin/components/AdminPanel';\nimport { ManageReviewsPanel }")

# Insert AdminPanel component render
render_target = r"(\{activeTab === 'admin' && isSystemAdmin && \(\s*<ManageReviewsPanel />\s*\)\})"
render_replacement = r"\1\n\n            {activeTab === 'team' && isSystemAdmin && (\n              <AdminPanel \n                isSystemAdmin={isSystemAdmin}\n                pendingUsers={pendingUsers}\n                setPendingUsers={setPendingUsers}\n                adminLoading={adminLoading}\n                setAdminLoading={setAdminLoading}\n              />\n            )}"
content = re.sub(render_target, render_replacement, content, flags=re.DOTALL)

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated sidebar and rendering logic")
