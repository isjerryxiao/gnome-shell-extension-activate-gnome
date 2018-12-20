// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
// Sample extension code, makes clicking on the panel show a message
const St = imports.gi.St;
const Mainloop = imports.mainloop;

const Gettext = imports.gettext.domain('activate_gnome');
const _ = Gettext.gettext;

const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;


function _show() {
    let settings = Convenience.getSettings();
    let text1 = settings.get_string('text-l1') || _("Activate Gnome");
    let text2 = settings.get_string('text-l2') || _("Go to Settings to activate Gnome.");
    label_1 = new St.Label({ style_class: 'label-1', text: text1 });
    label_2 = new St.Label({ style_class: 'label-2', text: text2 });
    let monitor = Main.layoutManager.primaryMonitor;
    var h = Math.floor(monitor.height / 18 * 17 - label_2.height);
    var w = Math.floor(monitor.width / 10 * 9 - label_2.width);
    global.stage.add_actor(label_2);
    label_2.set_position(w, h);
    global.stage.add_actor(label_1);
    label_1.set_position(w, h - label_1.height);
}

// Put your extension initialization code here
function init(metadata) {
    log ('Example extension initalized');
    Convenience.initTranslations();
}

function refresh() {
    // Don't know how to get rid of this
    disable();
    _show();
}

function enable() {
    log ('Example extension enabled');
    _show();
    Mainloop.timeout_add(3000, () => { refresh(); });
}

function disable() {
    log ('Example extension disabled');
    label_1.destroy();
    label_2.destroy();
}
