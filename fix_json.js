const fs = require('fs');
const files = [
  'frontend/src/pages/Dashboard.jsx',
  'frontend/src/pages/Projects.jsx',
  'frontend/src/pages/Tasks.jsx',
  'frontend/src/pages/Members.jsx',
  'frontend/src/pages/Settings.jsx',
  'frontend/src/components/layout/Sidebar.jsx'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/JSON\.parse\(localStorage\.getItem\('user'\) \|\| '\{\}'\)/g, '(() => { try { const userStr = localStorage.getItem(\'user\'); return userStr && userStr !== \'undefined\' ? JSON.parse(userStr) : {}; } catch { return {}; } })()');
  fs.writeFileSync(file, content);
}
