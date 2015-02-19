var objects = [];
var htmlObjects = [];
var active = -1;
var key = "";
var currentFrame = 0;
var isPlaying = false;
var playbackFrame = 0;
var lastX = 0;
function playAnimation() {
  var frames = parseInt(document.getElementById("frames").value);
  currentFrame = playbackFrame;
  drawFrameSeperators();
  if(isPlaying && playbackFrame < frames) {
    var activeObject;
    var activeNode;
    var lowerBound;
    var upperBound;
    var checkFrame;
    for(var objectIndex = 0; objectIndex<objects.length; objectIndex++) {
      lowerBound = -1;
      upperBound = -1;
      checkFrame = playbackFrame;
      activeObject = objects[objectIndex];
      activeNode = htmlObjects[objectIndex];
      while(lowerBound == -1 && checkFrame >= 0) {
        if(activeObject[checkFrame] != undefined) {
          lowerBound = checkFrame;
        }
        checkFrame--;
      }
      checkFrame = playbackFrame + 1;
      while(upperBound == -1 && checkFrame < activeObject.length) {
        if(activeObject[checkFrame] != undefined) {
          upperBound = checkFrame;
        }
        checkFrame++;
      }
      if(lowerBound != -1) {
        var pastFrame = activeObject[lowerBound]
        if(upperBound != -1) {
          var futureFrame = activeObject[upperBound]
          activeNode.style.left = pastFrame.position.x + (futureFrame.position.x - pastFrame.position.x)/(upperBound-lowerBound)*(playbackFrame-lowerBound);
          activeNode.style.top = pastFrame.position.y + (futureFrame.position.y - pastFrame.position.y)/(upperBound-lowerBound)*(playbackFrame-lowerBound);
          activeNode.style.webkitTransform = "rotate("+(pastFrame.rotation + (futureFrame.rotation - pastFrame.rotation)/(upperBound-lowerBound)*(playbackFrame-lowerBound))+"deg)";
          activeNode.width = pastFrame.size.width + (futureFrame.size.width - pastFrame.size.width)/(upperBound-lowerBound)*(playbackFrame-lowerBound);
          activeNode.height = pastFrame.size.height + (futureFrame.size.height - pastFrame.size.height)/(upperBound-lowerBound)*(playbackFrame-lowerBound);
        }
        else {
          activeNode.style.left = pastFrame.position.x;
          activeNode.style.top = pastFrame.position.y;
          activeNode.style.webkitTransform = "rotate("+pastFrame+"deg)";
          activeNode.width = pastFrame.size.width;
          activeNode.height = pastFrame.size.height;
        }
      }
    }
    playbackFrame++;
    requestAnimationFrame(playAnimation);
  }
  else {
    isPlaying = false;
  }
}
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
      document.getElementById("images").appendChild(newObject);
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
  window.drawFrameSeperators = function drawFrameSeperators() {
    var frames = parseInt(document.getElementById("frames").value);
    timelineContext.fillStyle = "lightgrey";
    if(active != -1) {
      for(var x=0; x < frames; x++) {
        if(objects[active][x] != undefined) {
          timelineContext.fillStyle = "yellow";
        }
        timelineContext.fillRect(x * (timeline.width/frames), 0, 1, timeline.height);
        timelineContext.fillStyle = "lightgrey";
      }
    }
    else {
      for(var x=0; x < timeline.width; x += (timeline.width/frames)) {
        timelineContext.fillRect(x, 0, 1, timeline.height);
      }
    }
    timelineContext.fillStyle = "green";
    timelineContext.fillRect(currentFrame * timeline.width/frames, 0, 1, timeline.height);
  }
  drawFrameSeperators();
  function updateTimeline(event) {
    var x = event ? event.pageX : lastX;
    lastX = x;
    var frames = parseInt(document.getElementById("frames").value);
    currentFrame = Math.round(x / timeline.width * frames);
    timeline.width = window.innerWidth * .95;
    timeline.height = window.innerHeight / 20;
    timelineContext.clearRect(0, 0, timeline.width, timeline.height);
    drawFrameSeperators();
  }
  timeline.onmousedown = function(event) {
    updateTimeline(event);
    timeline.onmousemove = updateTimeline;
  };
  timeline.onmouseup = function(event) {
    timeline.onmousemove = function(){};
  }
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
  if(keycode == 73) {
    if(active != -1) {
      var activeNode = htmlObjects[active];
      var rotation = parseFloat(activeNode.style.webkitTransform.replace("rotate(", "").replace("deg)", "") || 0);
      var x = parseFloat(activeNode.style.left || 0);
      var y = parseFloat(activeNode.style.top || 0);
      var position = {x: x, y: y};
      var size = {width: activeNode.width, height: activeNode.height};
      objects[active][currentFrame] = {rotation: rotation, position: position, size: size};
    }
    key = "";
  }
  if(keycode == 32) {
    key = "";
    if(isPlaying) {
      isPlaying = false;
    }
    else {
      playbackFrame = currentFrame;
      isPlaying = true;
      playAnimation();
    }
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
  if(active != -1 && key != "" && !isPlaying) {
    var activeNode = htmlObjects[active]
    var center = {x: parseInt(activeNode.style.left+0) + activeNode.width / 2, y: parseInt(activeNode.style.top+0) + activeNode.height / 2};
    if(key == "r") {
      var rotation;
      if(event.pageX < center.x) {
        rotation = Math.atan((event.pageY - center.y) / (event.pageX-center.x)) - Math.PI / 2;
      }
      else {
        rotation = Math.atan((event.pageY - center.y) / (event.pageX-center.x)) + Math.PI / 2;
      }
      var degrees = rotation * 180 / Math.PI;
      var increment = (event.shiftKey + event.altKey) * 5;
      if(increment > 0) {
        degrees = Math.round(degrees / increment)*increment;
      }
      activeNode.style.webkitTransform = "rotate("+degrees+"deg)";
    }
    if(key == "g") {
      activeNode.style.left = event.pageX - activeNode.width / 2;
      activeNode.style.top = event.pageY - activeNode.height / 2;
    }
    if(key == "s") {
      if(!event.shiftKey) {
        var xDistance = (event.pageX > center.x) ? (event.pageX - center.x) : (center.x - event.pageX);
        var yDistance = (event.pageY > center.y) ? (event.pageY - center.y) : (center.y - event.pageY);
        activeNode.width = xDistance * 2;
        activeNode.height = yDistance * 2;
        activeNode.style.left = center.x - xDistance;
        activeNode.style.top = center.y - yDistance;
      }
      else {
        var xDistance = (event.pageX > center.x) ? (event.pageX - center.x) : (center.x - event.pageY);
        var yDistance = (event.pageY > center.y) ? (event.pageY - center.y) : (center.y - event.pageY);
        var distance = Math.max(xDistance, yDistance);
        activeNode.width = distance * 2;
        activeNode.height = distance * 2;
        activeNode.style.left = center.x - distance;
        activeNode.style.top = center.y - distance;
      }
    }
  }
}