const token = canvas.tokens.controlled[0] || game.user.character?.getActiveTokens()[0];
if (!token) {
    ui.notifications.warn("You must have a token selected.");
    return;
}

const targetToken = Array.from(game.user.targets)[0];
if (!targetToken) {
    ui.notifications.warn("You must target a token.");
    return;
}

new Sequence()
    .effect()
    .atLocation(token)
    .file("jb2a.divine_smite.caster.standard")
    .waitUntilFinished()
    .effect()
    .file("jb2a.divine_smite.target")
    .atLocation(targetToken)
    .play();