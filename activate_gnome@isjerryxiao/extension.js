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
const St = imports.gi.St
const Main = imports.ui.main
const Mainloop = imports.mainloop
const ExtensionUtils = imports.misc.extensionUtils
const Me = ExtensionUtils.getCurrentExtension()

class Extension {
    constructor() {
        this.labels = []
        this.settings = null
        this.handlers = []
    }

    update() {
        let settings = this.settings
        let text1 = settings.get_string('text-l1') || settings.get_default_value('text-l1').get_string()
        let text2 = settings.get_string('text-l2') || settings.get_default_value('text-l2').get_string()
        let vl2 = settings.get_double('l2-vertical') || settings.get_default_value('l2-vertical').get_double()
        let hl2 = settings.get_double('l2-horizontal') || settings.get_default_value('l2-horizontal').get_double()
        let opacity = settings.get_double('opacity') || settings.get_default_value('opacity').get_double()

        this.cleanup()
        for (let monitor of Main.layoutManager.monitors) {
            let label_1 = new St.Label({style_class: 'label-1', text: text1, opacity})
            let label_2 = new St.Label({style_class: 'label-2', text: text2, opacity})
            Main.layoutManager.addTopChrome(label_2, {"trackFullscreen": false})
            Main.layoutManager.addTopChrome(label_1, {"trackFullscreen": false})
            this.labels.push(label_1)
            this.labels.push(label_2)
            let h = Math.max(0, Math.floor(monitor.height * vl2 - label_2.height))
            let w = Math.max(0, Math.floor(monitor.width * hl2 - label_2.width))
            label_2.set_position(monitor.x + w, monitor.y + h)
            label_1.set_position(Math.min(monitor.x + w, monitor.x + monitor.width - label_1.width), monitor.y + h - label_1.height)
        }
    }

    cleanup() {
        for (let label of this.labels) {
            Main.layoutManager.removeChrome(label)
            label.destroy()
        }
        this.labels = []
    }

    enable() {
        this.settings = ExtensionUtils.getSettings(Me.metadata['settings-schema'])
        this.handlers.push({
            owner: this.settings,
            id: this.settings.connect('changed', () => this.update())
        })
        this.handlers.push({
            owner: Main.layoutManager,
            id: Main.layoutManager.connect('monitors-changed', () => this.update())
        })
        this.handlers.push({
            owner: Main.layoutManager,
            id: Main.layoutManager.connect('startup-complete', () => this.update())
        })
        this.update()
    }

    disable() {
        this.cleanup()
        for (let handler of this.handlers) {
            handler.owner.disconnect(handler.id)
        }
        this.handlers = []
        this.settings = null
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`)
    return new Extension()
}
