import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./components/VideoPlayer";

const App = () => {
    const [peerId, setPeerId] = useState('');
    const id = (window?.location?.search?.substring(4));
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    // const [peer, setPeer] = useState<Peer>();
    const peerInstance = useRef<Peer>();
    // let stream = useRef<MediaStream | null>(null);
    // let remoteStream = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [mute, setMute] = useState(true);
    const [remoteMute, setRemoteMute] = useState(true);
    const [shouldAnswerCall, setShouldAnswerCall] = useState(false);
    const [incomingCall, setIcomingCall] = useState(false);

    console.log(stream);
    console.log(remoteStream);
    // const elvis = '232e2213-6a64-437f-9c2a-282ea678a1de';
    // console.log(stream?.current?.getTracks()[1].enabled);
    // console.log(remoteStream.current?.getTracks()[0]?.enabled);
    console.log(peerInstance?.current?.connections);
    console.log(peerInstance.current);

    useEffect(() => {
        
        let peer = new Peer(id);
        peer.on('open', (id) => {
          peerInstance.current = peer;
          setPeerId(id)
          console.log(id);
        });
    
        // peerInstance.current = peer;
        // setPeer(peer);

        const getDeviceStream = async () => {
            try {
              const mediaStream = await navigator?.mediaDevices?.getUserMedia({ video: true, audio: true });
              setStream(mediaStream);
              console.log(mediaStream);
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    }, [])

    useEffect(() => {
        const handleIncomingCall = () => {
            // try {
                // console.log(shouldAnswerCall);
                peerInstance?.current?.on('call', (call) => {
                setIcomingCall(true);
                // if (shouldAnswerCall === true) {
                    console.log('here >>>')
                    stream && call.answer(stream);
                    call.on('stream', (incomingStream) => {
                        setRemoteStream(incomingStream);
                    })
                // }    
                })
            // } catch (error) {
            //     console.error(error);
            // }
        }
        handleIncomingCall();
    
      return () => {
        
      }
    }, [shouldAnswerCall, stream])
    
    const call = (remotePeerId: string) => {
      console.log(remotePeerId, 'here')

      let peer = peerInstance.current;
        const getDeviceStream = async () => {
            console.log(id);
            try {
                const mediaStream = await navigator?.mediaDevices?.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                console.log(peer?.destroyed);

                let call = peer?.call(remotePeerId, mediaStream)
                // const call = peerInstance?.current && peerInstance?.current.call(remotePeerId, mediaStream)
                console.log(call);
                call?.on('stream', (incomingStream: MediaStream) => {
                    console.log('here >>>')
                    if (incomingStream === undefined) {
                        console.log(incomingStream);
                        getDeviceStream();
                    } else {
                        // remoteStream.current = incomingStream;
                        setRemoteStream(incomingStream);
                        console.log(incomingStream);
                        console.log('Connected to ' + call?.peer);
                    }
                });
                call?.on('error', (error) => {
                    console.log("call error", error);
                    // removeRemoteStream(call.peer);
                    // call.close();
                });
                console.log('here >>>')
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    }

    const handleEndCall = () => {
    //     Object.keys(peerInstance?.current?.connections).map((conn: string) => {
    //   if (peerInstance?.current?.connections[conn][0]) peerInstance?.current?.connections[conn][0].close();
    // });
        const call = peerInstance?.current;
        call && call.disconnect()
        console.log(call, 'here >>>')
        setStream(null);
        setRemoteStream(null)
    };

    const handleMute = (isRemote?: string) => {
        console.log(isRemote);
        const hostTrack = stream?.getTracks()?.find(track => track.kind === 'audio');
        const remoteTrack = remoteStream?.getTracks().find((track: any) => track.kind === 'audio');
        if (isRemote) {
            console.log('here')
            setRemoteMute((init) => !init);
            if (remoteTrack?.enabled) {
                remoteTrack.enabled = false;
            } else if (remoteTrack?.enabled === false){
                remoteTrack.enabled = true;
            }
            // return !remoteStream?.current?.getTracks()?.find((track: any) => track.kind === 'audio')?.enabled;
        } else {
            console.log('here')
            setMute((init) => !init);
            if (hostTrack?.enabled) {
                hostTrack.enabled = false;
            } else if (hostTrack?.enabled === false){
                hostTrack.enabled = true;
            }
        }
    }
    console.log(remoteStream);
    
    return (
        <div className="App flex flex-col space-y-4 items-center justify-center w-screen h-screen">
            {/* <Join /> */}
            {/* {incomingCall && !remoteStream &&
                <>
                    <p> Incoming call... </p>
                    <button onClick={() => setShouldAnswerCall(true)}>Join</button>
                </>
            } */}
            {/* <h1>Current user id is {peer?.id}</h1> */}
            <h1>Current user id is {peerInstance?.current?.id}</h1>
            <input className="border border-gray-500 text-black px-4 py-2" type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
            <button 
                className="border rounded px-4 py-3 disabled:cursor-not-allowed" 
                onClick={() => call(remotePeerIdValue)}
                // onClick={() => call(elvis)}
                // disabled={!!remoteStream.current}
            >
                {remoteStream ? 'On call' : 'Call'}
            </button>
            <div className="flex space-x-4">
                {stream && 
                <div>
                    <VideoPlayer mute={mute} handleMute={() => handleMute()} stream={stream} />
                </div>}
                {remoteStream &&
                <div className="border border-green-500">
                    <VideoPlayer mute={remoteMute} handleMute={() => handleMute('isRemote')} stream={remoteStream} />
                </div>}
            </div>
            {remoteStream &&
            <button 
                className="border rounded px-4 py-3 bg-red-500 cursor-pointer text-white" 
                onClick={() => handleEndCall()}
            >
                End call
            </button>}
        </div>
    );
};

export default App;
