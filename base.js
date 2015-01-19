var objects = [];
var htmlObjects = [];
var active = -1;
var key = "";
document.body.onload = initialize;
function initialize() {
  var files = document.getElementById("files");
  files.onchange = function() {
    var length = this.files.length;
    var fileReaders  = [];
    for(var fileIndex = 0; fileIndex < length; fileIndex++) {
      fileReaders.push(new FileReader());
      fileReaders[fileIndex].onloadend = function() {
        var imageContainer = document.createElement("div");
        var image = document.createElement("img");
        image.src = this.result;
        imageContainer.appendChild(image);
        imageContainer.onclick = function() {
          this.parentNode.removeChild(this);
        }
        document.getElementById("previewImages").appendChild(imageContainer);
      }
      if(this.files[fileIndex]) {
        fileReaders[fileIndex].readAsDataURL(this.files[fileIndex]);
      }
    }
    files.value = "";
  }
  var add = document.getElementById("add");
  add.onclick = function() {
    preview = document.getElementById("previewImages");
    var children = preview.children;
    var times = children.length;
    var newObject;
    for(var i = 0; i < times; i++) {
      newObject = preview.removeChild(children[0]).children[0];
      newObject.setAttribute("data-position", objects.length);
      objects.push(new Array(parseInt(document.getElementById("frames").value)));
      htmlObjects.push(newObject);
      document.body.appendChild(newObject);
      newObject.onclick = function() {
        active = parseInt(this.getAttribute("data-position"));
        drawFrameSeperators();
      }
      document.getElementById("work").appendChild(newObject);
    }
  }
  var newButton = document.getElementById("newButton");
  newButton.onclick = function() {
    var active = this.getAttribute("data-active") === "true";
    this.setAttribute("data-active", active ? "false" : "true");
    document.getElementById("fileDialog").style.display = active ? "none" : "block";
    this.style.backgroundColor = active ? "" : "red";
  }
  var lastX = 0;
  var timeline = document.getElementById("timeline");
  var timelineContext = timeline.getContext("2d");
  timeline.width = window.innerWidth * .95;
  timeline.height = window.innerHeight / 20;
  function drawFrameSeperators() {
    var frames = parseInt(document.getElementById("frames").value);
    timelineContext.fillStyle = "lightgrey";
    if(active != -1) {
      for(var x=0; x < timeline.width; x += (timeline.width/frames)) {
        if(objects[active][x] != undefined) {
          timelineContext.fillStyle = "yellow";
        }
        timelineContext.fillRect(x, 0, 1, timeline.height);
        timelineContext.fillStyle = "lightgrey";
      }
    }
    else {
      for(var x=0; x < timeline.width; x += (timeline.width/frames)) {
        timelineContext.fillRect(x, 0, 1, timeline.height);
      }
    }
  }
  drawFrameSeperators();
  function updateTimeline(event) {
    var x = event ? event.pageX : lastX;
    lastX = x;
    var frames = parseInt(document.getElementById("frames").value);
    timeline.width = window.innerWidth * .95;
    timeline.height = window.innerHeight / 20;
    timelineContext.clearRect(0, 0, timeline.width, timeline.height);
    drawFrameSeperators();
    timelineContext.fillStyle = "green";
    timelineContext.fillRect(Math.round(x / timeline.width * frames) * timeline.width/frames, 0, 1, timeline.height);
  }
  timeline.onmousemove = updateTimeline;
  document.getElementById("frames").onchange = function() {
    for(var objectIndex = 0; objectIndex < objects.length; objectIndex++) {
      if(objects[objectIndex].length < parseInt(this.value)) {
        objects[objectIndex] = objects[objectIndex].concat(new Array(parseInt(this.value) - objects[objectIndex].length));
      }
    }
    updateTimeline();
  }
}
document.body.onkeydown = function(event) {
  var keycode = event.which || event.keyCode || event.charCode;
  if(keycode == 82) {
    key = "r";
  }
  if(keycode == 71) {
    key = "g";
  }
  if(keycode == 83) {
    key = "s";
  }
}
document.body.onkeyup = function(event) {
  var keycode = event.which || event.keyCode || event.charCode;
  if(keycode == 82 && key == "r") {
    key = "";
  }
  if(keycode == 71 && key == "g") {
    key = "";
  }
  if(keycode == 83 && key == "s") {
    key = "";
  }
}
document.body.onmousemove = function(event) {
  if(active != -1 && key != "") {
    var activeNode = htmlObjects[active]
    var center = {x: activeNode.style.left + activeNode.width / 2, y: activeNode.style.top + activeNode.height / 2};
    if(key == "r") {
      var rotation;
      if(event.pageX < center.x) {
        rotation = Math.atan((event.pageY - center.y) / (event.pageX-center.x)) - Math.PI / 2;
      }
      else {
        rotation = Math.atan((event.pageY - center.y) / (event.pageX-center.x)) + Math.PI / 2;
      }
      var degrees = rotation * 180 / Math.PI;
      activeNode.style.webkitTransform = "rotate("+degrees+"deg)";
    }
    if(key == "g") {
      activeNode.style.left = event.pageX - activeNode.width / 2;
      activeNode.style.top = event.pageY - activeNode.height / 2;
    }
    if(key == "s") {

    }
  }
}