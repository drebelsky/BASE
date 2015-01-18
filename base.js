var objects = [];
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
      newObject.setAttribute("data-spot", objects.length);
      objects.push([]);
      document.body.appendChild(newObject);
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
    for(var x=0; x < timeline.width; x += (timeline.width/frames)) {
      timelineContext.fillRect(x, 0, 1, timeline.height);
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
    timelineContext.fillStyle = "yellow";
    timelineContext.fillRect(Math.round(x / timeline.width * frames) * timeline.width/frames, 0, 1, timeline.height);
  }
  timeline.onmousemove = updateTimeline;
  document.getElementById("frames").onchange = function() {
    updateTimeline();
  }
}