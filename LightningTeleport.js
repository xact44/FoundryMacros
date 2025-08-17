let position = await Sequencer.Crosshair.show({
    size: 1,
    gridHighlight: false,
    label: {
        text: "Teleport to",
    }
}, { show: async (crosshair) => {

    new Sequence()
        .effect()
            .from(token)
            .attachTo(crosshair)
            .persist()
            .opacity(0.5)
        .play();

}})

if(!position){
    return;
}

new Sequence()
    .effect()
        .from(token)
        .fadeIn(50)
        .duration(550)
        .fadeOut(250)
        .filter("Blur")
        .elevation(0)
    .effect()
        .file("jb2a.chain_lightning.secondary.blue")
        .atLocation(token)
        .stretchTo(position)
        .elevation(0)
    .wait(100)
    .animation()
        .on(token)
        .teleportTo(position)
        .snapToGrid()
        .waitUntilFinished()
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(token)
        .scaleToObject()
    .play();