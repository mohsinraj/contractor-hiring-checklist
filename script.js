// Checklist data
const ITEMS = [
  // Architect
  { role: 'architect', question: 'Can you provide examples of similar projects you completed?', id: 'a1' },
  { role: 'architect', question: 'Are you licensed and insured? Can you provide documentation?', id: 'a2' },
  { role: 'architect', question: 'What is your estimated timeline for design and permitting?', id: 'a3' },
  { role: 'architect', question: 'How do you handle changes or fee adjustments during the project?', id: 'a4' },
  { role: 'architect', question: 'Can you provide references from past clients and their contact info?', id: 'a5' },

  // Plumber
  { role: 'plumber', question: 'Are you licensed, bonded and insured?', id: 'p1' },
  { role: 'plumber', question: 'Do you provide a written estimate and warranty for work?', id: 'p2' },
  { role: 'plumber', question: 'Who will perform the work — you or subcontractors?', id: 'p3' },
  { role: 'plumber', question: 'What brands and types of fixtures do you recommend?', id: 'p4' },
  { role: 'plumber', question: 'How do you handle emergency calls and response time?', id: 'p5' },

  // Roofer
  { role: 'roofer', question: 'What roofing materials do you recommend for my home?', id: 'r1' },
  { role: 'roofer', question: 'Do you carry liability and worker\'s compensation insurance?', id: 'r2' },
  { role: 'roofer', question: 'Can you provide a detailed written proposal with a scope?', id: 'r3' },
  { role: 'roofer', question: 'Will you remove old roofing and clean up debris?', id: 'r4' },
  { role: 'roofer', question: 'What warranties do you provide on materials and labor?', id: 'r5' },

  // Electrician
  { role: 'electrician', question: 'Are you licensed and insured for electrical work in my area?', id: 'e1' },
  { role: 'electrician', question: 'Can you provide a written estimate including materials and labor?', id: 'e2' },
  { role: 'electrician', question: 'How do you protect my property during work, and what clean-up is included?', id: 'e3' },
  { role: 'electrician', question: 'Do you offer a warranty or guarantee on your electrical work?', id: 'e4' },
  { role: 'electrician', question: 'Can you provide references or photos of past electrical projects?', id: 'e5' },
];

// DOM elements
const checklistEl = document.getElementById('checklist');
const roleFilter = document.getElementById('role-filter');
const selectAllBtn = document.getElementById('select-all');
const clearAllBtn = document.getElementById('clear-all');
const downloadCsvAllBtn = document.getElementById('download-csv-all');
const downloadCsvSelectedBtn = document.getElementById('download-csv-selected');
const downloadTxtAllBtn = document.getElementById('download-txt-all');
const downloadTxtSelectedBtn = document.getElementById('download-txt-selected');
const resourceLink = document.getElementById('resource-link');

resourceLink.setAttribute('href', 'https://example.com/concrete-contractor');
resourceLink.setAttribute('target', '_blank');

// Utility: render list items
function renderList(filter = 'all') {
  checklistEl.innerHTML = '';
  const filtered = ITEMS.filter(item => filter === 'all' ? true : item.role === filter);
  filtered.forEach(item => {
    const li = document.createElement('li');
    li.className = 'check-item';
    li.innerHTML = `
      <input type="checkbox" id="${item.id}" data-role="${item.role}">
      <div class="check-meta">
        <div class="role">${item.role}</div>
        <div class="question">${item.question}</div>
      </div>
    `;
    checklistEl.appendChild(li);
  });
}

// Event listeners
roleFilter.addEventListener('change', (e)=> renderList(e.target.value));
selectAllBtn.addEventListener('click', ()=>{
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(cb => cb.checked = true);
});
clearAllBtn.addEventListener('click', ()=>{
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
});

// Prepare CSV/TXT content
function gatherItems(onlySelected = false) {
  const checkboxes = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]'));
  const rows = [];
  checkboxes.forEach(cb => {
    const id = cb.id;
    const role = cb.dataset.role;
    const question = ITEMS.find(i=>i.id === id).question;
    const checked = cb.checked ? 'Yes' : 'No';
    if (onlySelected && !cb.checked) return;
    rows.push({ role, question, checked });
  });
  return rows;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCSV(rows) {
  const header = ['Role','Question','Checked'];
  const escaped = rows.map(r => [
    `"${r.role}"`,
    `"${r.question.replace(/"/g, '""')}"`,
    `"${r.checked}"`
  ].join(','));
  return header.join(',') + '\n' + escaped.join('\n');
}


function toTXT(rows) {
  return rows.map(r => `[${r.role.toUpperCase()}] - ${r.question} - Checked: ${r.checked}`).join('\n');
}

// Downloads
downloadCsvAllBtn.addEventListener('click', ()=>{
  const rows = gatherItems(false);
  const csv = toCSV(rows);
  const name = 'contractor_checklist_all_' + new Date().toISOString().slice(0,10) + '.csv';
  downloadFile(name, csv, 'text/csv;charset=utf-8;');
});

downloadCsvSelectedBtn.addEventListener('click', ()=>{
  const rows = gatherItems(true);
  if (rows.length === 0) return alert('No items selected to export.');
  const csv = toCSV(rows);
  const name = 'contractor_checklist_selected_' + new Date().toISOString().slice(0,10) + '.csv';
  downloadFile(name, csv, 'text/csv;charset=utf-8;');
});

downloadTxtAllBtn.addEventListener('click', ()=>{
  const rows = gatherItems(false);
  const txt = toTXT(rows);
  const name = 'contractor_checklist_all_' + new Date().toISOString().slice(0,10) + '.txt';
  downloadFile(name, txt, 'text/plain;charset=utf-8;');
});

downloadTxtSelectedBtn.addEventListener('click', ()=>{
  const rows = gatherItems(true);
  if (rows.length === 0) return alert('No items selected to export.');
  const txt = toTXT(rows);
  const name = 'contractor_checklist_selected_' + new Date().toISOString().slice(0,10) + '.txt';
  downloadFile(name, txt, 'text/plain;charset=utf-8;');
});

// initial render
renderList('all');
