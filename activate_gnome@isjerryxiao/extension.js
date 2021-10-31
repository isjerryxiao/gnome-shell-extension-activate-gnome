/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * /
/* exported init */
const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils
const Me = ExtensionUtils.getCurrentExtension()

class Extension {
    constructor() {
        this.label_1 = null
        this.label_2 = null
        this.loaded = 0
        this.settings = null
    }

    update() {
        if (this.label_1 && this.label_2) {
            let [text1, text2, vl2, hl2] = this.settings
            let monitor = Main.layoutManager.primaryMonitor
            let h = Math.floor(monitor.height * vl2 - this.label_2.height)
            let w = Math.floor(monitor.width * hl2 - this.label_2.width)
            this.label_2.set_position(w, h)
            this.label_1.set_position(w, h - this.label_1.height)
            if (this.loaded++ < 4) Mainloop.timeout_add(1000, () => this.update())
        }
    }
    enable() {
        let settings = ExtensionUtils.getSettings(Me.metadata['settings-schema'])
        let text1 = settings.get_string('text-l1') || settings.get_default().get_string('text-l1')
        let text2 = settings.get_string('text-l2') || settings.get_default().get_string('text-l2')
        let vl2 = settings.get_double('l2-vertical') || settings.get_default().get_double('l2-vertical')
        let hl2 = settings.get_double('l2-horizontal') || settings.get_default().get_double('l2-horizontal')
        this.settings = [text1, text2, vl2, hl2]
        this.label_2 = new St.Label({ style_class: 'label-2', text: text2 })
        this.label_1 = new St.Label({ style_class: 'label-1', text: text1 })
        Main.layoutManager.addTopChrome(this.label_2, {"trackFullscreen": false})
        Main.layoutManager.addTopChrome(this.label_1, {"trackFullscreen": false})
        this.update()
    }

    disable() {
        Main.layoutManager.removeChrome(this.label_1)
        Main.layoutManager.removeChrome(this.label_2)
        this.label_1.destroy()
        this.label_2.destroy()
        this.label_1 = null
        this.label_2 = null
        this.settings = null
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`);
    return new Extension()
}
