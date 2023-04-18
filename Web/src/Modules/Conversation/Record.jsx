import React, { useState, useEffect } from 'react';
import { startRecording, stopRecording } from "../../Services/Transcribe";
import Ellipses from '../../Components/Ellipses';

let stopTimeout;
const CUT_OFF_SECONDS = 5;

const Record = ({ partialMessage, finalMessage }) => {
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
            finalMessage(text);
        }
        setText('');
    }

    const doStart = () => {
        setIsRecording(true);
        startRecording(t => {
            setText(t);
            partialMessage(t);
        });
    }

    useEffect(() => {
        clearTimeout(stopTimeout);
        if (isRecording) {
            stopTimeout = setTimeout(doStop, CUT_OFF_SECONDS * 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isRecording]);

    return <div>
        <button className={'btn btn-lg w-100 '+ (isRecording ? 'btn-danger' : 'btn-primary')}
            onClick={toggle}>
                {isRecording ? 'Recording' : 'Record your message'}
                {isRecording && <Ellipses />}
        </button>

        {/* <p>{text}</p> */}
    </div>
}

export default Record;
