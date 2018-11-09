// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Gettext = imports.gettext.domain('activate_gnome');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {
    Convenience.initTranslations();
}

const ExamplePrefsWidget = GObject.registerClass(
class ExamplePrefsWidget extends Gtk.Grid {
    _init(params) {
        super._init(params);
        this.margin = 12;
        this.row_spacing = this.column_spacing = 6;
        this.set_orientation(Gtk.Orientation.VERTICAL);

        this.add(new Gtk.Label({ label: '<b>' + _("Line 1") + '</b>',
                                 use_markup: true,
                                 halign: Gtk.Align.START }));

        let entryl1 = new Gtk.Entry({ hexpand: true,
                                    margin_bottom: 12 });
        this.add(entryl1);

        this.add(new Gtk.Label({ label: '<b>' + _("Line 2") + '</b>',
                                 use_markup: true,
                                 halign: Gtk.Align.START }));

        let entryl2 = new Gtk.Entry({ hexpand: true,
                                    margin_bottom: 12 });
        this.add(entryl2);

        this._settings = Convenience.getSettings();
        this._settings.bind('text-l1', entryl1, 'text', Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind('text-l2', entryl2, 'text', Gio.SettingsBindFlags.DEFAULT);

        let primaryText = _("You can customize the words on your screen.");

        this.add(new Gtk.Label({ label: primaryText,
                                 wrap: true, xalign: 0 }));
    }
});

function buildPrefsWidget() {
    let widget = new ExamplePrefsWidget();
    widget.show_all();

    return widget;
}
