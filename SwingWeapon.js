const user = game.user; //get the users info

function getSceneCenter(token) {
  const { x, y, width, height } = token.document;
  const size = canvas.grid.size;
  return {
    x: x + (width * size) / 2,
    y: y + (height * size) / 2
  };
}

//build a function that actually does stuff after the target is determined and set
const doStuffToTarget = (token) => {
  const actor = token.actor;
  const targetAC = actor.system.attributes.ac.value;
  //set up as nullable, not sure if that's really necessary, combat tokens will always be set up properly
  const targetRace = actor.system.details?.type?.value ?? "Unknown";

  //set up some variables to edit later
  let attackRoll = 0;
  let attackDmgDiceRoll = "";

  //log vars for debugging
  console.log("AC:", targetAC);
  console.log("Race Type:", targetRace);
  
  //find all the attacker tokens as relates to target
  const attackers = canvas.tokens.placeables.filter(t => {
    if (t === token) return false;
    if (t.document.disposition === token.document.disposition) return false;

    try {
      const path = canvas.grid.measurePath([
        getSceneCenter(t),
        getSceneCenter(token)
      ], { gridSpaces: true });

      return path.distance <= 5;
    } catch (err) {
      console.error("Path measurement failed:", err);
      return false;
    }
  });

  let potentialFlank = false;
  //loop through arrays of attacker tokens, measure positioning, set potentialFlank true if conditions met and exit loop
  for(let i = 0; i < attackers.length; i++) {
    for(let j = i + 1; j < attackers.length; j++) {
      const a1 = attackers[i].center;
      const a2 = attackers[j].center;
      const targetCenter = token.center;

      const dotProduct = (a1.x - targetCenter.x) * (a2.x - targetCenter.x) +
                         (a1.y - targetCenter.y) * (a2.y - targetCenter.y);
      if(dotProduct < -10000) {
        potentialFlank = true;
        break;
      }
    }
    if(potentialFlank) break;
  }

  //if target is potentially flanked create a dialogue box to ask user if flankers have attacked, if yes target is flanked and attack roll gets a +2
  if(!potentialFlank){
    console.log("Not flanked based on position.");
  } else {
   new Dialog({
     title: "Confirm Flank",
     content: `<p>Enemies in flanked position.</p><p>Has target been attacked by both enemies?</p>`,
     buttons: {
       yes: {
         label: "Yes",
         callback: () => {
           console.log("Flanked!");
           attackRoll += 2;
           console.log(attackRoll);
         }
       },
       no: {
         label: "No",
         callback: () => {
           console.log("Target not flanked.")
         }
       }
     }
   }).render(true); 
  };

  //get the users actual token
  const userTokenInit = canvas.tokens.controlled[0] || game.user?.character?.getActiveTokens()[0];
  const userToken = userTokenInit.actor;

  //get the users equipped weapons, if more than one, create dialoge for user to select which to roll with
  const weaponsEquipped = userToken.items.filter(i => i.type === "weapon" && i.system.equipped);
  if(weaponsEquipped.length === 0){
    return ui.notification.warn("No equipped weapons found.");
  }
  console.log(weaponsEquipped);
  
  let buttons = {};
  for(let weapon of weaponsEquipped){
    buttons[weapon.id] = {
      label: weapon.name,
      callback: async () => {
        const attackBonus = weapon.labels.toHit || "0";
      }
    };
  }
  
  let options = "";
  for(let weapon of weaponsEquipped){
    options += `<option value ="${weapon.id}">${weapon.name}</option>`
  }
  
  
  if(weaponsEquipped.length > 1) {
    
    new Dialog({
    title: "Choose a Weapon",
    content: `
      <form>
        <div class="form-group">
          <label>Equipped Weapon:</label>
          <select name="weapon">${options}</select>
        </div>
      </form>
    `,
    buttons: {
      ok: {
        label: "Attack!",
        callback: async (html) => {
          const weaponId = html.find('[name="weapon"]').val();
          const weapon = userToken.items.get(weaponId);
          
          const attackBonus = weapon.labels.toHit || "0";
          console.log(attackBonus);
          console.log(weapon.name);
        }
      },
      cancel: {
      label: "Cancel"
      }
    }
  }).render(true);
    
  } else {
    
  }
  
  //flanked status determined, do more stuff after this
  // 
  //
  //TODO
  // 1 - check if target race = human. Add dmg dice - 2d6
  // 2 - 
  // 3 - 
  //

 //const roll = new Roll("1d20 + 5 + 2d6").roll({async: true});

 //roll.toMessage({
  //flavor: "Test Roll From a Macro!",
  //speaker: ChatMessage.getSpeaker(),
  //rollMode: game.settings.get("core", "rollMode")
  //});
  
};

//actual start of the macro
if(user.targets.size === 0) {
  ui.notifications.info("Please select a target...");

  //activate the token layer
  canvas.tokens.activate();

  //add one-time click listener on the canvas
  const onClick = async (event) => {
    //get click coordinates
    const { x, y } = event.data.getLocalPosition(canvas.tokens);

    //find the closest token to that point (within a reasonable distance)
    const tokens = canvas.tokens.placeables;
    let closestToken = null;
    let minDistance = Infinity;

    for (const token of tokens) {
      const dx = token.x + token.w / 2 - x;
      const dy = token.y + token.h / 2 - y;
      const dist = Math.hypot(dx, dy);

      if (dist < minDistance && dist < 100) {
        minDistance = dist;
        closestToken = token;
      }
    }

    if (closestToken) {
      console.log("Clicked near token:", closestToken.name, closestToken.id);

      await closestToken.setTarget(true, { releaseOthers: true });
      doStuffToTarget(closestToken); //big function that does stuff
    } else {
      ui.notifications.warn("No nearby token found.");
    }

    canvas.stage.off("pointerdown", onClick);
  };

  canvas.stage.on("pointerdown", onClick);
}