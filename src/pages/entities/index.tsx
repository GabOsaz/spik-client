import { AudioPlayer } from '../../components/players/audioPlayer';
import Timer from '../call/view/Timer';
import useEntitiesLogic from './controller/useEntitiesLogic';
import ChatComp from '../../components/chat';

function CompanyReceiveCall() {
    const {
        handleMute,
        handleEndCall,
        answerCall,
        showTimer,
        isMuted,
        isCalling,
        companyId,
        remoteStream,
        incomingCall,
        stream,
    } = useEntitiesLogic();

//   const {
//     stream,
//     remoteStream,
//     isCalling,
//     isMuted,
//     incomingCall,
//     showTimer,
//     // makeCall,
//     answerCall,
//     handleMute,
//     handleEndCall,
//   } = useCallLogic(companyId);
console.log(incomingCall);
console.log(remoteStream);

  return (
    // <CallProvider>
        <div className="h-screen pt-12">
            <div className="relative h-[80%] w-full md:w-1/2 lg:w-1/4 py-4 px-3 md:border border-[rgb(41,56,79)] rounded-3xl mx-auto flex items-center justify-center">
                <div className="">
                    {isCalling && 
                    <div>
                        <span> Calling {companyId}...</span>
                    </div>}
                    {remoteStream &&
                        <div className="flex flex-col items-center">
                            {showTimer &&
                            <div className="mt-4 mb-6 w-64 text-center">
                                <Timer />
                            </div>}
                            <div className="">
                                <AudioPlayer stream={remoteStream} handleMute={handleMute} isMuted={isMuted} />
                            </div>
                            <div className="absolute bottom-6">
                                <div className="flex justify-center space-x-6">
                                    <button
                                        type="button"
                                        onClick={handleMute ? () => handleMute() : () => null}
                                        className="mt-4 text-xs bg-rose-400 px-2 py-2 rounded-lg"
                                    >
                                        {isMuted ? 'Unmute' : 'Mute'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEndCall ? () => handleEndCall() : () => null}
                                        className="mt-4 text-xs border border-rose-400 text-rose-400 bg-transparent px-2 py-2 rounded-lg"
                                    >
                                        End
                                    </button>
                                </div>
                            </div>
                        </div>
                    }

                        {/* <button
                            type="button"
                            onClick={() => dataConnection.send('data', 'helloooooo')}
                            // onClick={() => setMute(!mute)}
                            className="mt-4 text-xs bg-green-500 px-2 py-2 rounded-lg"
                        >
                            Say hello
                        </button> */}

                    {incomingCall && (
                        <div className="space-y-4 text-center">
                            <p>Incoming call</p>
                            <button
                                type="button"
                                onClick={() => answerCall(incomingCall)}
                                // onClick={() => setMute(!mute)}
                                className="mt-4 text-xs bg-green-500 px-2 py-2 rounded-lg"
                            >
                                Answer
                            </button>
                        </div>
                    )}

                    {(!isCalling && !remoteStream && !incomingCall) && (
                        <h2 className="animate-bounce">Awaiting calls</h2>
                    )}
                </div>
            </div>

            {/* <ChatComp /> */}
        </div>
    // </CallProvider>
  )
}

export default CompanyReceiveCall;
