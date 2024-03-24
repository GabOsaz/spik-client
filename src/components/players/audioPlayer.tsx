import { useEffect, useRef } from "react";

export const AudioPlayer: React.FC<{ stream?: MediaStream | null, handleMute?: () => void, isMuted?: boolean }> = (
    { stream, handleMute, isMuted }) => {
    const audioRef = useRef<HTMLVideoElement>(null);
    console.log(stream);

    useEffect(() => {
        if (audioRef.current && stream) audioRef.current.srcObject = stream;
    }, [stream]);
    return (
        <div className="w-full relative">
            <audio
                data-testid="peer-video"
                style={{ width: "100%" }}
                ref={audioRef}
                autoPlay
                controls={false}
                // muted={true}
                // muted={isMuted}
            />
            
        </div>
    );
};
