# 🎲 Foundry VTT Macros

A collection of custom JavaScript macros for [Foundry Virtual Tabletop (VTT)](https://foundryvtt.com/).  
These macros are designed to do all kinds of wacky interesting things like play a sound, animation, or automate tasks.
Some macros may rely on certain modules being present.

---

## 🚀 Getting Started

### 1. Install
1. Open the file in GitHub to check out the code.
2. Go to the **Macro Directory** (`Hotbar > Create Macro`) in Foundry VTT.
3. Copy the contents of any `.js` file from this repo.
4. Paste into the **Foundry Macro Editor**.

### 2. Assign
- Drag the macro onto your hotbar for quick access.
- Or keep them in the **Macro Directory** for modular use.

### 3. Customize
- Macros should have helpful comments!
- Adjust variables (e.g., target names, roll formulas, DCs) to fit your system or house rules.

---

## 🧰 Example Usage

```js
// Example: Roll initiative for all selected tokens
for (let token of canvas.tokens.controlled) {
  await token.actor.rollInitiative({createCombatants: true});
}
