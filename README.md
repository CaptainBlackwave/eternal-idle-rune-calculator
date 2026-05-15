# Eternal Idle Rune Calculator

**👉 [Use it live here](https://captainblackwave.github.io/eternal-idle-rune-calculator/)**

A browser-based tool for Eternal Idle players to plan rune upgrades and track their collection. Everything runs in your browser — nothing to install.

---

## How to Use

### Goal Calculator (Tab 1)

Plan how many runes you need to reach a specific target.

1. **Pick a target** — select the rune you want to craft from the dropdown
2. **Enter your stockpile** — fill in how many of each rune you currently have
3. **Read the results** — the calculator shows:
   - **Progress bar** — how close you are to your goal
   - **Runes to Acquire** — total T1 Common runes you still need
   - **Silver Required** — estimated silver cost to merge everything

### Inventory Total (Tab 2)

See what your entire rune collection is worth in one number.

1. **Enter your runes** — fill in every rune you own
2. **Read the total** — your collection's value expressed as **T1 Common Equivalent**

Every value saves automatically — close the page and come back later, your numbers will still be there.

---

## How Rune Values Work

Each rune is worth a specific number of T1 Common runes, doubling with every star:

| Rune | T1 Common Value |
|------|----------------|
| T1-1★ | 1 |
| T1-2★ | 2 |
| T1-3★ | 4 |
| T2-1★ | 8 |
| T2-2★ | 16 |
| ... | ... |
| T10-3★ | 2^29 |

The calculator uses `BigInt` to handle these numbers without losing precision.

---

## Need Help?

- **Reset This Tab** — clears the currently active tab's data only
- **Reset All Data** — use your browser's Clear Site Data to wipe everything

---

*Created for the Eternal Idle community. Not affiliated with the game developers.*