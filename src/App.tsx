import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./components/VideoPlayer";

const App = () => {
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const peerInstance = useRef<Peer>();
    const [stream, setStream] = useState<MediaStream | null>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    console.log(stream);
    console.log(remoteStream);
    const id = (window?.location?.search?.substring(4));
    const elvis = 'elvis_123'
    console.log(stream ? stream.getVideoTracks()[0] : '')

    useEffect(() => {
        let peer = new Peer();
    
        peer.on('open', (id) => {
          setPeerId(id)
          console.log(id);
        });

        const getDeviceStream = async () => {
            try {
              const stream = await navigator?.mediaDevices?.getUserMedia({ video: true, audio: true });
              peer.on('call', (call) => {
                setStream(stream);
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                })
              })
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    
        peerInstance.current = peer;
      }, [id])

    const call = (remotePeerId: string) => {
      console.log(remotePeerId, 'here')

        const getDeviceStream = async () => {
            try {
                const stream = await navigator?.mediaDevices?.getUserMedia({ video: true, audio: true });
                setStream(stream);

                const call = peerInstance?.current && peerInstance?.current.call(remotePeerId, stream)
                call?.on('stream', (remoteStream: MediaStream) => {
                    if (remoteStream === undefined) {
                        console.log(remoteStream);
                        getDeviceStream();
                    } else {
                        setRemoteStream(remoteStream);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    }

    const handleEndCall = () => {
        const call = peerInstance?.current;
        call && call.disconnect()
        console.log(call, 'here >>>')
        setStream(null);
        setRemoteStream(null)
    }
    
    return (
        <div className="App flex flex-col space-y-4 items-center justify-center w-screen h-screen">
            {/* <Join /> */}
            <h1>Current user id is {peerId}</h1>
            <input className="border border-gray-500 text-black px-4 py-2" type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
            <button 
                className="border rounded px-4 py-3 disabled:cursor-not-allowed" 
                onClick={() => call(remotePeerIdValue)}
                // onClick={() => call(elvis)}
                disabled={!!remoteStream}
            >
                {remoteStream ? 'On call' : 'Call'}
            </button>
            <div className="flex space-x-4">
                {stream && 
                <div>
                    <VideoPlayer stream={stream} />
                </div>}
                {remoteStream &&
                <div>
                    <VideoPlayer stream={remoteStream} />
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
