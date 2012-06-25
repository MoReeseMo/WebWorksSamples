// window.onload = function () {
    // bbmUtil.init();
//     
// };
//bb.assignBackHandler(app.buttonHandler());

var bbmUtil = { };

bbmUtil.accessible = true;

/**
 * Performs steps necessary to start using BBM Platform.
 * 
 * Steps necessary:
 * - Sets static BBM platform callbacks which the application wishes to use.
 * - Call blackberry.bbm.platform.register() with your UUID.
 */
bbmUtil.init = function () {
	
	try {
		// alert ("in init");
		 bb.pushScreen('home.htm', 'home');
		 
	    // This is called when:
		// - Properties on the current user or other users' profile changes.
		// - Other users install/uninstall this application.
		// - The current user receives an invitation in BBM.
	    blackberry.bbm.platform.users.onupdate = function (user, event) {
	        if (event === "invited") {
	            alert("You were invited to a chat. Go to BBM to accept it.");
	        } else if (user.handle === blackberry.bbm.platform.self.handle) {
	            userProfile.populate();
	        }
	    };
	    // This is called in certain cases when the application is invoked from within BBM.
	    // You can optionally handle these invocations to provide better integration, and interesting use cases.
	    blackberry.bbm.platform.onappinvoked = function (reason, param, user) {
	        var displayName, message;
	        // Get display name
	        if (user === blackberry.bbm.platform.self) {
	            displayName = "your";
	        } else {
	            displayName = user.displayName + "'s";
	        }
	
	        // Create message for dialog based on reason
	        message = "App invoked by " + displayName + " "; 
	        if (reason === "profilebox") {
	            var profileBoxItem = param;
	            message += " profile box item:\n" + profileBoxItem.text;
	            content.showProfileBox();
	        } else if (reason === "profileboxtitle") {
	            message += " profile box title";
	            content.showProfileBox();
	        } else if (reason === "personalmessage") {
	            var personalMsg = param;
	            message += "personal message:\n" + personalMsg;
	        } else if (reason === "chatmessage") {
	            message += "chat message";
	        } else {
	            // If unknown reason, do nothing
	            return;
	        }
	
	        alert(message);
	    };
	    sharecontent.init(); // Set callbacks for share content
	    connections.init();  // Set callbacks for connections
	
	    /*
	     * Finally the application should register with the platform.
	     */
	    bbmUtil.register();
    }catch (e) {
        alert("Error initializing app: " + e);
    }
};

/**
 * Registers the application with BBM. Static callbacks should be set before this method is called.
 * Called by {@link bbmUtil.init()}.
 * @see bbmUtil.init()
 */
bbmUtil.register = function () {
	
	try {
		/**
	     * Required
	     * This is called when the application's access to BBM platform changes.
	     */
	    blackberry.bbm.platform.onaccesschanged = function (accessible, status) {
	        bbmUtil.accessible = accessible; // Save the accessible state
	
	        // If allowed, initialize the application
	        if (status === "allowed") {
	            content.showDemoList();
	        // If not allowed, show error screen
	        } else {
	            content.showStart();
	            var startDiv = document.getElementById("start");
	            startDiv.innerHTML = "<h3>Connect to BBM failed</h3>" + bbmUtil.getStatusMessage(status);
	
	            /*
	             * If blocked by the user, add a button to prompt the user to reconnect to BBM.
	             * See bbmUtil.requestPermissionAndRegister()
	             */
	            if (status === "user") {
	                startDiv.innerHTML += "<button onclick='bbmUtil.showBBMAppOptionsAndRegister()'>Connect to BBM</button>";
	            }
	        }
	    };
	
	    try {
	        blackberry.bbm.platform.register({
	        // TODO You must define your own UUID
		        uuid: "fabbc16b-e6bc-416b-9fd3-01ae48aadf3c", //generated from http://www.guidgenerator.com/
	
		        // Enable splatting of application icon when shared content is received
		        shareContentSplat: true
		    });
	    } catch (e) {
	        alert("You must define your own UUID. See bbmUtil.register() in code.js.");
	    }
    }catch (e) {
		alert("Error registering app: " + e);
	}
};


/**
 * Invoked by a "Connect to BBM" button which appears when registration fails due to the user blocking
 * the application.
 * 
 * Prompts the user to connect the application to BBM, which brings the user to the application's
 * BBM Options screen to connect it.
 */
bbmUtil.showBBMAppOptionsAndRegister = function () {
    blackberry.bbm.platform.showBBMAppOptions(function () {
        bbmUtil.register();
    });
};

/**
 * Shows a Contact Picker allowing the user to invite contacts to download the application.
 */
bbmUtil.inviteToDownload = function () {
    blackberry.bbm.platform.users.inviteToDownload(function (result) {
        if (result === "limitreached") {
            // Download invitation limit reached
        } else {
            // User finished inviting
        }
    });
};

/**
 * Shows a Contact Picker allowing the user to start a chat with other users within BBM.
 */
bbmUtil.startBBMChat = function () {
    blackberry.bbm.platform.users.startBBMChat(function () {
        // Continue with application...
    }, "Have you tried " + blackberry.app.name + "?");
};

/**
 * Returns an access status message to be displayed to the user.
 * @param {String} status The status code.
 */
bbmUtil.getStatusMessage = function (status) {
    if (status === "user") {
        return "You decided not to connect " + blackberry.app.name + " to BBM";
    } else if (status === "rim") {
        return blackberry.app.name + " has been banned by RIM.";
    } else if (status === "resetrequired") {
        return "A device restart is required to use this application.";
    } else if (status === "nodata") {
        return "There was no data coverage. Please try again when you are in data coverage.";
    } else if (status === "temperror") {
        return "A temporary error occured. Please try again in 30 minutes.";
    }
};

bbmUtil.getJoinRequestDeclinedReason = function (reason) {
    if (reason === "hostdeclined") {
        return "The host declined your join request";
    } else if (reason === "hostppidinvalid") {
        return "The host PPID was invalid";
    } else if (reason === "appnotrunning") {
        return "The host was not running " + blackberry.app.name;
    } else if (reason === "connectionnotfound") {
        return "The user was not hosting a connection";
    } else if (reason === "connectionfull") {
        return "The host's connection was full";
    }
};

bbmUtil.getJoinRequestCanceledReason = function (reason) {
    if (reason === "peercanceled") {
        return "The peer canceled the request";
    } else if (reason === "peerleft") {
        return "The peer exited " + blackberry.app.name;
    }
};

/**
 * Returns string for a number of users.
 * @param {blackberry.bbm.platform.users.BBMPlatformUser[]} users The users.
 */
bbmUtil.getUsersString = function (users) {
    var usersStr, i;
    if (users.length === 0) {
        return "no users";
    } else {
        usersStr = users[0].displayName;
        for (i = 1; i < users.length; i++) {
            usersStr += ", " + users[i].displayName;
        }
        return usersStr;
    }
};


/**
 * Manages the user profile content div.
 */
var userProfile = { };

userProfile.setPersonalMessage = function () {
	
    var personalMessageTxt = document.getElementById("bbm-message"),
        personalMessage = personalMessageTxt.value;
    
    alert (personalMessage);
    
    personalMessageTxt.value = "";
    blackberry.bbm.platform.self.setPersonalMessage(personalMessage, function (accepted) {
        if (accepted) {
            // User allowed change
        } else {
            // User denied change
        }
    });
};


/**
 * Manages the Share Content div.
 */
var sharecontent = {};

/**
 * Setup callbacks required for share content. 
 */
sharecontent.init = function () {
	// This will be invoked on the receiver's side. This should be set before the call to register()
	blackberry.bbm.platform.users.onsharecontent = function (sender, content, description, timestamp) {
		alert(sender.displayName + " shared content with you...\n" +
				"Description: " + description + "\n" +
				"Timestamp: " + timestamp.toDateString() + "\n" +
				"Content: " + content);
	};
};

/**
 * Shares content from the share content div.
 */
sharecontent.share = function () {
	try {
		alert ("in share conent");
		var descrTxt = document.getElementById("content-description"),
	        description = descrTxt.value;
	    
	    var contTxt = document.getElementById("content-cont"),
	    	content = contTxt.value;
	    
		
		// Clear values on the form
		descrTxt.value = "";
		contTxt.value = "";
	
		// Create options object. Only required if title or users are provided
		options = {};
		options.users = blackberry.bbm.platform.users.contactsWithApp;
		// if (title) {
			// options.title = title;
		// }
		// if (onlyContactsWithApp) {
			// options.users = blackberry.bbm.platform.users.contactsWithApp;
		// }
		
		// Allow user to pick contacts to send content
		blackberry.bbm.platform.users.shareContent(content, description, function () {
			// User finished sharing...
		}, options);
	}
	catch (e) {
		alert("Error in ShareContent: " + e);
	}
};

var app = {};

app.buttonHandler = function () {
	bb.popScreen();
};

var connections = {};

connections.list = [];

/**
 * Setup required/optional callbacks for connections.
 */
connections.init = function () {
	// Required 
	// This is invoked when the application receives a connection. This can happen in two cases:
	// 1. On the invitee's side when the user accepts an invitation within BBM.
	// 2. On the peer's side when a host accepts a peer's request to join a hosted connection.
	blackberry.bbm.platform.io.onconnectionaccepted = function (type, connection) {
        connections.setupConnection(type, connection);
    };
    // Optional
    // This is invoked when an unreachable user becomes reachable again.
    blackberry.bbm.platform.io.onuserreachable = function (user) {
        alert(user.displayName + " was unreachable, but can now receive messages.");
    };
    // Optional
    // This is invoked when pending data for an unreachable contact expires.
    blackberry.bbm.platform.io.ondataexpired = function (user, data) {
        alert(user.displayName + " did not receive all messages");
    };
};
