import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove is_masterpiece from interface
content = re.sub(r"\s*is_masterpiece:\s*boolean;", "", content)

# Remove state hooks
content = re.sub(r"\s*const\s*\[isMasterpiece,\s*setIsMasterpiece\]\s*=\s*useState\(false\);", "", content)
content = re.sub(r"\s*const\s*\[editProjectIsMasterpiece,\s*setEditProjectIsMasterpiece\]\s*=\s*useState\(false\);", "", content)

# Remove select fields (is_masterpiece)
content = content.replace("is_masterpiece, personal_profile_only", "personal_profile_only")

# Remove from insert payload
content = re.sub(r"\s*is_masterpiece:\s*isMasterpiece,", "", content)
# Remove from update payload
content = re.sub(r"\s*is_masterpiece:\s*editProjectIsMasterpiece,", "", content)

# Remove state resets
content = re.sub(r"\s*setIsMasterpiece\(false\);", "", content)
content = re.sub(r"\s*setEditProjectIsMasterpiece\(project\.is_masterpiece\s*\|\|\s*false\);", "", content)
content = re.sub(r"\s*if\s*\(next\)\s*setEditProjectIsMasterpiece\(false\);", "", content)

# Remove masterpiece badge code from project cards
content = re.sub(r"\s*<div className=\{w-10 h-10.*?\}>\s*<FolderKanban.*?</div>", 
                 r"""
                          <div className={w-10 h-10 rounded-lg flex items-center justify-center mb-4 }>
                            <FolderKanban size={20} />
                          </div>""", content, flags=re.DOTALL)
                          
content = re.sub(r"\s*<span className=\{	ext-xs font-medium px-1\.5 py-0\.5 rounded-full \$\{item\.is_masterpiece \? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'\}\}>\s*\{item\.is_masterpiece \? 'Masterpiece' : 'Standard'\}\s*</span>", 
                 r"""
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                              Standard
                            </span>""", content, flags=re.DOTALL)

# Remove masterpiece toggle block 1
content = re.sub(r"\s*\{/\* Masterpiece Toggle Switch \*/\}.*?\{/\* Personal Profile Only Toggle \*/\}", "\n\n                  {/* Personal Profile Only Toggle */}", content, flags=re.DOTALL)

# Remove masterpiece toggle block 2
content = re.sub(r"\s*<div className=\"flex items-center justify-between py-4 border-y border-border\">\s*<div>\s*<h4 className=\"font-medium text-foreground flex items-center space-x-2\">\s*<span>\{t\('dashboard\.masterpiece_badge', 'Masterpiece Badge'\)\}</span>\s*</h4>\s*<p className=\"text-sm text-muted-foreground mt-1\">Showcase this project with a golden highlight\.</p>\s*</div>\s*<button.*?</button>\s*</div>", "", content, flags=re.DOTALL)

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
