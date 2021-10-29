/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const St = imports.gi.St;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils
const Me = ExtensionUtils.getCurrentExtension()

class Extension {
    constructor() {
        this.label_1 = null
        this.label_2 = null
    }

    enable() {
        let text1 = "Activate Gnome";
        let text2 = "Go to Settings to activate Gnome."
        this.label_1 = new St.Label({ style_class: 'label-1', text: text1 })
        this.label_2 = new St.Label({ style_class: 'label-2', text: text2 })
        let monitor = Main.layoutManager.primaryMonitor
        Main.layoutManager.addTopChrome(this.label_2, {"trackFullscreen": false})
        let h = Math.floor(monitor.height / 18 * 17 - this.label_2.height)
        let w = Math.floor(monitor.width / 10 * 9 - this.label_2.width)
        this.label_2.set_position(w, h)
        Main.layoutManager.addTopChrome(this.label_1, {"trackFullscreen": false})
        this.label_1.set_position(w, h - this.label_1.height)
    }

    disable() {
        Main.layoutManager.removeChrome(this.label_1)
        Main.layoutManager.removeChrome(this.label_2)
        this.label_1.destroy()
        this.label_2.destroy()
        this.label_1 = null
        this.label_2 = null
    }
}

function init() {
    return new Extension()
}
