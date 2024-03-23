import Peer from 'peerjs';
import React, {
    createContext, useCallback, useEffect, useState,
  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  interface CallProps {
    handleMute: () => void,
    handleEndCall: () => void,
    answerCall: (call: any) => void,
    remoteStream: null | MediaStream | undefined,
    stream: null | MediaStream,
    showTimer: boolean,
    isMuted: boolean,
    isCalling: boolean,
    companyId: string,
    incomingCall: null,
  }
  
  const CallContext = createContext<CallProps>({
    handleMute: () => {},
    handleEndCall: () => {},
    answerCall: () => {},
    remoteStream: null,
    stream: null,
    showTimer: false,
    isMuted: false,
    isCalling: false,
    companyId: '',
    incomingCall: null,
  });
  const { Provider } = CallContext;
  
  function CallProvider({ children }: { children: React.ReactNode}) {
    const [me, setMe] = useState<any>();
    const [stream, setStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [isMuted, setIsMuted] = useState(true);
    const [id, setId] = useState('');
    const [incomingCall, setIncomingCall] = useState<any>();
    const [isCalling, setIsCalling] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const navigate = useNavigate();
    const {
        pathname,
      } = useLocation();
    const companyId = pathname.split('/')[2]

    // const hostId = (window?.location?.search?.substring(4));
    console.log(incomingCall);
    console.log(me);

    const makeCall = useCallback((remotePeerId: string) => {
        console.log(remotePeerId, 'here')
        const callAction =  () => {
            console.log(id);
            try {
                let call = me?.call(remotePeerId, stream, {
                    metadata: {
                        id,
                        name: 'Omzy',
                    },
                });
                console.log(call);
                if(call) {
                    setIsCalling(true);
                }
                call?.on('stream', (incomingStream: MediaStream) => {
                    console.log('here >>>')
                    if (incomingStream === undefined) {
                        console.log(incomingStream);
                        // callAction();
                    } else {
                        // setRemoteStream(incomingStream);
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
        let peer = new Peer(companyId, {
            host: "localhost",
            port: 9000,
            path: "/myapp",
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

    const handleEndCall = () => {
        incomingCall?.close();
        remoteStream?.getTracks().forEach((track) => track.stop());
        stream?.getTracks().forEach((track: any) => track.stop());
        setRemoteStream(null);
        navigate('/entities')
    };
  
    return (
      <Provider
        value={{
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
        }}
      >
        {children}
      </Provider>
    );
  }
  
  export { CallContext, CallProvider };
  