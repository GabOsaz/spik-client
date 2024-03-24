import { useCallback, useEffect, useState } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import socketIO from 'socket.io-client';
import routeMap from "../../../routeMap";

const companies = [
    {
        name: 'MTN',
        logo: 'Mtn logo'
    },
    {
        name: 'AIRTEL',
        logo: 'Airtel logo'
    },
    {
        name: 'GLO',
        logo: 'Glo logo'
    },
    {
        name: 'UBA',
        logo: 'Uba logo'
    },
    {
        name: 'Etisalat',
        logo: 'Etisalat logo'
    },
]

function useCallLogic(companyId: string) {
    const [me, setMe] = useState<any>();
    const [stream, setStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [isMuted, setIsMuted] = useState(false);
    const [id, setId] = useState('id');
    const [incomingCall, setIncomingCall] = useState<any>();
    const [isCalling, setIsCalling] = useState(false);
    const [connectedCall, setConnectedCall] = useState(false);
    const [dataConnection, setDataConnection] = useState<any>();
    const [showTimer, setShowTimer] = useState(false);
    const [socketInstance, setSocketInstance] = useState<any>(null);

    useEffect(() => {
        const socket = socketIO('https://spik-voice-server.onrender.com');
        // const socket = socketIO('http://localhost:8080');
        setSocketInstance(socket);

        socket?.on('connect', () => {
            console.log('Connected to the chat server')
        })

        return () => {
            socketInstance?.disconnect();
        }
    }, []);

    const navigate = useNavigate();

    const hostId = (window?.location?.search?.substring(4));
    console.log(remoteStream, stream);

    const handleEndCall = useCallback(() => {
        socketInstance?.emit('end_call', id);
        incomingCall?.close();
        remoteStream?.getTracks().forEach((track) => track.stop());
        stream?.getTracks().forEach((track: any) => track.stop());
        setRemoteStream(null);
        navigate(routeMap.entitiesList);
        // window.location.reload();
    // navigate('/entities')
    }, [incomingCall, remoteStream, stream, socketInstance, id]);

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
    console.log(me);

    const makeCall = useCallback((remotePeerId: string) => {
        console.log(remotePeerId, 'here')
        const callAction =  async () => {
            console.log(id);
            try {
                let call = me?.call(remotePeerId, stream, {
                    metadata: {
                        id,
                        name: 'Omzy',
                    },
                });
                if(call) {
                    console.log(call);
                    setIsCalling(true);
                    setConnectedCall(call);
                }
                await call?.on('stream', (incomingStream: MediaStream) => {
                    console.log('here >>>')
                    if (incomingStream === undefined) {
                        console.log(incomingStream);
                        callAction();
                    } else {
                        setIsCalling(false);
                        setRemoteStream(incomingStream);
                        setShowTimer(true);
                        console.log(incomingStream);
                        console.log('Connected to ' + call?.peer);
                    }
                });
                call?.on('error', (error: any) => {
                    console.log("call error", error);
                });
                call?.on('close', (param: any) => {
                    console.log("call closed", param);
                    setIsCalling(false);
                });
                console.log('here >>>')
            } catch (error) {
                console.error(error);
            }
        }
        callAction();
    }, [id, me, stream])

    useEffect(() => {
        
        // let peer = new Peer(id, { debug: 3 });
        let peer = new Peer(id || '', {
            // host: "localhost",
            // host: "spik-peer-server.onrender.com",
            host: "0.peerjs.com",
            port: 443,
            // port: 9999,
            // path: "/peerjs",
            // secure: true,
            debug: 3,
            // host: "localhost",
            // port: 9000,
            // path: "/myapp",
        });
        peer.on('open', (id) => {
          setMe(peer);
          setId(id);
          console.log(id);
        });

        peer.on('error', (error) => {
            if (error?.type === 'unavailable-id') {
                peer?.reconnect();
            }
            if (error?.type === 'peer-unavailable') {
                alert('The contact is unavailable, please try again later');
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
                prompt('Unaible to fetch device media!');
                console.error(error);
            }
        }
        getDeviceStream();
    }, [hostId, id]);

    useEffect(() => {
        // const isAnExistingCompany = companies?.some((company: any) => company.name === companyId);
        console.log(companyId, 'here');
        if(stream) {
        // if(stream && !isAnExistingCompany) {
            console.log('here');
            makeCall(companyId);
        }
    
        return () => {
            // incomingCall?.close();
            // remoteStream?.getTracks()?.forEach((track) => track.stop());
            // stream?.getTracks()?.forEach((track: any) => track.stop());
            // setRemoteStream(null);
        }
    }, [companyId, stream])

    useEffect(() => {
        const handleIncomingCall = () => {
            me?.on('call', (call: any) => {
                setIncomingCall(call);
                console.log(call);
            })
        }
        handleIncomingCall();
    
      return () => {
        
      }
    }, [me])

    const answerCall = (call: any) => {
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

    // const handleEndCall = () => {
    //     incomingCall?.close();
    //     remoteStream?.getTracks().forEach((track) => track.stop());
    //     stream?.getTracks().forEach((track: any) => track.stop());
    //     setRemoteStream(null);
    //     navigate('/')
    // };

    return {
        stream,
        remoteStream,
        isMuted,
        isCalling,
        incomingCall,
        showTimer,
        makeCall,
        answerCall,
        handleMute,
        handleEndCall,
    }
}

export default useCallLogic;
