const SILVER_PER_MERGE = 2;
const maxTier = 10;
const starsPerTier = 3;
const runeList = [];

// Generate Data
let power = 0;
for (let t = 1; t <= maxTier; t++) {
    for (let s = 1; s <= starsPerTier; s++) {
        runeList.push({ name: `T${t}-${s}★`, val: BigInt(2 ** power), tier: t });
        power++;
    }
}

const goalSelect = document.getElementById('goalRune');
const goalContainer = document.getElementById('goalInventoryContainer');
const invContainer = document.getElementById('invInventoryContainer');

// Build Dropdown
runeList.forEach((rune, i) => {
    const opt = document.createElement('option');
    opt.value = rune.val.toString();
    opt.textContent = rune.name;
    if (i === runeList.length - 1) opt.selected = true;
    goalSelect.appendChild(opt);
});

let currentTab = 'goal';

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

function getCurrentStoragePrefix() {
    return currentTab === 'goal' ? 'goal-' : 'inv-';
}

function onInputChange() {
    if (currentTab === 'goal') {
        calculateGoal();
    } else {
        calculateTotal();
    }
}

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

function switchTab(tab) {
    currentTab = tab;
    const goalPanel = document.getElementById('goalTabPanel');
    const invPanel = document.getElementById('inventoryTabPanel');
    const goalBtn = document.getElementById('tabGoalBtn');
    const invBtn = document.getElementById('tabInvBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (tab === 'goal') {
        goalPanel.classList.remove('hidden', 'panel-hidden');
        invPanel.classList.add('hidden', 'panel-hidden');
        goalBtn.className = 'tab-btn tab-btn-active';
        invBtn.className = 'tab-btn tab-btn-inactive';
        resetBtn.textContent = 'Reset Goal Tab';
        calculateGoal();
    } else {
        invPanel.classList.remove('hidden', 'panel-hidden');
        goalPanel.classList.add('hidden', 'panel-hidden');
        invBtn.className = 'tab-btn tab-btn-active';
        goalBtn.className = 'tab-btn tab-btn-inactive';
        resetBtn.textContent = 'Reset Inventory Tab';
        calculateTotal();
    }
}

function resetCurrentTab() {
    if (!confirm(`Clear all ${currentTab === 'goal' ? 'Goal' : 'Inventory'} data?`)) return;
    const prefix = getCurrentStoragePrefix();

    document.querySelectorAll(`#${currentTab === 'goal' ? 'goalTabPanel' : 'inventoryTabPanel'} .inv-input`).forEach(i => {
        i.value = 0;
    });

    runeList.forEach(rune => {
        localStorage.removeItem(prefix + rune.name);
    });

    if (currentTab === 'goal') calculateGoal();
    else calculateTotal();
}

// Initial build
buildInventoryRows(goalContainer, 'goal-');
buildInventoryRows(invContainer, 'inv-');
calculateGoal();