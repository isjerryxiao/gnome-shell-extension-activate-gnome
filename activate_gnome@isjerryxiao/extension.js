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
 */

import St from 'gi://St'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'

export default class ActivateGnomeExtension extends Extension {
    constructor(metadata) {
        super(metadata)
        this.labels = []
        this.settings = null
        this.handlers = []
        this.settings_get = (method, key) => this.settings[method](key) || this.settings.get_default_value(key)[method]()
    }

    update() {
        let text1 = this.settings_get('get_string', 'text-l1')
        let text2 = this.settings_get('get_string', 'text-l2')
        let vl2 = this.settings_get('get_double', 'l2-vertical')
        let hl2 = this.settings_get('get_double', 'l2-horizontal')
        let size1 = parseInt(this.settings_get('get_double', 'size-l1'))
        let size2 = parseInt(this.settings_get('get_double', 'size-l2'))
        let opacity = this.settings_get('get_double', 'opacity')

        this.cleanup()
        for (let monitor of Main.layoutManager.monitors) {
            let label_1 = new St.Label({style_class: 'label-1', text: text1, opacity})
            let label_2 = new St.Label({style_class: 'label-2', text: text2, opacity})
            label_1.set_style(`font-size: ${size1}px`)
            label_2.set_style(`font-size: ${size2}px`)
            Main.layoutManager.uiGroup.add_actor(label_2, {"trackFullscreen": false})
            Main.layoutManager.uiGroup.add_actor(label_1, {"trackFullscreen": false})
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
            Main.layoutManager.uiGroup.remove_actor(label)
            label.destroy()
        }
        this.labels = []
    }

    enable() {
        this.settings = this.getSettings()
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
        if (!Main.layoutManager._startingUp) this.update()
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
