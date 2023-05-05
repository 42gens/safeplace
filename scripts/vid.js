// Retrieve the user ID from localStorage
const urlSearchParamsv = new URLSearchParams(window.location.search);
const idv = urlSearchParamsv.get('id');
console.log(idv);

// Set latitude and longitude in localStorage
navigator.geolocation.getCurrentPosition((position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  localStorage.setItem('latitude', latitude);
  localStorage.setItem('longitude', longitude);
});




let constraintObj = {
  audio: true,
  video: {
    facingMode: "user", // toDo - use the back of the camera...
    width: { min: 380, ideal: 620, max: 680 },
    height: { min: 280, ideal: 320, max: 980 }
  }
};

let mediaRecorder;
let mediaStreamObj;
let chunks = [];
let videoURL;

let metadata = {
  timeStamp: Date.now(),
  longitude: localStorage.getItem('longitude'),
  latitude: localStorage.getItem('latitude'),
  eventype: 'vidstart',
  uploadLocation: `/usr/local/nginx/ct-vids/${idv}_${Date.now()}.mp4`,
  id: idv
};

console.log(metadata);

// Create a function to start streaming video to a remote server
function startStreaming() {
  const ws = new WebSocket('wss://safe-watcher.com:21935/live'); // replace with your nginx server URL
  ws.binaryType = 'blob';
  ws.onopen = () => {
    console.log('1 - ct - WebSocket connection established.');
    // send metadata with video start event
    ws.send(JSON.stringify(metadata));
    mediaRecorder.start();
  };
  ws.onmessage = (event) => {
    console.log(`2 - ct - Received message from server: ${event.data}`);
  };
  ws.onclose = () => {
    console.log('3 - ct- WebSocket connection closed.');
    mediaRecorder.stop();
  };
  ws.onerror = (error) => {
    console.log(`4error - ct- WebSocket error: ${error}`);
    mediaRecorder.stop();
  };
}

//handle older browsers that might implement getUserMedia in some way
function getUserMedia() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Most modern browsers that support getUserMedia
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } else if (navigator.getUserMedia) {
    // Handle older browsers that might implement getUserMedia in some way
    return new Promise(function (resolve, reject) {
      navigator.getUserMedia(
        { video: true, audio: true },
        resolve,
        reject
      );
    });
  } else if (navigator.webkitGetUserMedia) {
    // Handle webkit-based browsers that implement getUserMedia
    return new Promise(function (resolve, reject) {
      navigator.webkitGetUserMedia(
        { video: true, audio: true },
        resolve,
        reject
      );
    });
  } else if (navigator.mozGetUserMedia) {
    // Handle Firefox-based browsers that implement getUserMedia
    return new Promise(function (resolve, reject) {
      navigator.mozGetUserMedia(
        { video: true, audio: true },
        resolve,
        reject
      );
    });
  } else {
    // Browser doesn't support getUserMedia
    return Promise.reject(new Error("getUserMedia is not supported"));
  }
}


navigator.mediaDevices.getUserMedia(constraintObj)
  .then(function (stream) {
    //connect the media stream to the first video element
    let video = document.querySelector('video');
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      //old version
      video.src = window.URL.createObjectURL(stream);
    }

    mediaStreamObj = stream;

    video.onloadedmetadata = function (ev) {
      //show in the video element what is being captured by the webcam
      video.play();
    };

//add listeners for saving video/audio
let start = document.getElementById('btnStart');
let stop = document.getElementById('btnStop');
let vidSave = document.getElementById('vid2');
let mediaRecorder = new MediaRecorder(mediaStreamObj);
let chunks = [];
let videoBlob = new Blob(chunks, { 'type': 'video/mp4;' });

mediaRecorder.ondataavailable = function (ev) {
  chunks.push(ev.data);
};

start.addEventListener('click', (ev) => {
  mediaRecorder.start();
  //startStreaming();
  console.log(mediaRecorder.state);

  // send metadata with video start event
  const metadata = {
    timeStamp: Date.now(),
    longitude: localStorage.getItem('longitude'),
    latitude: localStorage.getItem('latitude'),
    eventType: 'vidstart',
    uploadLocation: `/usr/local/nginx/ct-vids/${idv}_${Date.now()}.mp4`,
    id: idv
  };

  console.log('The values in metadata 1', metadata);

  fetch('https://safe-watcher.com:10000/video-metadata', {
    method: 'POST',
    body: JSON.stringify(metadata),
    //headers: {
    //  'Content-Type': 'application/json'
    //}
  })
  .then(response => {
      console.log('Metadata 1 uploaded successfully.');
  });
});

stop.addEventListener('click', (ev) => {
  mediaRecorder.stop();
  console.log(mediaRecorder.state);

  // generate filename using id and timestamp
  const timestamp = Date.now();
  const filename = `${idv}_${timestamp}.mp4`;
  console.log('The values in filename1', filename);

  // send video to server
  const formData = new FormData();
  console.log('The values in formData to send to server', formData); // Remove before Prod
  
  
  formData.append('video', videoBlob, 'filename');
  fetch('https://safe-watcher.com:21935/live/', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log('Video uploaded successfully.');
    console.log('The values in formData 1', formData); //Remove befor PROD
    console.log('response 1', response); //Remove before PROD
  

    // Send metadata to server when video stops
    const metadata = {
      timestamp: Date.now(),
      longitude: localStorage.getItem('longitude'),
      latitude: localStorage.getItem('latitude'),
      eventtype: 'vidstop',
      uploadlocation: `${idv}_${Date.now()}.mp4`,
      id: idv
    };
    console.log('The values in metada 2', metadata);

    fetch('https://safe-watcher.com:10000/video-metadata', {
      method: 'POST',
      body: JSON.stringify(metadata),
      //headers: {
      //  'Content-Type': 'application/json'
      //}
    })
    .then(response => {
        console.log('Video Stop - Metadata 2 uploaded successfully.');
        console.log('response 2', response); //Remove before PROD
    });
  });

  chunks = [];
});



mediaRecorder.onstop = (ev) => {
  let blob = new Blob(chunks, { 'type': 'video/mp4;' });
  let videoURL = window.URL.createObjectURL(blob);
  vidSave.src = videoURL;

  // send metadata with video end event
  const metadata = {
    timeStamp: Date.now(),
    longitude: localStorage.getItem('longitude'),
    latitude: localStorage.getItem('latitude'),
    eventtype: 'vidend',
    uploadlocation: `/usr/local/nginx/ct-vids/${idv}_${Date.now()}.mp4`,
    id: idv
  };

  console.log('Sending metadata with video and event type - The values in metadata 3', metadata);


  fetch('https://safe-watcher.com:10000/video-metadata', {
    method: 'POST',
    body: JSON.stringify(metadata),
    //headers: {
    //  'Content-Type': 'application/json'
    //}
  })
  .then(response => {
      console.log('Metadata 3 uploaded successfully.');
      console.log('response 3', response);
  });

  chunks = [];
};
  })