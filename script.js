const BTNS = { 
    Backquote: ["`", "ё"],
    Digit1: ["1", "1"],
    Digit2: ["2", "2"],
    Digit3: ["3", "3"],
    Digit4: ["4", "4"],
    Digit5: ["5", "5"],
    Digit6: ["6", "6"],
    Digit7: ["7", "7"],
    Digit8: ["8", "8"],
    Digit9: ["9", "9"],
    Digit0: ["0", "0"],
    Minus: ["-", "-"],
    Equal: ["=", "="],
    Backspace: ["backspace", "backspace"],
    Tab: [ "tab",  "tab"],
    KeyQ: ["q","й"],
    KeyW: ["w", "ц"],
    KeyE: ["e", "у"],
    KeyR: ["r", "k"],
    KeyT: ["t", "е"],
    KeyY: ["y", "н"],
    KeyU: ["u", "г"],
    KeyI: ["i", "ш"],
    KeyO: ["o", "щ"],
    KeyP: ["p", "з"],
    BracketLeft: ["[","х"],
    BracketRight: ["]","ъ"],
    Backslash: ["\\","\\"],
    Delete: ["del","del"], // br
    CapsLock: ["caps", "caps"],
    KeyA: ["a", "ф"],
    KeyS: ["s", "ы"],
    KeyD: ["d", "в"],
    KeyF: ["f", "а"],
    KeyG: ["g", "п"],
    KeyH: ["h", "р"],
    KeyJ: ["j", "о"],
    KeyK: ["k", "л"],
    KeyL: ["l", "д"],
    Semicolon: [";", "ж"],
    Quote: ["'", "э"],
    Enter: ["enter", "enter"],
    ShiftLeft: ["shift l", "shift l"],// br
    KeyZ: ["z", "я"],
    KeyX: ["x", "ч"],
    KeyC: ["c", "с"],
    KeyV: ["v", "м"],
    KeyB: ["b", "и"],
    KeyN: ["n", "т"],
    KeyM: ["m", "ь"],
    Comma: [",", "б"],
    Period: [".", "ю"],
    Slash: ["/", "/"],
    ShiftRight: ["shift r", "shift r"],
    ArrowUp: ["↑", "↑"], //br
    ControlLeft: ["ctrl l", "ctrl l"],    
    MetaLeft: ["win", "win"],
    AltLeft: ["alt l", "alt l"],
    Space: ["space", "space"],
    AltRight: ["alt r", "alt r"],
    ControlRight: ["ctrl r", "ctrl r"],
    ArrowLeft: ["←", "←"],
    ArrowDown: ["↓", "↓"],
    ArrowRight: ["→", "→"] 
};
const saveToObject = (acc, cur) => ({ ...acc, [cur]: cur });

const BTNS_KEYS = Object.keys(BTNS).reduce(saveToObject, {});

const BTNS_SPEC = [BTNS_KEYS.Backspace, BTNS_KEYS.Tab, BTNS_KEYS.Delete, BTNS_KEYS.CapsLock, BTNS_KEYS.Enter, 
    BTNS_KEYS.ShiftLeft, BTNS_KEYS.ShiftRight, BTNS_KEYS.ControlLeft, BTNS_KEYS.ControlRight, BTNS_KEYS.MetaLeft, 
    BTNS_KEYS.AltLeft, BTNS_KEYS.AltRight, BTNS_KEYS.Space, BTNS_KEYS.ArrowRight, BTNS_KEYS.ArrowLeft,
    BTNS_KEYS.ArrowUp, BTNS_KEYS.ArrowDown].reduce(saveToObject, {});

const BTNS_SPEC_EXPD = [BTNS_KEYS.Digit0, BTNS_KEYS.Digit1, BTNS_KEYS.Digit2, BTNS_KEYS.Digit3, BTNS_KEYS.Digit4, 
    BTNS_KEYS.Digit5, BTNS_KEYS.Digit6, BTNS_KEYS.Digit7, BTNS_KEYS.Digit8, BTNS_KEYS.Digit9, BTNS_KEYS.Minus, 
    BTNS_KEYS.Equal, BTNS_KEYS.Backspace, BTNS_KEYS.Tab, BTNS_KEYS.Backslash, BTNS_KEYS.Delete, BTNS_KEYS.CapsLock, 
    BTNS_KEYS.Enter, BTNS_KEYS.ShiftLeft, BTNS_KEYS.ShiftRight, BTNS_KEYS.Slash, BTNS_KEYS.ControlRight, BTNS_KEYS.ControlLeft, 
    BTNS_KEYS.MetaLeft, BTNS_KEYS.AltRight, BTNS_KEYS.AltLeft, BTNS_KEYS.ArrowLeft, BTNS_KEYS.Space, BTNS_KEYS.ArrowLeft, 
    BTNS_KEYS.ArrowRight, BTNS_KEYS.ArrowUp, BTNS_KEYS.ArrowDown].reduce(saveToObject, {});;

class KeypadService {
    constructor() {
        this._section = null,
        this._keysContainer = null,
        this._keys = [],
        this._textarea = null        
        this._state = {
            value: "",
            capsLock: false
        }
    }

    showKeypad = () => {
        this._getCyrillicInput();
        this._textarea = document.createElement("textarea"); 
        this._textarea.classList.add("use-keyboard-input");
        this._section = document.createElement("div");
        this._section.classList.add("keypad");
        this._keysWrap = document.createElement("div");
        this._keysWrap.classList.add("keypad__keys");
        this._section.appendChild(this._keysWrap);      
        this._section.appendChild(this._textarea);
        this._keysWrap.appendChild(this._createButtons());
        this._keysWrap.appendChild(document.createElement("br"));
        let span = document.createElement("span");
        span.textContent = "Windows | To change language on the keyboard: Ctrl + Alt";
        this._keysWrap.appendChild(span);               
        document.body.appendChild(this._section);        
        this._keys = [...this._keysWrap.querySelectorAll(".keypad__key")];
        this._textarea.focus();    
    }   

    changeKeyboardLayout() {
        this._setCyrillicInput();
        for (const key of this._keys) {
            if (!Object.keys(BTNS_SPEC_EXPD).some(b => b === key.id)) {    
            let ltr = this._getCyrillicInput()
                    ? BTNS[key.id][1] 
                    : BTNS[key.id][0];
            key.textContent = this._state.capsLock ? ltr.toUpperCase() : ltr.toLowerCase();
            }
        }
    }

    clickVirtualButton(btnName) {
        let start = this._textarea.selectionStart;
        let end = this._textarea.selectionEnd;
        
        if (btnName === BTNS_KEYS.Backspace) {   
            this._state.value = this._state.value.replace(this._state.value.substring(start === end ? start - 1 : start, end), "");
            this._updateTextarea(this._state.value, end === 0 ? end : end - 1);
        } else if (btnName === BTNS_KEYS.Delete) {
            this._state.value = this._state.value.replace(this._state.value.substring(start === end ? start + 1 : start, end), "");
            this._updateTextarea(this._state.value, end);
        } else if (btnName === BTNS_KEYS.CapsLock) {
            this._switchCapsLock();
            document.querySelector(".keypad__key-caps").classList.toggle("keypad__key-turnon", this._state.capsLock);
        } else if (btnName === BTNS_KEYS.Enter) {        
            this._handleText("\n", start);
        } else if (btnName === BTNS_KEYS.Space) {
            this._handleText(" ", start);
        } else if (btnName === BTNS_KEYS.Tab) {            
            this._handleText((start === 0) ? "        " : " ", start);
        } else if ([BTNS_KEYS.ArrowUp, BTNS_KEYS.ArrowDown, BTNS_KEYS.ArrowLeft, BTNS_KEYS.ArrowRight].some(k => k === btnName)) {
            this._handleText(BTNS[btnName][0], start);
        } else if (!Object.keys(BTNS_SPEC).some(b => b === btnName)) {     
            let isUpper = (this._state.capsLock && shifPress.size < 1) || (! this._state.capsLock && shifPress.size > 0);
            let btnVal = this._getCyrillicInput()
                        ? BTNS[btnName][1] 
                        : BTNS[btnName][0]; 
            let letter = isUpper ? btnVal.toUpperCase() : btnVal.toLowerCase();
            this._handleText(letter, start);
        }
    }

    onWithVirtual(event, isHold) {
        this._addOrRemoveClass(event.code, isHold);
        if (isHold) {
            this.clickVirtualButton(event.code);              
        }
    }

    updateTextareaReal(event) {
        this.clickVirtualButton(event.code);
    }

    
    _handleText(value, pos) {
        let res = this._state.value.split("");
        res.splice(pos, 0, value);
        this._state.value = res.join("");
        this._updateTextarea(this._state.value, pos + 1);
    }

    _addOrRemoveClass(btnName, isHold) {
        if(isHold)
            this._findVirtualKey(btnName).classList.add("keypad__key_virtual");
        else 
            this._findVirtualKey(btnName).classList.remove("keypad__key_virtual");
    }

    _getCyrillicInput() {
        if (localStorage.getItem('isCyrillicInput') === null) {
            localStorage.setItem('isCyrillicInput', false);
        } 
        return JSON.parse(localStorage.getItem('isCyrillicInput'));
    }

    _setCyrillicInput() {
        localStorage.setItem('isCyrillicInput', !JSON.parse(localStorage.getItem('isCyrillicInput')));
    }

    _findVirtualKey(btnName) {
        return this._keys.find(k => k.id === btnName);
    }

    _createButtons() {
        const part = document.createDocumentFragment(); 
       
        for (const btn in BTNS) {
            let kR = BTNS[btn];
            let keyVal = this._getCyrillicInput() ? kR[1] : kR[0];      
            const btnElement = document.createElement("button");          
            btnElement.setAttribute("type", "button");
            btnElement.classList.add("keypad__key");
            btnElement.id = (`${btn}`);
            btnElement.textContent = keyVal;
            part.appendChild(btnElement); 
            if (btn === BTNS_KEYS.CapsLock) 
                btnElement.classList.add("keypad__key-caps");
            if ([BTNS_KEYS.Backspace, BTNS_KEYS.CapsLock, BTNS_KEYS.Enter].includes(btn))
                btnElement.classList.add("keypad__key-expand");  
            if (btn == BTNS_KEYS.Space)                           
                btnElement.classList.add("keypad__key-whitespace");           
            if ([BTNS_KEYS.Backspace, BTNS_KEYS.Delete, BTNS_KEYS.Enter, BTNS_KEYS.ArrowUp].includes(btn))
                part.appendChild(document.createElement("br"));
        };

        return part;
    }

    _updateTextarea(value, pos) {
        this._textarea.value = value;
        this._textarea.focus(); 
        this._textarea.setSelectionRange( pos, pos);
    }

    _switchCapsLock() {
        this._state.capsLock = !this._state.capsLock;          
        for (const key of this._keys) {
            key.textContent = this._state.capsLock && !Object.keys(BTNS_SPEC).some(b => b === key.id) 
                ? key.textContent.toUpperCase() 
                : key.textContent.toLowerCase();
        }
    }    
}

const SERVICE = new KeypadService();

window.addEventListener("DOMContentLoaded", () => {      
   SERVICE.showKeypad();
});

let keysSwitchLanguage = new Set();
let shifPress = new Set();

document.addEventListener("keydown",  (event) => {
    event.preventDefault(); 
    if(event.code === BTNS_KEYS.ControlLeft || event.code === BTNS_KEYS.ControlRight)
        keysSwitchLanguage.add("Ctrl");
    if(event.code === BTNS_KEYS.AltLeft || event.code === BTNS_KEYS.AltRight)
        keysSwitchLanguage.add("Alt");
    if(event.code === BTNS_KEYS.ShiftLeft || event.code === BTNS_KEYS.ShiftRight)
        shifPress.add("Shift");
    if(keysSwitchLanguage.size > 1) 
        SERVICE.changeKeyboardLayout();
    SERVICE.onWithVirtual(event, true);
  });

document.addEventListener("keyup", (event) => {
    keysSwitchLanguage.clear();
    if(event.code === BTNS_KEYS.ShiftLeft || event.code === BTNS_KEYS.ShiftRight) {
        shifPress.clear();
    }
    SERVICE.onWithVirtual(event, false);
});

document.addEventListener('click', function(e) {
    if(event.target.type === "button") {
        SERVICE.clickVirtualButton(event.target.id)
    }
  });

  document.addEventListener("mousedown", (event) => {
    if(event.target.id === BTNS_KEYS.ShiftLeft || event.target.id === BTNS_KEYS.ShiftRight) {
        shifPress.add("Shift");
    }
});

document.addEventListener("mouseup", (event) => {
    if(event.target.id === BTNS_KEYS.ShiftLeft || event.target.id === BTNS_KEYS.ShiftRight) {
        shifPress.clear();
    }
});