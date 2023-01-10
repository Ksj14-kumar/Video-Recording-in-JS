const btn = document.getElementById("btn")
const localVideo = document.getElementById("localVideo")
const recordedVideo = document.getElementById("recordVideo")
const recordStart = document.getElementById("recordbtn")
const stopRecording = document.getElementById("stopRecording")
constraints = {
    video: {
        width: { exact: 340 },
        height: { exact: 300 }
    },
    audio: false
}


let localStream, mediaRecorder, storeBlob;









// Recording Stream start==================================
recordStart.addEventListener("click", (e) => {
    if (recordStart.textContent == "Record Start") {
        try {
            mediaRecorder = new MediaRecorder(localStream)
            mediaRecorder.start()
            console.log(mediaRecorder.state)
            recordStart.disabled = true
            return

        } catch (err) {
            console.log("not get camera", err)
            return

        }

    }

})



// ===================Stop Recording Devices===================

stopRecording.addEventListener("click", (e) => {
    storeBlob = []
    mediaRecorder.stop()
    mediaRecorder.ondataavailable = (e) => {
        storeBlob.push(e.data)
    }
    mediaRecorder.onstop = (e) => {
        console.log(e)
        const blob = new Blob(storeBlob, { type: "video/mp4" })
        const url = window.URL.createObjectURL(blob)
        recordedVideo.src= url
        recordedVideo.style.display= "block"
        
    }
})











// ===================Get User Media =======================
btn.onclick = async function (e) {
    if(navigator.mediaDevices==undefined){
        alert("your browser not supported media devices")
    }
    try {
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