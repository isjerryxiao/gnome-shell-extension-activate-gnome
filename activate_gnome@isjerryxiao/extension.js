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
        this.loaded = 0
        this.settings = null
        this.handler_id = null
    }

    update() {
        let settings = this.settings
        let text1 = settings.get_string('text-l1') || settings.get_default_value('text-l1').get_string()
        let text2 = settings.get_string('text-l2') || settings.get_default_value('text-l2').get_string()
        let vl2 = settings.get_double('l2-vertical') || settings.get_default_value('l2-vertical').get_double()
        let hl2 = settings.get_double('l2-horizontal') || settings.get_default_value('l2-horizontal').get_double()

        this.cleanup()
        for (let monitor of Main.layoutManager.monitors) {
            let label_1 = new St.Label({ style_class: 'label-1', text: '' })
            let label_2 = new St.Label({ style_class: 'label-2', text: '' })
            Main.layoutManager.addTopChrome(label_2, {"trackFullscreen": false})
            Main.layoutManager.addTopChrome(label_1, {"trackFullscreen": false})
            this.labels.push(label_1)
            this.labels.push(label_2)
            label_1.text = text1
            label_2.text = text2
            let h = Math.max(0, Math.floor(monitor.height * vl2 - label_2.height))
            let w = Math.max(0, Math.floor(monitor.width * hl2 - label_2.width))
            label_2.set_position(monitor.x + w, monitor.y + h)
            label_1.set_position(monitor.x + w, monitor.y + h - label_1.height)
            if (this.loaded < 4) {
                this.loaded++
                Mainloop.timeout_add(1000, () => this.update())
            }
        }
    }

    enable() {
        this.settings = ExtensionUtils.getSettings(Me.metadata['settings-schema'])
        this.handler_id = this.settings.connect('changed', () => this.update())
        this.update()
    }

    cleanup() {
        for (let label of this.labels) {
            Main.layoutManager.removeChrome(label)
            label.destroy()
        }
        this.labels = []
    }

    disable() {
        this.cleanup()
        this.settings.disconnect(this.handler_id)
        this.settings = null
        this.handler_id = null
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`)
    return new Extension()
}
