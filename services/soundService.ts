// Base64 encoded audio clips to avoid extra network requests.

// Sound from https://freesound.org/people/Leszek_Szary/sounds/171670/ (CC0)
const CORRECT_SOUND_B64 = "data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhSAAAAIl2C7sJ4wfjDe4P6A/xD+0P+gAEgSMAFwECAAoABeAFeARsAn4A/gC1//7/5gD//P/M/+b/yf/A/4f/TP+w/zX/gv8M//3/wf8X/8H/M//B/0L/wf9J/8H/Tv/B/1T/wf9X/8H/V//B/1f/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1b/wf9W/8H/Vv/B/1d9/d39xf2V/YX9hf2B/X39df11/W39Zf1h/V39Wf1R/Un9Rf05/TX9Lf0l/R39Ff0N/QX8/fz1/O385fzZ/M38xfy9/L38vfzJ/MX8wfy9/L38tvy1/Kv8qfyj/J/8nvyd/Jj8kvyP/I38hfxx/G38Z/xZ/FP8TvxO/Er8RvxD/D/8Ovwy/Cv8J/wd/A38B/wH/+/+7/7b/tv+1/7X/tP+z/7H/rv+p/6f/p/+l/6T/ov+g/5//mv+X/5X/kv+R/47/jf+M/4r/iP+H/4X/g/+A/3//e/93/3X/c/9v/2n/Z/9m/2P/XP9b/1j/Vv9U/1P/Sf9H/0X/Qv8//zr/OX83/zJ/MP8v/y7/LP8q/yn/Jv8l/yL/IP8e/xx/Gv8W/xP/Ev8Q/w//C/8H/wP/Af/+/7v/uf+3/7T/r/+q/6f/ov+d/5r/lP+S/4//if+H/4L/f/97/3P/b/9o/2X/Wv9V/1H/Q/8//zf/Mf8w/y7/K/8o/yX/IP8d/xn/Ff8S/xD/Cv8G/wH//P+6/7b/s/+v/6X/nP+W/5H/jf+J/4L/ev9z/2n/Y/9b/1T/SP9E/z3/Nf8y/y//Lf8o/yP/Hv8a/xT/Ef8O/wn/A/8B//7/t/+x/67/qP+j/5v/lf+Q/4z/hv9+/3L/aP9f/1b/Uf9D/zv/NP8u/yn/I/8f/xX/EP8L/wL//v+0/6v/pv+Z/5P/i/+E/3z/cf9m/1r/U/9G/zz/N/8t/yT/H/8V/w7/Cf8B//3/rf+o/5r/kv+O/4X/fP9u/2b/XP9P/0b/PP8z/yz/I/8d/xP/Dv8I/wD/8/+u/6X/mf+S/4r/gP98/2z/Wf9N/0T/Pf8x/yn/Iv8b/xH/C/8A//r/qf+g/5b/j/+G/3z/af9b/1L/Rv86/zH/Kf8g/xr/EP8J/wD/9/+o/5//kv+J/37/b/9d/1L/R/85/y7/Iv8a/xL/CP/7/6T/mf+Q/4n/fP9t/1z/U/9F/zn/Lv8h/xn/Ef8I//n/mv+Q/4j/f/9p/1j/Tf9A/zX/KP8c/xH/Bv/8/5L/h/98/2b/Wv9L/z3/Mf8k/xj/DP/7/4z/gv97/2b/WP9L/z3/MP8h/xb/DP/+/4n/f/9t/1j/Tf89/zL/Iv8Y/w7/AP/9/4X/ev9s/1n/Sv86/y3/Hf8Q/wn/AP/8/4P/d/9r/1b/Sv83/yb/Fv8L//7/f/9q/1b/SP8x/x3/Ef8E//z/d";

// Sound from https://freesound.org/people/Crickets_chirping/sounds/45607/ (CC0)
const INCORRECT_SOUND_B64 = "data:audio/wav;base64,UklGRqIAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YSgAAACr/1v/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9X/1f/V/9x3/8v/x//GP8VPxM/ET8Q/w6/DL8Kfwn/B/8DfwH/Af/+/7v/tv+z/67/qv+n/6X/o/+d/5v/l/+W/5T/kv+Q/47/jf+M/4v/if+H/4X/gv+A/3//ff9z/23/af9n/2X/Y/9f/1z/Wv9W/1T/Uv9Q/0v/Sf9F/0P/P/8+/zv/N/80/zL/L/8s/yv/KP8n/yX/I/8h/x//Hv8a/xb/FP8S/xD/Dv8K/wf/A/8A//z/vf+4/7X/sf+s/6f/ov+d/5v/lf+T/4//jf+K/4n/hv+A/3z/c/9u/2f/Xv9a/1P/Sv9G/z//OP80/y//K/8k/x7/Gf8S/w//B/8B//v/tf+w/6v/pv+Z/5P/iv+F/3r/cP9o/1z/Uf9B/zb/LP8k/x3/FP8P/wr/Af/8/7D/qv+i/5f/jf+G/3j/bf9b/07/Qf83/yj/Hv8T/wv/Af/9/6z/pv+V/4v/gv96/2v/Wf9N/z//Lf8d/xP/CP/9/6b/lv+K/37/a/9V/0v/N/8p/xz/Dv8G//7/lf+H/3r/Z/9U/0r/NP8n/xb/DP8C//n/hv95/2b/Uv9G/zP/IP8V/wj/AP/9/3z/Y/9P/0L/Lf8W/w3/AP/8/3P/Wf9L/zz/IP8U/wj/AP/+/2n/UP9B/y//Fv8H//3/WP9N/zv/HP8P/wX/AP/8/1P/Qf8u/xL/A///7f9a/z3/Hf8N/wP//f9N/zT/HP8K/wD//f89/yP/E/8C//3/MP8U/wH//P8O/wA=";

// Sound from https://freesound.org/people/volivieri/sounds/16123/ (CC0)
const FLIP_SOUND_B64 = "data:audio/wav;base64,UklGRoAAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAACABAAZGF0YQAAAAAAtP/2/9j/xP+o/5X/gv9j/1P/PP8h/wT/wf5o/jb/CP+u/pz/X/8w/xr/HP8r/z3/Rv9Y/1//Xf9S/0L/Nf8i/wb/AP8F/yH/M/9E/1X/W/9X/0//Qf8x/xr/A/7d/nj+Yv5U/lT+Wf5p/oX+rP7M/vX/BQAUABoAHwAjACgALgA0ADsARgBOAFgAXwBpAHAAcwB5AIQAkACdAKgArwDMAOgA9wD/AQsBGgEoATEBOgFHAVABWwFkAW4BdAGHAbYB0QHiAfIB+gIIAg8CGQIgAioCOwJMAmECbQKAAqYCtwLJAuEC+wMMAxYDIgMqAzMDQgNRA1kDYQNoA3QDiAOeA7EDzQPmBBYEHwQvBD8ETwRlBHQEhgSlBMMFAgUKBQsFDgURBRYFGQUcBSQFKwU0BTsFPgVEBUkFUA VcBWQFaAVwBXoFhQWKBZUFngWrBb8FxwXOBdsF6QYGBhQGGgYkBioGMAZBBlUGfQaCBqIGrAbCBtEG6wcIBwsHHwcoBy0HOgdPB2cHbwd9B4kHmAeqB84H4wgaCB8IKQg3CD8ITAlCCVcJZAlyCYYJsAm4Cc8KAwoQCicKOwpCCk0KWwpmCncKiAqgCrUK/wMA";

let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};


const playSound = (base64: string) => {
    try {
        const audioCtx = getAudioContext();
        if (!audioCtx) return;
        
        fetch(base64)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start();
            }).catch(e => console.error("Error playing sound:", e));
    } catch (e) {
        console.error("Failed to play sound:", e);
    }
};

export const playCorrectSound = () => {
    playSound(CORRECT_SOUND_B64);
};

export const playIncorrectSound = () => {
    playSound(INCORRECT_SOUND_B64);
};

export const playFlipSound = () => {
    playSound(FLIP_SOUND_B64);
};
