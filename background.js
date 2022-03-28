//Popup shows on youtube.com/watch
chrome.runtime.onInstalled.addListener(function () {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page's URL contains 'youtube.com/watch' ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: "youtube.com/watch" },
                    }),
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});

// Set up port listener and their respective on message listeners
// setup When another part of extension calls "connect()", this event is fired, along with the runtime.Port object you can use to send and receive messages through the connection.
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "content-bkg") {
        window.content_port = port;
        // setTimeout(() => {
        //     window.content_port.postMessage({
        //         data: "start webcam",
        //         url: chrome.extension.getURL("inject-vid.js"),
        //     });
        // }, 2000);
        // Send message
        port.postMessage({ data: "background port opened" });

        port.onMessage.addListener((msg) => {
            // console.log(msg);
            if (msg.status === "connected") {
                port.postMessage({ data: "background response" });
                console.log("bkg response sent");
            } else if (msg.data === "content handshake") {
                port.postMessage({ data: "background handshake" });
                console.log("handshake confirmed");
            }
            // window.content_port.postMessage(msg);
        });
    } else if (port.name === "popup-port") {
        // This might introduce a bug if window.content_port is not opened before the popup port,
        // but it shouldnt be a problem right because the content loads automatically first
        port.onMessage.addListener((msg) => {
            console.log(msg);
            if (msg.status === "connected") {
                port.postMessage({ data: "background response" });
                console.log("popup port opened");
            } else if (msg.data === "start video") {
                window.content_port.postMessage({ data: "start video" });
            } else if (msg.data === "stop video") {
                window.content_port.postMessage({ data: "stop video" });
            } else if (msg.data === "restart video") {
                window.content_port.postMessage({ data: "restart video" });
            } else if (msg.data === "start webcam") {
                setupWebcam();
            }
        });
    }
});

("use strict");

function setupWebcam() {
    console.log("test webcam setup");
    // navigator.mediaDevices
    //     .getUserMedia({
    //         video: true,
    //         audio: true,
    //     })
    //     .then((stream) => {
    //         chrome.storage.local.set(
    //             {
    //                 camAccess: true,
    //             },
    //             () => {}
    //         );
    //         document.querySelector("button#start").disabled = true;
    //         document.querySelector("button#record").disabled = false;
    //         window.stream = stream;

    //         const gumVideo = document.querySelector("video#gum");
    //         gumVideo.srcObject = stream;

    //         getSupportedMimeTypes().forEach((mimeType) => {
    //             const option = document.createElement("option");
    //             option.value = mimeType;
    //             option.innerText = option.value;
    //             codecPreferences.appendChild(option);
    //         });
    //         codecPreferences.disabled = false;
    //     })
    //     .catch((e) => {
    //         document.querySelector("#status").innerHTML = e.toString();
    //         console.error(e);
    //     });
}

// function getSupportedMimeTypes() {
//     const possibleTypes = [
//         "video/webm;codecs=vp9,opus",
//         "video/webm;codecs=vp8,opus",
//         "video/webm;codecs=h264,opus",
//         "video/mp4;codecs=h264,aac",
//     ];
//     return possibleTypes.filter((mimeType) => {
//         return MediaRecorder.isTypeSupported(mimeType);
//     });
// }

// document.addEventListener("DOMContentLoaded", () => {
//     setupWebcam();
// });

//Request webcam access from user upon installation
//Implement stopWebcam()
