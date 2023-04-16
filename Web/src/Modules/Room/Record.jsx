import React, { useState, useEffect } from 'react';
import { startRecording, stopRecording } from "../../Services/Transcribe";

let stopTimeout;
const CUT_OFF_SECONDS = 5;

const Record = ({ addMessage }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');

    const toggle = async () => {
        isRecording ? doStop() : doStart();
    }

    const doStop = () => {
        if (isRecording === false) {
            return;
        }
        setIsRecording(false);
        stopRecording();
        if (text) {
            addMessage(text);
        }
    }

    const doStart = () => {
        setText('');
        setIsRecording(true);
        startRecording(setText);
    }

    useEffect(() => {
        clearTimeout(stopTimeout);
        if (isRecording) {
            stopTimeout = setTimeout(doStop, CUT_OFF_SECONDS * 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isRecording]);

    return <div>
        <button className="btn btn-primary" onClick={toggle}>{isRecording ? 'Stop' : 'Start'}</button>

        <p>{text}</p>
    </div>
}

export default Record;
