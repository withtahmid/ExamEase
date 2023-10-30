import * as React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function Recorder({ getter }) {

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }



    const addAudioElement = async (blob) => {
        const url = URL.createObjectURL(blob);
        // console.log(url);
        const base64 = await blobToBase64(blob);
        // console.log(base64)
        getter(base64);
        // const audio = document.createElement('audio');
        // audio.src = url;
        // audio.controls = true;
        // document.body.appendChild(audio);
    };

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                    // autoGainControl,
                    // channelCount,
                    // deviceId,
                    // groupId,
                    // sampleRate,
                    // sampleSize,
                }}
                onNotAllowedOrFound={(err) => console.table(err)}
                // downloadOnSavePress={true}
                // downloadFileExtension="webm"
                mediaRecorderOptions={{
                    audioBitsPerSecond: 64000,
                }}
                showVisualizer={true}
            />
            <br />
        </div>
    );
}
