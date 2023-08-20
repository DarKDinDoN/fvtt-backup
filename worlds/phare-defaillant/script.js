// Add hightlight button
Hooks.on("getProseMirrorMenuItems", (editor, items) => {
    items.unshift({
        action: "toggleMark",
        title: "Highlight",
        icon: '<i class="fa-solid fa-highlighter-line"></i>',
        scope: ProseMirror.ProseMirrorMenu._MENU_ITEM_SCOPES.TEXT,
        cmd: ProseMirror.commands.toggleMark(ProseMirror.defaultSchema.marks.mark)
    });
});

Hooks.once("ready", () => { 
    // No pause
    if (game.users.current.isGM) {
        if (game.paused) game.togglePause(false, true);
    }
});
