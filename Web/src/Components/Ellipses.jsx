import React, {useState, useEffect} from 'react';

const Ellipses = ({length}) => {
    const [str, setStr] = useState('');
    const [reverse, setReverse] = useState(false);
    const len = length ?? 5;

    useEffect(() => {
        const t = setTimeout(() => {
            setStr(s => {
                let r = reverse;
                if (s.length === len) {
                    setReverse(true);
                    r = true;
                }
                if (s.length === 1) {
                    setReverse(false);
                    r = false;
                }
                return r ? s.slice(0, -1) : s + '.';
            });
        }, 100);

        return () => clearTimeout(t);
    }, [str, reverse, len]);

    return <strong className="d-inline-block text-start"
        style={{fontFamily: 'monospace', width: `${len}em`}}
    >
        {str}
    </strong>;
}

export default Ellipses;