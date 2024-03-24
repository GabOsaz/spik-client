import { useCallback, useEffect, useState } from 'react'
import Peer from 'peerjs';
import { useLocation, useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';

function useEntitiesLogic() {
    const [me, setMe] = useState<any>();
    const [stream, setStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [isMuted, setIsMuted] = useState(false);
    const [id, setId] = useState('');
    const [incomingCall, setIncomingCall] = useState<any>();
    const [isCalling, setIsCalling] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [dataConnection, setDataConnection] = useState<any>();
    const [socketInstance, setSocketInstance] = useState<any>(null);

    useEffect(() => {
        const socket = socketIO('https://spik-voice-server.onrender.com');
        setSocketInstance(socket);

        socket?.on('connect', () => {
            console.log('Connected to the chat server')
        })

        return () => {
            socketInstance?.disconnect();
        }
    }, []);
    
    const navigate = useNavigate();
    const {
        pathname,
      } = useLocation();
      const companyId = pathname.split('/')[2]

    const handleEndCall = useCallback(() => {
        socketInstance?.emit('end_call', id);
        incomingCall?.close();
        remoteStream?.getTracks().forEach((track) => track.stop());
        stream?.getTracks().forEach((track: any) => track.stop());
        setRemoteStream(null);
    // navigate('/entities')
    }, [incomingCall, remoteStream, stream]);

    // useEffect(() => {
    //     console.log('here');
    //     socket.connect();

    // return () => {
    //     socket.disconnect()
    // };
    // }, []);

    useEffect(() => {
    // socket.on('messageQueue', (data: any) => setChatMessages([...chatMessages, data]));
        console.log('here');
        const onCallEndedFn = (endCallInitiatorId: string) => {
            console.log(endCallInitiatorId, 'here');
            if (endCallInitiatorId !== id) {
                handleEndCall()
            }
            return null;
        };
        socketInstance?.on('call_ended', onCallEndedFn);

    return () => {
        socketInstance?.off('call_ended', onCallEndedFn)
    }
    }, [socketInstance]);

    // const hostId = (window?.location?.search?.substring(4));
    console.log(incomingCall);
    console.log(me);

    // const makeCall = useCallback((remotePeerId: string) => {
    //     console.log(remotePeerId, 'here')
    //     const callAction =  () => {
    //         console.log(id);
    //         try {
    //             let call = me?.call(remotePeerId, stream, {
    //                 metadata: {
    //                     id,
    //                     name: 'Omzy',
    //                 },
    //             });
    //             console.log(call);
    //             if(call) {
    //                 setIsCalling(true);
    //             }
    //             call?.on('stream', (incomingStream: MediaStream) => {
    //                 console.log('here >>>')
    //                 if (incomingStream === undefined) {
    //                     console.log(incomingStream);
    //                     // callAction();
    //                 } else {
    //                     // setRemoteStream(incomingStream);
    //                     console.log(incomingStream);
    //                     console.log('Connected to ' + call?.peer);
    //                 }
    //             });
    //             call?.on('error', (error: any) => {
    //                 console.log("call error", error);
    //             });
    //             call?.on('close', (param: any) => {
    //                 console.log("call closed", param);
    //                 setIsCalling(false);
    //             });
    //             console.log('here >>>')
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     callAction();
    // }, [id, me, stream])

    useEffect(() => {
        
        // let peer = new Peer(id, { debug: 3 });
        let peer = new Peer(companyId, {
            host: "0.peerjs.com",
            // host: "spik-peer-server.onrender.com",
            secure: true,
            // host: "localhost",
            port: 443,
            // port: 9999,
            // path: "/peerjs",
            debug: 3,
        });
        peer.on('open', (id) => {
          setMe(peer);
          setId(id);
          console.log(id);
        });

        peer.on('error', (error) => {
            if (error?.type === 'unavailable-id') {
                peer.reconnect();
            }
            console.log(error)
        });

        peer?.on('close', () => {
            // setCurrCall(null);
            console.log('here',);
        })

        const getDeviceStream = async () => {
            try {
              const mediaStream = await navigator?.mediaDevices?.getUserMedia({ video: false, audio: true });
              setStream(mediaStream);
            //   makeCall(companyId);
              console.log(mediaStream);
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    }, [companyId]);

    // useEffect(() => {
    //     const isAnExistingCompany = companies?.some((company: any) => company.name === companyId);
    //     if(stream && !isAnExistingCompany) {
    //         console.log('here');
    //         makeCall(companyId);
    //     }
    
    //     return () => {
    //         incomingCall?.close();
    //         remoteStream?.getTracks()?.forEach((track) => track.stop());
    //         stream?.getTracks()?.forEach((track: any) => track.stop());
    //         setRemoteStream(null);
    //     }
    // }, [companyId, incomingCall, remoteStream, stream])
    
    useEffect(() => {
        console.log('here');
        const handleIncomingCall = () => {
            me?.on('call', (call: any) => {
                setIncomingCall(call);
                console.log(call);
                setDataConnection(me?.connect(call.peer));
            })
        }
        handleIncomingCall();
    
      return () => {
        
      }
    }, [me])

    const answerCall = (call: any) => {
        // dataConnection.on('open', () => {
            dataConnection.send('Hello, call answered!')
        // })
        stream && call?.answer(stream);
        call?.on('stream', (incomingStream: MediaStream) => {
            setRemoteStream(incomingStream);
            setIncomingCall(null);
        })
        // setBeginTimer(true);
        setIsCalling(false);
        setShowTimer(true);
        // setCurrCall(call);
    }

    const handleMute = () => {
        const hostTrack = stream?.getTracks()?.find((track: { kind: string; }) => track.kind === 'audio');
        if (hostTrack?.enabled) {
            setIsMuted(true);
            return hostTrack.enabled = false;
        }
        setIsMuted(false);
        return hostTrack.enabled = true;
    }
  
    return {
        handleMute,
        handleEndCall,
        answerCall,
        showTimer,
        isMuted,
        isCalling,
        companyId,
        incomingCall,
        stream,
        remoteStream,
        dataConnection,
    };
}

export default useEntitiesLogic