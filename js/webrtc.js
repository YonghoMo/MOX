const socket = io();

let localStream;
let remoteStream;
let peerConnection;
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const statusDiv = document.getElementById('status');

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Join Room
joinBtn.onclick = () => {
    const room = roomInput.value;
    if (room) {
        socket.emit('join', room);
    }
};

socket.on('waiting', (message) => {
    statusDiv.innerText = message;
});

socket.on('ready', () => {
    statusDiv.innerText = 'Ready for the call.';
    startCall();
});

socket.on('signal', async (data) => {
    if (data.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('signal', { answer, room: roomInput.value });
    } else if (data.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.iceCandidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
    }
});

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', { iceCandidate: event.candidate, room: roomInput.value });
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('signal', { offer, room: roomInput.value });
}
