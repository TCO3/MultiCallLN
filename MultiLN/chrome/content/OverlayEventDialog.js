


updateReminderDetails = function antoUpdateReminderDetails() {
    // find relevant elements in the document
    let reminderList = document.getElementById("item-alarm");
    let reminderMultipleLabel = document.getElementById("reminder-multiple-alarms-label");
    let iconBox = document.getElementById("reminder-icon-box");
    let reminderSingleLabel = document.getElementById("reminder-single-alarms-label");
    let reminders = document.getElementById("reminder-custom-menuitem").reminders || [];
    let calendar = getCurrentCalendar();
    // BEGIN CHANGES ANTO
    let actionValues = calendar.getProperty("capabilities.alarms.actionValues") || ["DISPLAY", "AUDIO"];
    // END CHANGES ANTO
    let actionMap = {};
    for each (var action in actionValues) {
        actionMap[action] = true;
    }

    // Filter out any unsupported action types.
    reminders = reminders.filter(function(x) x.action in actionMap);

    if (reminderList.value == "custom") {
        // Depending on how many alarms we have, show either the "Multiple Alarms"
        // label or the single reminder label.
        setElementValue(reminderMultipleLabel,
                        reminders.length < 2 && "true",
                        "hidden");
        setElementValue(reminderSingleLabel,
                        reminders.length > 1 && "true",
                        "hidden");

        cal.alarms.addReminderImages(iconBox, reminders);

        // If there is only one reminder, display the reminder string
        if (reminders.length == 1) {
            setElementValue(reminderSingleLabel,
                            reminders[0].toString(window.calendarItem));
        }
    } else {
        hideElement(reminderMultipleLabel);
        hideElement(reminderSingleLabel);
        if (reminderList.value != "none") {
            // This is one of the predefined dropdown items. We should show a single
            // icon in the icons box to tell the user what kind of alarm this will
            // be.
            let mockAlarm = cal.createAlarm();
            mockAlarm.action = getDefaultAlarmType();
            cal.alarms.addReminderImages(iconBox, [mockAlarm]);
        } else {
            // No reminder selected means show no icons.
            removeChildren(iconBox);
        }
    }
}

saveReminder = function antoSaveReminder(item) {
    // Clear alarms, we'll need to remove alarms later  anyway.
    item.clearAlarms();

    let reminderList = document.getElementById("item-alarm");
    if (reminderList.value != 'none') {
        let menuitem = reminderList.selectedItem;
        let reminders;

        if (menuitem.reminders) {
            // Custom reminder entries carry their own reminder object with
            // them. Make sure to clone in case these are the original item's
            // reminders.

            // XXX do we need to clone here?
            reminders = menuitem.reminders.map(function(x) x.clone());
        } else {
            // Pre-defined entries specify the necessary information
            // as attributes attached to the menuitem elements.
            reminders = [createReminderFromMenuitem(menuitem)];
        }

        let alarmCaps = item.calendar.getProperty("capabilities.alarms.actionValues") ||
// BEGIN CHANGES ANTO
                        ["DISPLAY", "AUDIO"];
// END CHANGES ANTO
        let alarmActions = {};
        for each (let action in alarmCaps) {
            alarmActions[action] = true;
        }

        // Make sure only alarms are saved that work in the given calendar.
        reminders.filter(function(x) x.action in alarmActions)
                 .forEach(item.addAlarm, item);
    }
}
