/* eslint-disable @typescript-eslint/no-unused-expressions */
import Peer from "peerjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./components/VideoPlayer";
import socketIO from 'socket.io-client';
import { Chat } from "./components/chat/Chat";
import { CallNav } from "./components/sideNav/CallNav";

const App = () => {
    // const [peerId, setPeerId] = useState('');
    const id = (window?.location?.search?.substring(4));
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const peerInstance = useRef<Peer>();
    const [stream, setStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [mute, setMute] = useState(true);
    const [remoteMute, setRemoteMute] = useState(true);
    const [me, setMe] = useState<any>();
    const [currCall, setCurrCall] = useState<any>(null);
    // const [shouldAnswerCall, setShouldAnswerCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState<any>([]);
    // const [callerId, setCallerId] = useState('');
    const inComingCallQueues = useRef<any>([]);
    const [callQueue, setCallQueue] = useState<any>([]);
    const [chatMessages, setChatMessages] = useState<any>([])
    console.log(callQueue);

    const socket = socketIO('http://localhost:8080');

    // const [messages, setMessages] = useState<any>([]);

    useEffect(() => {
        socket.on('messageQueue', (data: any) => setChatMessages([...chatMessages, data]));

        return () => {
            // socket.off('messageQueue');
            // me?.disconnect();
        }
    }, [socket, chatMessages, me]);

    console.log(me ? Object.keys(me?.connections) : {});
    console.log(inComingCallQueues?.current?.map((each: any) => each?.peer));
    console.log(incomingCall?.map((each: any) => each?.peer));
    const [hash, setHash] = useState<{ [char: string]: number }>({});
    const handleDuplicate = useCallback(() => {
        console.log(incomingCall?.map((each: any) => each?.peer));
        for (let i = 0; i < incomingCall?.length; i++) {
        let hash: { [char: string]: number } = {};
        const noDuplicateArr = [];
        const element = incomingCall[i];
        if(!hash[element.peer]) {
            const newPeer = {
                [element.peer]: 1
            }
            setHash(newPeer);
        }
        console.log(hash);
        }
    }, [incomingCall]);

    useEffect(() => {
        
        let peer = new Peer(id, { debug: 3 });
        peer.on('open', (id) => {
          peerInstance.current = peer;
          setMe(peer);
        //   setPeerId(id);
          console.log(id);
        });

        peer.on('error', (error) => {
            if (error?.type === 'unavailable-id') {
                peer.reconnect();
            }
            console.log(error)
        });

        peer?.on('close', () => {
            setCurrCall(null);
            console.log('here',);
        })
    
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
    }, [id, me]);

    // useEffect(() => {
    //     peerConnectionInstance?.current?.on('data', function(data: string) {
    //         console.log('Received', data);
    //       });
    //   return () => {};
    // }, [])

    const answerCall = (call: any) => {
        console.log(incomingCall?.map((each: any) => each?.peer));
        stream && call?.answer(stream);
        call?.on('stream', (incomingStream: MediaStream) => {
            setRemoteStream(incomingStream);
        })
        setCurrCall(call);
    }
    console.log(stream);

    useEffect(() => {
        const handleIncomingCall = () => {
            // try {
                // console.log(shouldAnswerCall);
                // peerInstance?.current?.disconnect();

                // peerInstance?.current?.on('call', (call) => {
                me?.on('call', (call: any) => {
                    // const { id: callerId } = call;
                    // setCallerId(callerId);
                    // setShouldAnswerCall(true);
                    setIncomingCall((prev: any) => [...prev, call]);
                    // socket.emit('newCall', call);

                    console.log(call);
                    console.log(inComingCallQueues?.current?.some((each: any) => each?.peer === call?.peer));
                    // setIncomingCallQueues((init: any) => init?.some((each: any) => each === call?.peer) ? [...init] : [...init, call]);
                    if (inComingCallQueues?.current?.some((each: any) => each?.peer === call?.peer)) {
                        console.log(call?.peer);
                    } else {
                        inComingCallQueues.current = [...inComingCallQueues.current, call]
                    }
                })
            // } catch (error) {
            //     console.error(error);
            // }
        }
        handleIncomingCall();
    
      return () => {
        
      }
    }, [me, inComingCallQueues])
    
    const makeCall = (remotePeerId: string) => {
        console.log(remotePeerId, 'here')
        let peer = me;
        const getDeviceStream =  () => {
            console.log(id);
            try {
                let call = peer?.call(remotePeerId, stream, {
                    metadata: {
                        id,
                    },
                });
                console.log(call);
                call?.on('stream', (incomingStream: MediaStream) => {
                    console.log('here >>>')
                    if (incomingStream === undefined) {
                        console.log(incomingStream);
                        getDeviceStream();
                    } else {
                        setRemoteStream(incomingStream);
                        console.log(incomingStream);
                        console.log('Connected to ' + call?.peer);
                    }
                });
                call?.on('error', (error: any) => {
                    console.log("call error", error);
                });
                call?.on('close', (param: any) => {
                    console.log("call closed", param);
                });
                console.log('here >>>')
            } catch (error) {
                console.error(error);
            }
        }
        getDeviceStream();
    }

    const handleEndCall = () => {
        currCall?.close();
        setIncomingCall((prev: any) => prev?.filter((call: any) => call?.peer !== currCall?.peer));
        setCurrCall(null);
        remoteStream?.getTracks().forEach((track) => track.stop());
    };
    console.log(remoteStream);

    const handleMute = (isRemote?: string) => {
        console.log(isRemote);
        const hostTrack = stream?.getTracks()?.find((track: { kind: string; }) => track.kind === 'audio');
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

    function getUnique(arr: any, index: string) {

        const unique = arr
             .map((e: any) => e[index])
      
             // store the keys of the unique objects
             .map((e: any, i: number, final: any) => final.indexOf(e) === i && i)
        
             // eliminate the dead keys & store unique objects
            .filter((e: any) => arr[e]).map((e: any) => arr[e]);
            console.log(unique?.map((each: any) => each?.peer));   
      
         return unique;
    }

    const uniqueCallQueue = getUnique(incomingCall, 'peer');
    // useEffect(() => {
    //     uniqueCallQueue?.map((call: any) => {
    //         return socket.emit('updateCallQueue', JSON.stringify(call))
    //     })
    //     return () => {};
    // }, [uniqueCallQueue, socket, me]);
    
    const [nums, setNums] = useState([1,2,3,4,5])
    const [currNum, setCurrNum] = useState<number>();
    const handleClick = (num: number, index: number) => {
        let reArranged = nums;
        const firstNum = nums[0];
        reArranged[0] = num;
        reArranged[index] = firstNum;
        setNums(reArranged);
        setCurrNum(num);
    }

    return (
        <div className="App flex space-y-4 items-center justify-center w-screen h-screen">
            <div className="">
                <CallNav />
            </div>

            {uniqueCallQueue?.length ?
            <div className="fixed right-4 top-8 p-4 w-72">
                <div className="bg-white rounded-lg shadow-xl p-4">
                    <h2 className="text-center"> Call Queue </h2>
                    {getUnique(incomingCall, 'peer')?.map((call: any) => (
                        <div key={call?.peer} className="flex items-center justify-between px-4 py-3 mt-4 border border-b">
                            <span>{call?.peer}</span>
                            <button 
                                className="bg-green-600 rounded-lg text-white text-xs px-3 py-2" type="button" 
                                onClick={() => answerCall(call)}
                            >
                                Answer
                            </button>
                        </div>
                    ))}
                </div>
            </div> : null}

                        {/* <Join /> */}
            {/* {incomingCall[1] && !remoteStream &&
                <>
                    <p> Incoming call... </p>
                    <button onClick={() => answerCall()}>Join</button>
                    <button onClick={() => setShouldAnswerCall(true)}>Join</button>
                </>
            } */}
            <div className="">
                <h1>Current user id is {me?.id}</h1>
                {/* <h1>Current user id is {peerInstance?.current?.id}</h1> */}
                <div className="flex flex-col items-center space-y-6 mt-4">
                    <input className="border border-gray-500 text-black px-4 py-2" type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
                    {!currCall ?
                    <button
                        className="relative rounded px-4 py-3 disabled:cursor-not-allowed" 
                        onClick={() => makeCall(remotePeerIdValue)}
                        // onClick={() => call(elvis)}
                        // disabled={!!remoteStream.current}
                    >
                        Call
                    </button> : currCall ? `On call with ${currCall?.peer}` : null}
                </div>
            </div>
            <div className="flex space-x-4 mt-4">
                {stream && 
                <div>
                    <VideoPlayer mute={mute} handleMute={() => handleMute()} stream={stream} />
                </div>}
                {remoteStream &&
                <div className="border border-green-500">
                    <VideoPlayer mute={remoteMute} handleMute={() => handleMute('isRemote')} stream={remoteStream} />
                </div>}
            </div>

            {/* {currCall && ( */}
                <div className="border-l-2 pb-28 absolute right-6 bottom-5">
                    <Chat socket={socket} userId={id} messages={chatMessages} />
                </div>
            {/* )} */}
            
            {currCall &&
            <button 
                className="border rounded px-4 py-3 bg-red-500 cursor-pointer text-white" 
                onClick={() => handleEndCall()}
            >
                End call
            </button>}

            {nums.map((each, index) => (
                <div key={each} className="flex space-x-4">
                    <span onClick={() => handleClick(each, index)} className={`${(currNum !== undefined && each <= currNum) ? 'text-orange-500' : 'text-white'} cursor-pointer text-5xl`}>
                        {each}
                    </span>
                </div>
            ))}

            {/* <IntervalExample /> */}
            
        </div>
    );
};

const IntervalExample = () => {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [secondsCountDown, setSecondsCountDown] = useState(0)
    const [minutesCD, setMinutesCD] = useState(0);
    const [hrsCD, setHrsCD] = useState(0);
    const [formattedTime, setFormattedTime] = useState<string>('');
    const totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);

    useEffect(() => {
        const interval = setInterval(() => {
            const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
            const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
            const secs = String(Math.floor(timeLeft % 60)).padStart(2, '0');
            const fTime = `${hrs}:${mins}:${secs}`;
            setTimeLeft((init: number) => init - 1);
            if (timeLeft > 0) {
                setFormattedTime(fTime);
            }
        }, 1000)
        return () => clearInterval(interval);
    }, [timeLeft]);
  
    useEffect(() => {
        const secondsInterval = setInterval(() => {
            if (secondsCountDown === 0 && minutesCD !== 0) {
                setSecondsCountDown(60);
            } else if (secondsCountDown > -1) {
                setSecondsCountDown(seconds => seconds - 1);
            }
        }, 1000);
        return () => clearInterval(secondsInterval);
    }, [minutesCD, secondsCountDown]);

    useEffect(() => {
        const minutesInterval = setInterval(() => {
            if (minutesCD > 0) {
                setMinutesCD(mins => mins - 1);
            }
        }, 1000 * 60);
        return () => clearInterval(minutesInterval);
    }, [minutesCD]);

    useEffect(() => {
        const hrsInterval = setInterval(() => {
            if (hrsCD > 0) {
                setHrsCD(mins => mins - 1);
            }
        }, 1000 * 60 * 60);
        return () => clearInterval(hrsInterval);
    }, [hrsCD]);

    const handleBtnClick = () => {
        setHrsCD(hours);
        setMinutesCD(minutes);
        setSecondsCountDown(seconds);
  
    return (
      <div className="App">
        <div>
            <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
            <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
            <input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} />
            <button type="button" onClick={handleBtnClick}> Click </button>
        </div>
        <header className="App-header">
          {/* {seconds} seconds have elapsed since mounting. */}
          {formattedTime}
        </header>
      </div>
    )
}};

export default App;
