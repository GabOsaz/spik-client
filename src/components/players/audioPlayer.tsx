import { useEffect, useRef } from "react";
// 0903 565 8246
export const AudioPlayer: React.FC<{ stream?: MediaStream | null, handleMute?: () => void, isMuted?: boolean }> = (
    { stream, isMuted }) => {
    const audioRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (audioRef.current && stream) audioRef.current.srcObject = stream;

        // if (audioRef?.current && (audioRef?.current?.srcObject === undefined)) audioRef.current.srcObject = stream;
    }, [stream]);
    console.log(audioRef?.current?.srcObject);

    return (
        <div className="w-full relative">
            <audio
                data-testid="peer-video"
                style={{ width: "100%" }}
                ref={audioRef}
                autoPlay
                controls={false}
                playsInline
                // muted={isMuted}
            />
            
        </div>
    );
};
