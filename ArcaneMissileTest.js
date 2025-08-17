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
    .stretchTo(targetToken)
    .file("jb2a.magic_missile") // Update to your actual asset path
    .repeats(3, 200, 300)
    .randomizeMirrorY()
  .play();