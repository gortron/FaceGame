var video = document.querySelector("#videoElement");
var mouthPoints = [];
const body = document.querySelector('body')

window.addEventListener("click", () => {
  console.log(`${event.clientX},${event.clientY}`);
});

const mainContainer = document.querySelector('.container')

Promise.all([
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("../src/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("../src/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../src/models")
]).then(start);

function start() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawDetections(canvas, resizedDetections)

    const landmarks = await faceapi.detectFaceLandmarksTiny(video);
    const mouth = landmarks.getMouth();

    var rect = video.getBoundingClientRect();
    box = detections.detection.box

    boxCoordinates(box, rect)
    
    // const adjMouth = mouthCoordinates(mouth);
    // mouthCoordinates(mouth);

    
    // mouthIsOpen(adjMouth);
  }, 500);

  startThrow(boxCoordinates)

});

function boxCoordinates(box, rect) {
  theBoxCoordinates = []
  x = box.x + .5 * box.width + rect.x
  y = box.y + .5 * box.height + rect.y + 100
  
  return theBoxCoordinates = {x: x, y: y}
}


function mouthCoordinates(mouth) {
  mouthPoints = [];
  mouth.forEach(landmark => {
    x = landmark.x + (window.innerWidth - video.width) / 2;
    y = landmark.y + (window.innerHeight - video.height) / 2;
    mouthPoints.push({ x, y });
  });
  return mouthPoints;
}

function mouthIsOpen(mouth) {

  const mouthHeight = faceapi.euclideanDistance(
    [mouth[14].x, mouth[14].y],
    [mouth[18].x, mouth[18].y]
  );
  const lipHeight = faceapi.euclideanDistance(
    [mouth[9].x, mouth[9].y],
    [mouth[3].x, mouth[3].y]
  );

  let mouthOpen = mouthHeight > 50;
  console.log(mouthOpen);
  return mouthOpen;
};


class MovingObject {
  constructor(){
    let newDiv = document.createElement('div')
    body.append(newDiv)
    this.element = newDiv
    this.element.style.left = `${500}px`
    this.element.style.bottom = `${300}px`
  }
  
  moveDodgerRight() {
    let xPosition = this.element.style.left.replace("px", "");
    let x = parseInt(xPosition, 10)

    if (x > 1500) {this.element.remove()}
    else if (x >= 0) { this.element.style.left = `${x + 20}px`; this.x = x + 20 }
  }

  isCollide() {
    let xPosition = parseInt(this.element.style.left.replace("px", ""),10);
    let yPosition = window.innerHeight - parseInt(this.element.style.bottom.replace("px", ""),10);
    
    let functionStuff = (point) => {
      

      let rect1 = {x: xPosition, y: yPosition, width: 60, height: 60}
      let rect2 = {x: point.x , y: point.y , width: 60, height: 60 } 

      if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {

        console.log("Collision")
      }
    }

    functionStuff(theBoxCoordinates) 
    
  }
}

class Baguette extends MovingObject {
  constructor(){
    super()
    // let newDiv = document.createElement('div')
    // body.append(newDiv)
    // this.element = newDiv
    // this.element.style.left = `${500}px`
    // this.element.style.bottom = `${300}px`
    this.element.className = "dodger"
    this.element.innerHTML = "🥖"
  }
}




const objects = []
function startThrow(){
  setInterval(() => {
    objects.push(new Baguette())
  }, 5000)
  setInterval( () => { objects.forEach(object => object.moveDodgerRight() )} , 300)
  setInterval( () => {objects.forEach(object => object.isCollide())}, 10 )
}



