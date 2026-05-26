const SILVER_PER_MERGE = 2;
const maxTier = 10;
const starsPerTier = 3;
const runeList = [];

// Generate Data
let power = 0;
for (let t = 1; t <= maxTier; t++) {
    for (let s = 1; s <= starsPerTier; s++) {
        runeList.push({ name: `T${t}-${s}★`, val: BigInt(2 ** power), tier: t, star: s });
        power++;
    }
}

// ====== RUNE DICTIONARY ======
const runeDictionary = [
    { category: 'Gathering', school: 'Woodcutting', runes: [
        'Woodcutting Rune of XP',
        'Woodcutting Rune of Duplication',
        'Woodcutting Rune of Auto-Refine',
    ] },
    { category: 'Gathering', school: 'Mining', runes: [
        'Mining Rune of XP',
        'Mining Rune of Duplication',
        'Mining Rune of Auto-Refine',
    ] },
    { category: 'Gathering', school: 'Skinning', runes: [
        'Skinning Rune of XP',
        'Skinning Rune of Duplication',
        'Skinning Rune of Auto-Refine',
    ] },
    { category: 'Gathering', school: 'Fiber', runes: [
        'Fiber Rune of XP',
        'Fiber Rune of Duplication',
        'Fiber Rune of Auto-Refine',
    ] },
    { category: 'Gathering', school: 'Herbalism', runes: [
        'Herbalism Rune of XP',
        'Herbalism Rune of Duplication',
        'Herbalism Rune of Auto-Refine',
    ] },
    { category: 'Gathering', school: 'Fishing', runes: [
        'Fishing Rune of XP',
        'Fishing Rune of Duplication',
        'Fishing Rune of Auto-Refine',
    ] },
    { category: 'Refining', school: 'Bars / Metal', runes: [
        'Metal Rune of XP',
        'Metal Rune of Duplication',
        'Metal Rune of Efficiency',
    ] },
    { category: 'Refining', school: 'Planks', runes: [
        'Plank Rune of XP',
        'Plank Rune of Duplication',
        'Plank Rune of Efficiency',
    ] },
    { category: 'Refining', school: 'Leather', runes: [
        'Leather Rune of XP',
        'Leather Rune of Duplication',
        'Leather Rune of Efficiency',
    ] },
    { category: 'Refining', school: 'Cloth', runes: [
        'Cloth Rune of XP',
        'Cloth Rune of Duplication',
        'Cloth Rune of Efficiency',
    ] },
    { category: 'Refining', school: 'Extracts', runes: [
        'Extract Rune of XP',
        'Extract Rune of Duplication',
        'Extract Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Warrior', runes: [
        'Warrior Rune of XP',
        'Warrior Rune of Duplication',
        'Warrior Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Hunter', runes: [
        'Hunter Rune of XP',
        'Hunter Rune of Duplication',
        'Hunter Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Mage', runes: [
        'Mage Rune of XP',
        'Mage Rune of Duplication',
        'Mage Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Tools', runes: [
        'Tools Rune of XP',
        'Tools Rune of Duplication',
        'Tools Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Cooking', runes: [
        'Cooking Rune of XP',
        'Cooking Rune of Duplication',
        'Cooking Rune of Efficiency',
    ] },
    { category: 'Crafting', school: 'Alchemy', runes: [
        'Alchemy Rune of XP',
        'Alchemy Rune of Duplication',
        'Alchemy Rune of Efficiency',
    ] },
    { category: 'Combat', school: 'Attack', runes: [
        'Combat Rune of Damage',
        'Combat Rune of Speed',
        'Combat Rune of Crit DMG',
    ] },
];

// ====== DOM REFS ======
const goalSelect = document.getElementById('goalRune');
const goalContainer = document.getElementById('goalInventoryContainer');
const invContainer = document.getElementById('invInventoryContainer');
const solverContainer = document.getElementById('solverInventoryContainer');
const refContainer = document.getElementById('runeReferenceContainer');

// Build Dropdown
runeList.forEach((rune, i) => {
    const opt = document.createElement('option');
    opt.value = rune.val.toString();
    opt.textContent = rune.name;
    if (i === runeList.length - 1) opt.selected = true;
    goalSelect.appendChild(opt);
});

let currentTab = 'goal';

// ====== BUILD INVENTORY ROWS ======
function buildInventoryRows(container, storagePrefix) {
    container.innerHTML = '';

    for (let t = 1; t <= maxTier; t++) {
        const row = document.createElement('div');
        row.className = 'tier-row';

        const label = document.createElement('div');
        label.className = 'tier-label';
        label.textContent = `Tier ${t}`;
        row.appendChild(label);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'grid grid-cols-3 gap-4 flex-grow';

        runeList.filter(r => r.tier === t).forEach(rune => {
            const key = storagePrefix + rune.name;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <label class="text-[9px] text-slate-500 font-bold ml-1">${rune.name}</label>
                <input type="number" min="0" value="${localStorage.getItem(key) || 0}" 
                       class="bw-input inv-input w-full p-2 rounded-lg text-xs" 
                       data-key="${key}" data-val="${rune.val}" oninput="onInputChange()">
            `;
            inputGroup.appendChild(wrapper);
        });

        row.appendChild(inputGroup);
        container.appendChild(row);
    }
}

// ====== BUILD RUNE REFERENCE TABLE ======
function buildRuneReference() {
    let html = '<table class="ref-table"><tr><th>Category</th><th>School</th><th>Rune Type</th></tr>';
    runeDictionary.forEach(entry => {
        entry.runes.forEach((runeName, i) => {
            html += '<tr>';
            if (i === 0) {
                html += `<td class="ref-category" rowspan="${entry.runes.length}">${entry.category}</td>`;
            }
            if (i === 0) {
                html += `<td class="ref-school" rowspan="${entry.runes.length}">${entry.school}</td>`;
            }
            html += `<td class="ref-rune">${runeName}</td>`;
            html += '</tr>';
        });
    });
    html += '</table>';
    refContainer.innerHTML = html;
}

// ====== HELPERS ======
function getCurrentStoragePrefix() {
    if (currentTab === 'goal') return 'goal-';
    if (currentTab === 'inventory') return 'inv-';
    return 'solver-';
}

function onInputChange() {
    if (currentTab === 'goal') calculateGoal();
    else if (currentTab === 'inventory') calculateTotal();
    else calculateSolver();
}

// ====== GOAL CALCULATOR ======
function calculateGoal() {
    const goalVal = BigInt(goalSelect.value);
    let currentVal = BigInt(0);

    document.querySelectorAll('#goalTabPanel .inv-input').forEach(input => {
        const count = BigInt(input.value) || BigInt(0);
        const val = BigInt(input.dataset.val);
        currentVal += (count * val);
        localStorage.setItem(input.dataset.key, input.value);
    });

    const needed = goalVal > currentVal ? goalVal - currentVal : BigInt(0);
    const silver = needed > BigInt(0) ? (needed - BigInt(1)) * BigInt(SILVER_PER_MERGE) : BigInt(0);

    document.getElementById('neededT1').textContent = needed.toLocaleString();
    document.getElementById('silverCost').textContent = silver.toLocaleString();

    const percent = Number((currentVal * BigInt(10000)) / goalVal) / 100;
    document.getElementById('progressBar').style.width = Math.min(100, percent) + '%';
    document.getElementById('progressText').textContent = percent.toFixed(2) + '% Complete';
}

// ====== INVENTORY TOTAL ======
function calculateTotal() {
    let totalVal = BigInt(0);

    document.querySelectorAll('#inventoryTabPanel .inv-input').forEach(input => {
        const count = BigInt(input.value) || BigInt(0);
        const val = BigInt(input.dataset.val);
        totalVal += (count * val);
        localStorage.setItem(input.dataset.key, input.value);
    });

    document.getElementById('invTotalValue').textContent = totalVal.toLocaleString();
}

// ====== MERGE SOLVER ======
function calculateSolver() {
    // Read counts from inputs (index 0 = T1-1★, 1 = T1-2★, ... 29 = T10-3★)
    const counts = [];
    let totalVal = BigInt(0);

    document.querySelectorAll('#solverTabPanel .inv-input').forEach(input => {
        const count = BigInt(input.value) || BigInt(0);
        const val = BigInt(input.dataset.val);
        counts.push(Number(count));
        totalVal += (count * val);
        localStorage.setItem(input.dataset.key, input.value);
    });

    // Merge simulation: carry from low to high
    const merged = [...counts];
    let silverSpent = BigInt(0);

    for (let i = 0; i < merged.length; i++) {
        if (merged[i] >= 2) {
            const pairs = Math.floor(merged[i] / 2);
            silverSpent += BigInt(pairs) * BigInt(SILVER_PER_MERGE);
            if (i + 1 < merged.length) {
                merged[i + 1] += pairs;
            }
            merged[i] = merged[i] % 2;
        }
    }

    // Find the highest rune with count > 0
    let bestRuneIdx = -1;
    for (let i = merged.length - 1; i >= 0; i--) {
        if (merged[i] > 0) {
            bestRuneIdx = i;
            break;
        }
    }

    // Display best craftable rune
    const bestRuneEl = document.getElementById('solverBestRune');
    if (bestRuneIdx >= 0 && bestRuneIdx < runeList.length) {
        bestRuneEl.textContent = `★ ${runeList[bestRuneIdx].name} ★`;
    } else {
        bestRuneEl.textContent = '—';
    }

    // Display leftovers
    const leftoversEl = document.getElementById('solverLeftovers');
    const leftoverItems = [];
    for (let i = 0; i < merged.length; i++) {
        if (merged[i] > 0) {
            leftoverItems.push(`${runeList[i].name} x${merged[i]}`);
        }
    }
    if (leftoverItems.length === 0) {
        leftoversEl.innerHTML = '<span class="shortfall-none">No leftovers — perfectly merged!</span>';
    } else {
        leftoversEl.innerHTML = leftoverItems.map(item => `<span class="leftover-tag">${item}</span>`).join(' ');
    }

    // Display silver spent
    document.getElementById('solverSilver').textContent = silverSpent.toLocaleString();

    // Shortfall alert: look at the next rune above best and compute delta
    const shortfallEl = document.getElementById('solverShortfall');
    if (bestRuneIdx >= runeList.length - 1) {
        shortfallEl.className = 'text-sm font-mono font-bold tracking-tight shortfall-none';
        shortfallEl.textContent = 'All runes craftable — you can max out!';
    } else if (bestRuneIdx >= 0) {
        const nextRune = runeList[bestRuneIdx + 1];
        const shortfallRunes = nextRune.val - totalVal;
        const shortfallSilver = shortfallRunes > BigInt(0)
            ? (shortfallRunes - BigInt(1)) * BigInt(SILVER_PER_MERGE) - silverSpent
            : BigInt(0);

        if (shortfallRunes > BigInt(0)) {
            const shortfallSilverDisplay = shortfallSilver > BigInt(0) ? shortfallSilver : BigInt(0);
            shortfallEl.className = 'text-sm font-mono font-bold tracking-tight shortfall-positive';
            shortfallEl.textContent = `You need ${shortfallRunes.toLocaleString()} T1 Common Runes and ${shortfallSilverDisplay.toLocaleString()} Silver to craft ${nextRune.name}.`;
        } else {
            shortfallEl.className = 'text-sm font-mono font-bold tracking-tight shortfall-none';
            shortfallEl.textContent = 'All runes craftable — you can max out!';
        }
    } else {
        shortfallEl.className = 'text-sm font-mono font-bold tracking-tight shortfall-positive';
        shortfallEl.textContent = 'Enter rune counts to see what you can craft.';
    }
}

// ====== TAB SWITCHING ======
function switchTab(tab) {
    currentTab = tab;
    const goalPanel = document.getElementById('goalTabPanel');
    const invPanel = document.getElementById('inventoryTabPanel');
    const solverPanel = document.getElementById('solverTabPanel');
    const goalBtn = document.getElementById('tabGoalBtn');
    const invBtn = document.getElementById('tabInvBtn');
    const solverBtn = document.getElementById('tabSolverBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Hide all panels
    [goalPanel, invPanel, solverPanel].forEach(p => {
        p.classList.add('hidden', 'panel-hidden');
    });
    // Reset all buttons
    [goalBtn, invBtn, solverBtn].forEach(b => {
        b.className = 'tab-btn tab-btn-inactive';
    });

    if (tab === 'goal') {
        goalPanel.classList.remove('hidden', 'panel-hidden');
        goalBtn.className = 'tab-btn tab-btn-active';
        resetBtn.textContent = 'Reset Goal Tab';
        calculateGoal();
    } else if (tab === 'inventory') {
        invPanel.classList.remove('hidden', 'panel-hidden');
        invBtn.className = 'tab-btn tab-btn-active';
        resetBtn.textContent = 'Reset Inventory Tab';
        calculateTotal();
    } else {
        solverPanel.classList.remove('hidden', 'panel-hidden');
        solverBtn.className = 'tab-btn tab-btn-active';
        resetBtn.textContent = 'Reset Solver Tab';
        calculateSolver();
    }
}

// ====== RESET ======
function resetCurrentTab() {
    const tabLabel = currentTab === 'goal' ? 'Goal' : currentTab === 'inventory' ? 'Inventory' : 'Solver';
    if (!confirm(`Clear all ${tabLabel} data?`)) return;
    const prefix = getCurrentStoragePrefix();

    document.querySelectorAll(`#${currentTab === 'goal' ? 'goalTabPanel' : currentTab === 'inventory' ? 'inventoryTabPanel' : 'solverTabPanel'} .inv-input`).forEach(i => {
        i.value = 0;
    });

    runeList.forEach(rune => {
        localStorage.removeItem(prefix + rune.name);
    });

    if (currentTab === 'goal') calculateGoal();
    else if (currentTab === 'inventory') calculateTotal();
    else calculateSolver();
}

// ====== INIT ======
buildInventoryRows(goalContainer, 'goal-');
buildInventoryRows(invContainer, 'inv-');
buildInventoryRows(solverContainer, 'solver-');
buildRuneReference();
calculateGoal();