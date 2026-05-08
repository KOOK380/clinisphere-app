const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

if (!content.includes('confirmDialog')) {
  content = content.replace(
    'const [selectedCourses, setSelectedCourses] = useState<number[]>([]);',
    'const [selectedCourses, setSelectedCourses] = useState<number[]>([]);\n  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);'
  );
}

const replacements = [
  {
    regex: /const handleDeleteCourse = async \(id: number\) => {\s+if \(!window\.confirm\(t\("admin\.common\.deleteConfirm"\)\)\) return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleDeleteCourse = async (id: number) => {
    setConfirmDialog({
      message: t("admin.common.deleteConfirm"),
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  },
  {
    regex: /const handleBulkDeleteCourses = async \(\) => {\s+if \(selectedCourses.length === 0\) return;\s+if \(!window\.confirm\(`Voulez-vous vraiment supprimer \$\{selectedCourses\.length\} cours \?`\)\) return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleBulkDeleteCourses = async () => {
    if (selectedCourses.length === 0) return;
    setConfirmDialog({
      message: \`Voulez-vous vraiment supprimer \$\{selectedCourses.length\} cours ?\`,
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  },
  {
    regex: /const handleDeleteInstructor = async \(id: number\) => {\s+if \(!window\.confirm\(t\("admin\.common\.deleteInstructorConfirm"\)\)\) return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleDeleteInstructor = async (id: number) => {
    setConfirmDialog({
      message: t("admin.common.deleteInstructorConfirm"),
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  },
  {
    regex: /const handleDeleteAnnouncement = async \(id: number\) => {\s+if \(!window\.confirm\("Are you sure you want to delete this notification\?"\)\) return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleDeleteAnnouncement = async (id: number) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this notification?",
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  },
  {
    regex: /const handleDeleteArticle = async \(id: number\) => {\s+if \(!window\.confirm\(t\('admin\.articles\.deleteConfirm'\)\)\)\s+return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleDeleteArticle = async (id: number) => {
    setConfirmDialog({
      message: t('admin.articles.deleteConfirm'),
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  },
  {
    regex: /const handleDeleteEvent = async \(id: number\) => {\s+if \(!window\.confirm\(t\('admin\.events\.deleteConfirm'\)\)\)\s+return;\s+try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s+};/g,
    repl: `const handleDeleteEvent = async (id: number) => {
    setConfirmDialog({
      message: t('admin.events.deleteConfirm'),
      onConfirm: async () => {
        try {$1} catch (error) {$2}
      }
    });
  };`
  }
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.repl);
});

// Now inject the UI at the end. We need to find the final `</div>` or `</Layout>` equivalent.
// Actually, I can just inject it right before the last closing `</div>\n    </div>\n  );`
if (!content.includes('confirmDialog &&')) {
  const dialogHtml = `
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t("admin.common.confirm") || "Confirmation"}</h3>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                {t("admin.common.cancel") || "Annuler"}
              </button>
              <button 
                onClick={async () => {
                  if (confirmDialog.onConfirm) {
                    await confirmDialog.onConfirm();
                  }
                  setConfirmDialog(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {t("admin.common.delete") || "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
  `;
  content = content.replace(/(\s*)(<\/AdminLayout>\s*)$/, \`$1  \${dialogHtml}$1$2\`);
}

fs.writeFileSync('src/pages/Admin.tsx', content, 'utf-8');
console.log("Done");
