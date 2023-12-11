import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream | null, handleMute: () => void, mute?: boolean }> = ({ stream, handleMute, mute }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    // const [mute, setMute] = useState(true);

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
                // muted={true}
                muted={false} 
            />
            <button
                type="button"
                onClick={() => handleMute()}
                // onClick={() => setMute(!mute)}
                className="absolute bottom-2 right-2 text-xs bg-rose-400 px-2 py-2 rounded-lg"
            >
                {mute ? 'Mute' : 'Unmute'}
            </button>
        </div>
    );
};
