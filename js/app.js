const socket = io();
let localStream;
let remoteStream;
let peerConnection;
const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

document.getElementById('createRoomForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roomTitle = document.getElementById('roomTitle').value;
    socket.emit('createRoom', roomTitle);
});

socket.on('created', async (room) => {
    document.getElementById('videoSection').classList.remove('d-none');
    await startWebRTC(room);
});

socket.on('joined', async (room) => {
    document.getElementById('videoSection').classList.remove('d-none');
    await startWebRTC(room);
});

socket.on('signal', async (data) => {
    if (data.signal.type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('signal', { signal: answer, room: data.room });
    } else if (data.signal.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
    } else if (data.signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
    }
});

async function startWebRTC(room) {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('localVideo').srcObject = localStream;

    peerConnection = new RTCPeerConnection(servers);
    peerConnection.ontrack = (event) => {
        document.getElementById('remoteVideo').srcObject = event.streams[0];
    };

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', { signal: event.candidate, room });
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('signal', { signal: offer, room });
}

document.getElementById('leaveRoom').addEventListener('click', () => {
    socket.emit('leaveRoom', room);
    peerConnection.close();
    document.getElementById('videoSection').classList.add('d-none');
});
