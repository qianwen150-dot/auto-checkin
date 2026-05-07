```javascript
import { getContext, extension_settings } from "../../../extensions.js";
import { sendMessageAsUser } from "../../../../script.js";

const EXTENSION_NAME = "auto-checkin";
const TRIGGER_MESSAGE = "[自动签到]";
const DEFAULT_INTERVAL = 30; // 分钟

let intervalId = null;

function getInterval() {
    return (extension_settings[EXTENSION_NAME]?.interval || DEFAULT_INTERVAL) * 60 * 1000;
}

function startTimer() {
    stopTimer();
    const ms = getInterval();
    const mins = ms / 60000;
    intervalId = setInterval(() => {
        const context = getContext();
        if (context.characterId !== undefined) {
            sendMessageAsUser(TRIGGER_MESSAGE);
            console.log(`[小克签到] 已触发，下次 ${mins} 分钟后`);
        }
    }, ms);
    console.log(`[小克签到] 定时器启动，每 ${mins} 分钟一次`);
}

function stopTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("[小克签到] 定时器已停止");
    }
}

jQuery(async () => {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = { interval: DEFAULT_INTERVAL, enabled: true };
    }

    const settingsHtml = `
    <div id="auto-checkin-settings" class="extension_settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>小克自动签到</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down"></div>
            </div>
            <div class="inline-drawer-content">
                <label>间隔（分钟）：
                    <input id="checkin_interval" type="number" min="1" value="${extension_settings[EXTENSION_NAME].interval}" style="width:60px"/>
                </label>
                <br/>
                <label>
                    <input id="checkin_enabled" type="checkbox" ${extension_settings[EXTENSION_NAME].enabled ? "checked" : ""}/>
                    启用
                </label>
            </div>
        </div>
    </div>`;

    $("#extensions_settings2").append(settingsHtml);

    $("#checkin_interval").on("change", function () {
        extension_settings[EXTENSION_NAME].interval = parseInt($(this).val()) || DEFAULT_INTERVAL;
        if (extension_settings[EXTENSION_NAME].enabled) startTimer();
    });

    $("#checkin_enabled").on("change", function () {
        extension_settings[EXTENSION_NAME].enabled = $(this).is(":checked");
        if (extension_settings[EXTENSION_NAME].enabled) {
            startTimer();
        } else {
            stopTimer();
        }
    });

    if (extension_settings[EXTENSION_NAME].enabled) {
        startTimer();
    }
});
```
