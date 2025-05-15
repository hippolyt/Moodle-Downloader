// ==UserScript==
// @name        New script ethz.ch
// @namespace   Violentmonkey Scripts
// @match       https://moodle-app2.let.ethz.ch/*
// @grant       GM_download
// @grant       GM_openInTab
// @version     1.0
// @author      -
// @description 5/15/2025, 11:09:14 AM
// ==/UserScript==

var debug = false;
var links = document.getElementsByTagName( 'a' );
var element;

// Load usedIDs from local storage
if(!localStorage['usedResourceIDs'])
  var usedResourceIDs = []
else{
  var usedResourceIDs = JSON.parse(localStorage["usedResourceIDs"]);
}
if(!localStorage['usedFolderIDs'])
  var usedFolderIDs = []
else{
  var usedFolderIDs = JSON.parse(localStorage["usedFolderIDs"]);
}

var resourceIDs = [];  //     https://moodle-app2.let.ethz.ch/mod/resource/view.php?id=<DIGITS>
var folderIDs = [];    //     https://moodle-app2.let.ethz.ch/mod/folder/view.php?id=<DIGITS>

// First save all direct links
// like: https://moodle-app2.let.ethz.ch/pluginfile.php/<DIGITS>/mod_resource/content/2/NAME.pdf
// like: https://moodle-app2.let.ethz.ch/pluginfile.php/<DIGITS>/mod_folder/content/0/NAME.pdf?forcedownload=1
for ( var i = 0; i < links.length; i++ )
{
    element = links[ i ];
    url = element.href;

    if(url.includes("mod_folder/content") || url.includes("mod_resource/content")){
      console.log("Saving direct file: ".concat(url))
      var splitUrl = url.split("/")
      var lastPart = splitUrl[splitUrl.length-1]
      if(lastPart.includes("?")){
        lastPart = lastPart.split("?")[0]
      }
      GM_download(url,lastPart);
    }
}

// Get all resource and folder IDs and save them
for ( var i = 0; i < links.length; i++ )
{
    element = links[ i ];
    url = element.href;

    var numberPattern = /id=\d+/g;
    const idArray = url.match(numberPattern);
    if (! idArray){
      continue
    }
    else{
      const elementId = idArray[0];
      if (url.includes("resource")){
        resourceIDs.push(elementId)
      }
      else if (url.includes("folder")){
        folderIDs.push(elementId)
      }
    }
}

console.log("Resource IDs used:".concat(usedResourceIDs.length))
console.log("Resource IDs found:".concat(resourceIDs.length))
console.log("Folder IDs used:".concat(usedFolderIDs.length))
console.log("Folder IDs found:".concat(folderIDs.length))


// For each resource ID in the list, check if it is in used IDs.
// If not, add it and update used IDs.
// Then open the resource in a new tab.
// https://moodle-app2.let.ethz.ch/mod/resource/view.php?id=<DIGITS>
for( idIter in resourceIDs){
  currentID = resourceIDs[idIter];
  console.log("Checking Resource ID:".concat(currentID));

  var used = false;
  for (idIter2 in usedResourceIDs){
    currentUsedID = usedResourceIDs[idIter2];
    if(currentID == currentUsedID){
      used = true;
    }
  }
  if(used){
    continue;
  }
  else{
    usedResourceIDs.push(currentID)
    localStorage["usedResourceIDs"]=JSON.stringify(usedResourceIDs);
    url = "https://moodle-app2.let.ethz.ch/mod/resource/view.php?".concat(currentID)
    console.log("Opening tab for resource:".concat(url))
    let tabControl = GM_openInTab(url, true);
  }
}

// For each folder ID in the list, check if it is in used IDs.
// If not, add it and update used IDs.
// Then open the folder in a new tab.
// https://moodle-app2.let.ethz.ch/mod/folder/view.php?id=<DIGITS>
for(idIter in folderIDs){
  currentID = folderIDs[idIter];
  console.log("Checking Folder ID:".concat(currentID));

  var used = false;
  for (idIter2 in usedResourceIDs){
    currentUsedID = usedFolderIDs[idIter2];
    if(currentID == currentUsedID){
      used = true;
    }
  }
  if(used){
    continue;
  }
  else{
    usedFolderIDs.push(currentID)
    localStorage["usedFolderIDs"]=JSON.stringify(usedFolderIDs);
    url = "https://moodle-app2.let.ethz.ch/mod/folder/view.php?".concat(currentID)
    console.log("Opening tab for folder:")
    console.log(url)
    let tabControl = GM_openInTab(url, true);
  }
}
