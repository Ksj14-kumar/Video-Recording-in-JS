const btn = document.getElementById("btn")
const Container= document.getElementById("container")
const localVideo = document.getElementById("localVideo")
const recordedVideo = document.getElementById("recordVideo")
const recordStart = document.getElementById("recordbtn")
const stopRecording = document.getElementById("stopRecording")
const paused = document.getElementById("paused")
const playVideo = document.getElementById("Play")
const endedVideo = document.getElementById("mic")
const shareScreen = document.getElementById("shareScreen")



const DURATION = 5 * 1000

constraints = {
    video: {
        width: { exact: 340 },
        height: { exact: 300 }
    },
    audio: {
        echoCancellation: { exact: true }
    }
}


function recordedStart(e) {
    storeBlob = []
    try {
        mediaRecorder = new MediaRecorder(localStream)
    } catch (er) {
        console.log(er)
    }
    mediaRecorder.onstop = (e) => {
        console.log("store blobs", storeBlob)
    }
    mediaRecorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) {
            storeBlob.push(e.data)
        }
    }
    mediaRecorder.start(DURATION)

}


function recordedStop(e) {
    mediaRecorder.stop()
    paused.disabled = true
    recordStart.textContent = "Record Start"
    playVideo.disabled = false
}

let localStream, mediaRecorder, storeBlob;


// =========================Recording Stream start==================================
recordStart.addEventListener("click", (e) => {
    if (recordStart.textContent === "Record Start") {
        recordedStart(e)
        recordStart.textContent = "Stop Recording"
        paused.disabled = false

    }
    else {
        recordStart.textContent = "Record Start"
        recordedStop(e)
    }
})




// ===================Get User Media =======================
btn.onclick = async function (e) {


    if (navigator.mediaDevices == undefined) {
        alert("your browser not supported media devices")
    }
    try {
        console.log(await navigator.mediaCapabilities)
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        localStream = stream
        if ("srcObject" in localVideo) {
            localVideo.srcObject = stream

        }
        else {
            // old browser support
            localVideo.src = stream
        }
        localVideo.play()
        recordStart.disabled = false
    } catch (err) {
        // if(err.name)
        console.log(err.name, err.message)
        if (err.name == "NotAllowedError") {
            alert("enable camera and audio")
        }
        throw new Error(err)
    }
}





///========================PAUSED/ RESUME==================

paused.addEventListener("click", (e) => {
    console.log(mediaRecorder.state)
    if (paused.textContent === "Pause") {
        mediaRecorder.pause()
        paused.textContent = "Resume"
    }
    else {
        mediaRecorder.resume()
        paused.textContent = "Pause"
    }
})






// =========================PLAY RECORDED VIDEO==============
playVideo.addEventListener("click", (e) => {
    try {
        const blob = new Blob(storeBlob, { type: "video/mp4" })
        recordedVideo.src = window.URL.createObjectURL(blob)
        recordedVideo.play()
        recordedVideo.style.display = "block"
    } catch (err) {
        console.log(err)

    }
})


//==========================ENDED VIDEO=====================
endedVideo.addEventListener("click", (e) => {
    localStream.getVideoTracks()[0].onended = function (e) {
        console.log(e)
        alert("video is ended")
    }
})

//========================Screen Share=================
shareScreen.addEventListener("click", async (e) => {
    try {
        const constaints = {
                width: { exact: 300 },
                height:{exact:350}
        }
        const stream = await navigator.mediaDevices.getDisplayMedia(constaints)
        localStream = stream
        console.log(stream)
        const video =document.createElement("video")
        video.id= "share"
        video.style.display=stream.active ?"block":document.removeChild("video")
        video.srcObject= stream
        video.width= "300"
        video.height="400"
        video.play()
        Container.appendChild(video)
        stream.getVideoTracks()[0].addEventListener("ended",(e)=>{
            alert("screen share is ended")
        })
    } catch (err) {
        console.log(err)
    }
})
