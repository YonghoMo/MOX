const socket = io();

let localStream;
let remoteStream;
let peerConnection = null;  // peerConnection 초기화를 null로 설정하여 정의
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const statusDiv = document.getElementById('status');

// ICE 서버 설정 (TURN 서버 포함)
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },  // Google STUN 서버
        {
            urls: 'turn:YOUR_TURN_SERVER_URL',    // 필요 시 TURN 서버 설정
            username: 'YOUR_USERNAME',
            credential: 'YOUR_CREDENTIAL'
        }
    ]
};

// Room에 참여
joinBtn.onclick = () => {
    const room = roomInput.value;
    if (room) {
        socket.emit('join', room);
    }
};

// 대기 메시지 수신
socket.on('waiting', (message) => {
    statusDiv.innerText = message;
});

// 준비 완료 시 호출
socket.on('ready', () => {
    statusDiv.innerText = 'Ready for the call.';
    startCall();
});

// 시그널링 처리 (offer, answer, iceCandidate 교환)
socket.on('signal', async (data) => {
    // peerConnection이 초기화되었는지 확인
    if (!peerConnection) {
        console.error("peerConnection is not initialized.");
        return;
    }

    try {
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
    } catch (err) {
        console.error("Error processing signal", err);
    }
});

// 통화 시작 함수
async function startCall() {
    // 로컬 스트림 얻기
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (err) {
        console.error("Error accessing media devices.", err);
        return;
    }

    // peerConnection 객체 생성
    peerConnection = new RTCPeerConnection(configuration);

    // 로컬 트랙 추가
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // 원격 트랙 수신 처리
    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    // ICE candidate 생성 시 처리
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', { iceCandidate: event.candidate, room: roomInput.value });
        }
    };

    // Offer 생성 및 전송
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('signal', { offer, room: roomInput.value });
    } catch (err) {
        console.error("Error creating offer", err);
    }
}
