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
    if (labelElement.value && reminder.action == "AUDIO") { 
        let soundAttach = cal.createAttachment(); 
        soundAttach.uri = cal.makeURL(labelElement.value); 
        reminder.addAttachment(soundAttach);
        cal.WARN("Adding attachment " + soundAttach.icalProperty.icalString + " / " + reminder.icalString);
    } 

};
 
var onLoadOld = onLoad;
onLoad = function onLoadNew() {
    allowedActionsMap.AUDIO = true;
    onLoadOld();
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
        //document.getElementById("calendar.alarms.soundURL").value = fp.fileURL.spec;
        //document.getElementById("alarmSoundCheckbox").checked = true;
        alert(fp.fileURL.spec);
        //this.readSoundLocation();
    
        /* stocker dans prefs.js le nom du fichier
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        prefs = prefs.getBranch("extensions.multicall@anto.com.");
        prefs.setCharPref("extensions.follow_up_ext.calnameee",fp.fileURL.spec);    
        var calName = prefs.getCharPref("extensions.follow_up_ext.calnameee");
        alert(calName);
        */
        var test2 = document.getElementById("sound-to-play")
        test2.value = fp.fileURL.spec;
        //return(fp.fileURL.spec)
        updateReminder(event);
    }
}    


//EXTEND onReminderSelected

var onRemSelOld = onReminderSelected;
         onReminderSelected = function onReminderSelectedNew() {
			/* do stuff */
			let listbox = document.getElementById("reminder-listbox");
			let listitem = listbox.selectedItem;
			let reminder = listitem.reminder;
			if(reminder.action == "AUDIO"){
				
				document.getElementById("audio-alarm-anto").hidden = (reminder.action != "AUDIO");
				document.getElementById("sound-to-play").value = reminder.getAttachments({})[0].uri.spec;
           
			}
		   onRemSelOld() // calls the old func
         };    
