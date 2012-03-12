var updRemOld = updateReminder;
updateReminder = function udpRemNew(event) {
    updRemOld.apply(null, arguments); // calls the old func
    if (event.explicitOriginalTarget.localName == "listitem" ||
        event.explicitOriginalTarget.id == "reminder-remove-button" ||
        !document.commandDispatcher.focusedElement) {
        // Do not set things if the select came from selecting or removing an
        // alarm from the list, or from setting when the dialog initially loaded.
        // XXX Quite fragile hack since radio/radiogroup doesn't have the
        // supressOnSelect stuff.
        return;
    }
    let listbox = document.getElementById("reminder-listbox");
    let relationItem = document.getElementById("reminder-relation-radiogroup").selectedItem;
    let listitem = listbox.selectedItem;
    if (!listitem || !relationItem) {
        return;
    }
    let reminder = listitem.reminder;

    //HIDE OR SHOW THE FILEPICKER BUTTON
    document.getElementById("audio-alarm-anto").hidden = (reminder.action != "AUDIO");
    //END HIDE AND SHOW FILEPICKER BUTTON

    let labelElement = document.getElementById("sound-to-play");
    if (reminder.action == "AUDIO" && labelElement.value) {
        let soundAttach = cal.createAttachment();
        soundAttach.uri = cal.makeURL(labelElement.value);
        reminder.clearAttachments();
        reminder.addAttachment(soundAttach);
    }
};

var onLoadOld = onLoad;
onLoad = function onLoadNew() {
    allowedActionsMap.AUDIO = true;
    onLoadOld();
};

var onRemSelOld = onReminderSelected;
onReminderSelected = function onReminderSelectedNew() {
    let listbox = document.getElementById("reminder-listbox");
    let listitem = listbox.selectedItem;
    let reminder = listitem.reminder;
    document.getElementById("audio-alarm-anto").hidden = (reminder.action != "AUDIO");
    document.getElementById("sound-to-play").value = cal.getPrefSafe("calendar.alarms.soundURL");
    if (reminder.action == "AUDIO") {
        let attachments = reminder.getAttachments({});
        if (attachments && attachments.length) {
            if (attachments[0].uri) {
                document.getElementById("sound-to-play").value = attachments[0].uri.spec;
            }
        }
    }
    onRemSelOld();
};

function gAP_browseAlarmanto(event) {
    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"]
            .createInstance(nsIFilePicker);

    //var bundlePreferences = document.getElementById("bundleCalendarPreferences");
    //var title = bundlePreferences.getString("Open");
    var title = "Hello";
    var wildmat = "*.wav";
    //var label = bundlePreferences.getFormattedString("filterWav", [wildmat], 1);

    fp.init(window, title, nsIFilePicker.modeOpen);
    //fp.appendFilter(label, wildmat);
    fp.appendFilters(nsIFilePicker.filterAll);

    var ret = fp.show();
    if (ret == nsIFilePicker.returnOK) {
        document.getElementById("sound-to-play").value = fp.fileURL.spec;
        updateReminder(event);
    }
}
