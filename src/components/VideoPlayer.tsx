import { useEffect, useRef, useState } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mute, setMute] = useState(true);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <div className="w-full relative">
            <video
                data-testid="peer-video"
                style={{ width: "100%" }}
                ref={videoRef}
                autoPlay
                muted={mute} 
            />
            <button
                type="button"
                onClick={() => setMute(!mute)}
                className="absolute bottom-2 right-2 text-xs bg-rose-400 px-2 py-2 rounded-lg"
            >
                {mute ? 'Muted' : 'Mute'}
            </button>
        </div>
    );
};
