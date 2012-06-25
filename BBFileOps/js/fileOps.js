/*
 * BB File IO operations
 */
bbfileIO = {
	filePath: "file:///store/home/user/sample.xml",
	
	//creates a file using filePath, then saves it. In practice, 'filePath' could be passed in as parm 
	fileSave: function(){	
		try	{
			//console.log('in fileSave function');
			var xmlString = "<test>IO functions</test>";
		  	var parser = new DOMParser();
		  	var doc = parser.parseFromString(xmlString, "text/xml");
		  	var blob_data = blackberry.utils.stringToBlob(doc.toString());		    
		    
		  	blackberry.io.file.saveFile(this.filePath, blob_data);
		                
			//console.log ('checking if file does Exist: ' + this.filePath);	                
		  	if (blackberry.io.file.exists(this.filePath)) {
		  		alert ('File Created and Saved ' + this.filePath);
		  		document.getElementById("status-bar-text").innerHTML = 'Created and saved ' + this.filePath; 
		  		//statu.innerHTML += "<br>"
		  	}
		  	else {
		  		alert ('File was not saved!');
		  		document.getElementById("status-bar-text").innerHTML = 'File was not saved!';
		  	}
	  	}
	  	catch (err)	{
	  		alert('error: ' +  err.message)
	  		document.getElementById("status-bar-text").innerHTML = err.message;
	  	}	  	
	},	
	
	//Reads the previously created file. In practice, 'filePath' could be passed in as parm
	fileRead: function(){
		try	{ 
			//console.log('in fileRead function');
			if (blackberry.io.file.exists(this.filePath)) {
		  		//console.log ('file does Exist, attempting to read: ' + this.filePath);
		    	blackberry.io.file.readFile(this.filePath,this.handleOpenedFile);
		  	}
		  	else {
		  		alert ('No file to read');
		  	}
		}
		catch (err)	{
			alert('error: ' +  err.message)
		}
	},
	
	//Deletes the previously created file. In practice, 'filePath' could be passed in as parm
	fileDelete: function () {
		try {
			//console.log('in fileDelete function');
		  	
		  	if (blackberry.io.file.exists(this.filePath)) {
		  		//console.log ('file does Exist, attempting to delete: ' + this.filePath);
		    	blackberry.io.file.deleteFile(this.filePath);
		    	alert ('Successfully deleted ' + this.filePath);
		  	}
		  	else {
				alert ('No file to delete');		  		
		  	}
		}
		catch (err) {
			alert('error: ' +  err.message)	
		}
	},
	  	
  	//handler called when readfile is successful
  	handleOpenedFile: function (fullPath, blobData) {
		alert("file opened was: " + fullPath + " which contained " + blobData.length + " bytes");
	}
}

// bbMenus = {	
	// addMenus: function(){
		// try
		// {
			// //console.log ('in addMenus function');
			// blackberry.ui.menu.clearMenuItems();	
// 			
			// var mnuItm_ShowLog = new blackberry.ui.menu.MenuItem(false, 1,"Show Console History", console.showhistory);
			// blackberry.ui.menu.addMenuItem(mnuItm_ShowLog);
		// }
		// catch (err)
		// {
			// alert ('Exception in addmenus() ' + err.name + ';' + err.message);
		// }
	// }
// }

/*
 *Console Logger 
 */
// var consoleNorm = console;
// var console = {
   // history: new Array(),      
   // log: function(msg) {
          // console.history.push(msg);        
          // consoleNorm.log(msg);
   // },
   // showhistory: function() {
          // var allhistory = console.history.join("\n-");
          // alert( allhistory );
   // }
// }
