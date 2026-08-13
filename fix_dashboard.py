import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "{activeTab === 'articles' && (" in line:
        start_idx = i
        break

if start_idx != -1:
    end_idx = -1
    for i in range(start_idx, len(lines)):
        if "</main>" in lines[i]:
            end_idx = i
            break
            
    if end_idx != -1:
        # replace from start_idx to end_idx - 3 (to keep the closing divs)
        replacement = [
            "            {activeTab === 'admin' && isSystemAdmin && (\n",
            "              <ManageReviewsPanel />\n",
            "            )}\n",
            "            \n",
            "          </div>\n",
            "        </div>\n",
            "      </main>\n"
        ]
        lines = lines[:start_idx] + replacement + lines[end_idx+1:]
        print("Replaced successfully via array slicing")

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
