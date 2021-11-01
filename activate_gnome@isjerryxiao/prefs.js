const Gio = imports.gi.Gio
const Gtk = imports.gi.Gtk

const ExtensionUtils = imports.misc.extensionUtils
const Me = ExtensionUtils.getCurrentExtension()

function init() {
}

function buildPrefsWidget() {
    this.settings = ExtensionUtils.getSettings(Me.metadata['settings-schema'])

    let prefsWidget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        halign: Gtk.Align.CENTER,
        spacing: 6,
        margin_top: 12,
        margin_bottom: 12,
        margin_start: 6,
        margin_end: 6,
    })

    // line 1
    let l1label = new Gtk.Label({
        label: '<b>Line 1</b>',
        margin_top: 6,
        use_markup: true,
    })
    prefsWidget.append(l1label)

    let l1entry = new Gtk.Entry({
        margin_top: 6,
        hexpand: true,
    })
    l1entry.set_width_chars(30)
    prefsWidget.append(l1entry)

    // line 2
    let l2label = new Gtk.Label({
        label: '<b>Line 2</b>',
        margin_top: 6,
        use_markup: true,
    })
    prefsWidget.append(l2label)

    let l2entry = new Gtk.Entry({
        margin_top: 6,
        hexpand: true,
    })
    l2entry.set_width_chars(30)
    prefsWidget.append(l2entry)

    // l2-vertical
    let vlabel = new Gtk.Label({
        label: '<b>Vertical Position</b>',
        margin_top: 12,
        use_markup: true,
    })
    prefsWidget.append(vlabel)

    let ventry = new Gtk.SpinButton({
        margin_top: 6,
        numeric: true,
        digits: 4,
    })
    ventry.set_range(0.0, 1.0)
    ventry.set_increments(0.01, 0.1)
    prefsWidget.append(ventry)

    // l2-horizontal
    let hlabel = new Gtk.Label({
        label: '<b>Horizontal Position</b>',
        margin_top: 6,
        use_markup: true,
    })
    prefsWidget.append(hlabel)

    let hentry = new Gtk.SpinButton({
        margin_top: 6,
        numeric: true,
        digits: 4,
    })
    hentry.set_range(0.0, 1.0)
    hentry.set_increments(0.01, 0.1)
    prefsWidget.append(hentry)

    let resetbtn = new Gtk.Button({
        label: 'reset',
        margin_top: 12,
    })
    resetbtn.connect('clicked', () => {
        this.settings.reset('text-l1')
        this.settings.reset('text-l2')
        this.settings.reset('l2-vertical')
        this.settings.reset('l2-horizontal')
    })
    prefsWidget.append(resetbtn)

    this.settings.bind('text-l1', l1entry, 'text', Gio.SettingsBindFlags.DEFAULT)
    this.settings.bind('text-l2', l2entry, 'text', Gio.SettingsBindFlags.DEFAULT)
    this.settings.bind('l2-vertical', ventry, 'value', Gio.SettingsBindFlags.DEFAULT)
    this.settings.bind('l2-horizontal', hentry, 'value', Gio.SettingsBindFlags.DEFAULT)

    return prefsWidget
}
