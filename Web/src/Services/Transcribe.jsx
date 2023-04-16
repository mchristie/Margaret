import { Buffer } from 'buffer';
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { awsCredentials } from './Credentials';
const MicrophoneStream = require('microphone-stream').default;

const SAMPLE_RATE = 44100;
let microphoneStream = undefined;
let transcribeClient = undefined;
const language = 'en-GB';

export const startRecording = async (callback) => {
    if (!language) {
        return false;
    }
    if (microphoneStream || transcribeClient) {
        stopRecording();
    }
    createTranscribeClient();
    await createMicrophoneStream();
    await startStreaming(callback);
};

export const stopRecording = function () {
    if (microphoneStream) {
        microphoneStream.stop();
        microphoneStream.destroy();
        microphoneStream = undefined;
    }
    if (transcribeClient) {
        transcribeClient.destroy();
        transcribeClient = undefined;
    }
};

const createTranscribeClient = () => {
    transcribeClient = new TranscribeStreamingClient({
        region: 'eu-west-1',
        credentials: awsCredentials
    });
}

const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream({
        objectMode: false,
        bufferSize: 1024,
        stream: await window.navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        })
    });
}

const startStreaming = async (callback) => {
    const command = new StartStreamTranscriptionCommand({
        LanguageCode: language,
        MediaEncoding: "pcm",
        MediaSampleRateHertz: SAMPLE_RATE,
        EnablePartialResultsStabilization: true,
        PartialResultsStability: 'medium',
        AudioStream: getAudioStream(),
    });

    const data = await transcribeClient.send(command);
    const sections = [];
    for await (const event of data.TranscriptResultStream) {
        for (const result of event.TranscriptEvent.Transcript.Results || []) {
            const tmp = result.Alternatives[0].Transcript;
            if (result.IsPartial === false) {
                sections.push(tmp);
                callback(sections.join("\n"));
            } else {
                callback(sections.join("\n") + "\n" + tmp);
            }
            // console.log(event.TranscriptEvent.Transcript);
            // if (result.IsPartial === false) {
            //     const noOfResults = result.Alternatives[0].Items.length;
            //     for (let i = 0; i < noOfResults; i++) {
            //         callback(result.Alternatives[0].Items[i].Content + " ");
            //     }
            // }
        }
    }
}

const getAudioStream = async function* () {
    for await (const chunk of microphoneStream) {
        if (chunk.length <= SAMPLE_RATE) {
            yield {
                AudioEvent: {
                    AudioChunk: encodePCMChunk(chunk),
                },
            };
        }
    }
};

const encodePCMChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
};
