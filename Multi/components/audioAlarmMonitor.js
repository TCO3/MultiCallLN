Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://calendar/modules/calUtils.jsm");

function audioAlarmMonitor() {
     this.wrappedJSObject = this;
     this.mSound = Components.classes["@mozilla.org/sound;1"]
                             .createInstance(Components.interfaces.nsISound);
}
audioAlarmMonitor.prototype = {
    classID: Components.ID("{89d98ce9-ec1c-47e4-8b24-c7e678336df0}"),
    QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIObserver,
                                           Components.interfaces.calIAlarmServiceObserver]),

    // nsISound instance used for playing all sounds
    mSound: null,

    /**
     * nsIObserver
     */
    observe: function cAM_observe(aSubject, aTopic, aData) {
        let alarmService = Components.classes["@mozilla.org/calendar/alarm-service;1"]
                                     .getService(Components.interfaces.calIAlarmService);
        switch (aTopic) {
            case "alarm-service-startup":
                alarmService.addObserver(this);
                break;
            case "alarm-service-shutdown":
                alarmService.removeObserver(this);
                break;
        }
    },

    /**
     * calIAlarmServiceObserver
     */
    onAlarm: function cAM_onAlarm(aItem, aAlarm) {
        if (aAlarm.action != "AUDIO") {
            // This monitor only looks for AUDIO alarms.
            return;
        }

        let attachments = aAlarm.getAttachments({});
        if (attachments.length) {
            let soundAttach = attachments[0];
            if (soundAttach && soundAttach.uri) {
                try {
                    this.mSound.play(soundAttach.uri);
                } catch (exc) {
                    cal.ERROR("Error playing alarm sound(" + soundAttach.uri.spec + "):" + exc);
                }
            }
        }

        // Now dismiss the alarm so it doesn't come back
        Components.classes["@mozilla.org/calendar/alarm-service;1"]
                  .getService(Components.interfaces.calIAlarmService)
                  .dismissAlarm(aItem, aAlarm);
    },

    onRemoveAlarmsByItem: function cAM_onRemoveAlarmsByItem(aItem) {
    },

    onRemoveAlarmsByCalendar: function cAM_onRemoveAlarmsByCalendar(calendar) {
    }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([audioAlarmMonitor]);
