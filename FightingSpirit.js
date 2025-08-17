// Get the active player's token (make sure they are selected)
const token = canvas.tokens.controlled[0] || game.user.character?.getActiveTokens()[0];

if (!token) {
    ui.notifications.warn("No token selected or linked to your user!");
    return;
}

// Set video position at the player's token location
const videoPosition = {
  x: token.x + (token.w / 2),  // Center on token
  y: token.y + (token.h / 2)   // Center on token
};

const data = {
  file: "https://xact44.github.io/webmRepo/fighting%20spirit.webm",
  position: videoPosition,
  anchor: {
   x: 0.5,
   y: 0.5
  },
  angle: 0,
  scale: {
    x: .6,
    y: .6
  }
}
canvas.specials.playVideo(data);
game.socket.emit('module.fxmaster', data);

dnd5e.documents.macro.rollItem("Fighting Spirit", { event });