import { ulid } from 'ulid';
import Socket from './Socket';
import Settings from './Settings';

const Faker = new class{
    
    async sendMessage(conversationId) {
        const messageId = ulid();
        const name = Settings.makeName();
        const words = this.getFakeWords();
        let message = '', delay = 0;
        
        for (let word; (word = words.shift());) {
            delay += Math.round(Math.random() * 200) + 200;
            message += `${word} `;
            setTimeout(((message, delay) => {
                return () => this.emitMessage(conversationId, messageId, name, message, false);
            })(message, delay), delay);
        }

        setTimeout(() => {
            this.emitMessage(conversationId, messageId, name, message, true);
        }, delay + 500);
    }

    emitMessage(conversationId, id, name, message, complete) {
        Socket.send({
            action: 'send',
            data: {
                conversationId,
                message: {
                    id,
                    complete,
                    message
                },
                user: {
                    name
                }
            }
        });
    }

    getFakeWords() {
        const fakeWords = [
            "a", "gr", "snor", "skloft", "wrothble",
            "flimt", "bre", "plurst", "dorplin", "snepleton",
            "q", "zorve", "sprang", "trimdles", "frolbish",
            "stlo", "swor", "jondal", "cremplut", "flistable",
            "f", "brift", "stano", "crumlord", "glasterine",
            "trux", "plim", "glornat", "fleptorium", "tranziver",
            "x", "snaft", "grogle", "presteron", "strumbalize",
            "clun", "plosh", "trogdor", "strimbulator", "blortmancer",
            "u", "drost", "frackle", "clortstrap", "zimtasticon",
            "splop", "tram", "whiblit", "flenktrocity", "zorpulon",
            "v", "flert", "prindle", "slombulator", "glangralorf",
            "thrim", "snark", "vrombit", "flaptronomic", "strontiflarg",
            "g", "storg", "bleptin", "pribblington", "sploptimizer",
            "yerp", "drint", "scramblet", "trilobotastic", "gremptionary",
            "l", "slank", "plurnt", "swiptogator", "flibbergibson"
        ];

        const words = [];
        const length = Math.floor(Math.random() * 20) + 5;

        for (let i = 0; i < length; i++) {
            words.push(fakeWords[Math.floor(Math.random() * fakeWords.length)]);
        }

        return words;
    }
}()

export default Faker;