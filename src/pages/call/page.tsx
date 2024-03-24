import { useLocation } from 'react-router-dom';
import { AudioPlayer } from '../../components/players/audioPlayer';
import useCallLogic from './controller/useCallLogic';
import useTimer from '../../globalHooks/useTimer';
import { useEffect } from 'react';
import Timer from './view/Timer';

function Call() {
  const { 
    pathname,
  } = useLocation();
  const companyId = pathname.split('/')[2]

  const {
    stream,
    remoteStream,
    isCalling,
    isMuted,
    incomingCall,
    showTimer,
    // makeCall,
    answerCall,
    handleMute,
    handleEndCall,
  } = useCallLogic(companyId);
  console.log(remoteStream);
  console.log(isCalling);

  return (
    <div className="h-screen pt-12">
        <div className="relative h-[80%] w-full md:w-1/2 lg:w-1/4 py-4 px-3 md:border border-[rgb(41,56,79)] rounded-3xl mx-auto flex items-center justify-center">
            <div className="">
                {isCalling &&
                <div className="text-center">
                    <span> Calling {companyId}...</span>
                </div>}
                {remoteStream &&
                    <div className="flex flex-col items-center">
                        {showTimer &&
                        <div className="mt-4 mb-6 w-64 text-center">
                            <Timer />
                        </div>}
                        <div className="">
                            <AudioPlayer stream={stream} handleMute={handleMute} isMuted={isMuted} />
                        </div>
                        <div className="absolute bottom-6">
                            <div className="flex space-x-6">
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

                {incomingCall && (
                    <button
                        type="button"
                        onClick={() => answerCall(incomingCall)}
                        // onClick={() => setMute(!mute)}
                        className="mt-4 text-xs bg-green-500 px-2 py-2 rounded-lg"
                    >
                        Answer
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default Call;
