const KEY_COLLECTION_ENG = [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","\\","del",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter","shift l", 
    "z", "x", "c", "v", "b", "n", "m", ",", ".", "/","shift r", "↑",
    "ctrl l", "win", "alt l", "space", "alt r", "ctrl r", "←","↓", "→"
];
const KEY_COLLECTION_RUS = [
    "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ","\\","del",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter","shift l", 
    "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "?","shift r", "↑",
    "ctrl l", "win", "alt l", "space", "alt r", "ctrl r", "←","↓", "→"
];
const SPEC_BUTTONS = ["backspace", "tab", "del", "caps", "enter","shift l", "shift r", "ctrl l", "ctrl r", "win", "alt r", "alt l", "space"];
const TRSL_BUTTONS = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "tab", "\\","del", "caps", "enter","shift l", "/","shift r", "↑",
    "ctrl l", "win", "alt l", "space", "alt r", "ctrl r", "←","↓", "→",
    "-", "=", "backspace", "tab"," \\","del","caps", "enter","shift l", 
    "shift r", "↑", "ctrl l", "win", "alt l", "space", "alt r", "ctrl r", "←","↓", "→"
];

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
        let isCyrillicInput = localStorage.getItem('isCyrillicInput');
        if (isCyrillicInput === null) {
            localStorage.setItem('isCyrillicInput', true);
        }            
        this._textarea = document.createElement("textarea"); 
        this._textarea.classList.add("use-keyboard-input");
        this._section = document.createElement("div");
        this._section.classList.add("keypad");
        this._keysWrap = document.createElement("div");
        this._keysWrap.classList.add("keypad__keys");
        this._section.appendChild(this._keysWrap);
        this._section.appendChild(this._textarea);
        this._keysWrap.appendChild(this._createButtons());      
        document.body.appendChild(this._section);        
        this._keys = Array.prototype.slice.call(this._keysWrap.querySelectorAll(".keypad__key"));
        this._textarea.focus();       
    }   

    changeKeyboardLayout() {
        let isCyrillicInput = localStorage.getItem("isCyrillicInput");
        if (isCyrillicInput === null) {
            localStorage.setItem('isCyrillicInput', false);
        }
        else {
            localStorage.setItem('isCyrillicInput',  !JSON.parse(isCyrillicInput));
        }
        for (const key of this._keys) {
            if (!TRSL_BUTTONS.some(b => b === key.textContent)) {
    
            let ltr = JSON.parse(localStorage.getItem("isCyrillicInput"))
                    ? KEY_COLLECTION_RUS[KEY_COLLECTION_ENG.indexOf(key.textContent.toLowerCase())]
                    : KEY_COLLECTION_ENG[KEY_COLLECTION_RUS.indexOf(key.textContent.toLowerCase())];
            key.textContent = (this._state.capsLock) ? ltr.toUpperCase() : ltr.toLowerCase();
            }
        }
    }

    clickVirtualButton(btn) {
        let btnName = btn.innerText;
        if (btnName === "backspace") {
            let start = this._textarea.selectionStart;
            let end = this._textarea.selectionEnd;
            this._state.value = this._state.value.replace(this._state.value.substring(start === end ? start - 1 : start, end), "");
            this._updateTextarea(this._state.value, end - 1);
        }
        else if (btnName === "del") {
            let start = this._textarea.selectionStart;
            let end = this._textarea.selectionEnd;
            this._state.value = this._state.value.replace(this._state.value.substring(start === end ? start + 1 : start, end), "");
            this._updateTextarea(this._state.value, end + 1);
        }
        else if (btnName === "caps") {
            this._switchCapsLock();
            btn.classList.toggle("keypad__key-turnon", this._state.capsLock);
        }
        else if (btnName === "enter") {
            let start = this._textarea.selectionStart;
            let res = this._state.value.split("");
            res.splice(start, 0, "\n");
            this._state.value = res.join("");
            this._updateTextarea(this._state.value, start + 1);
        }
        else if (btnName === "space") {
            let start = this._textarea.selectionStart;
            let res = this._state.value.split("");
            res.splice(start, 0, " ");
            this._state.value = res.join("");
            this._updateTextarea(this._state.value, start + 1);
        }
        else if (btnName === "tab") {
            let start = this._textarea.selectionStart;
            let res = this._state.value.split("");
            res.splice(start, 0, "        ");
            this._state.value = res.join("");
            this._updateTextarea(this._state.value, start + 1);
        }
        else if (! SPEC_BUTTONS.some(b => b === btnName)) {
            let start = this._textarea.selectionStart;
            let res = this._state.value.split("");
            res.splice(start, 0, this._state.capsLock ? btnName.toUpperCase() : btnName.toLowerCase());
            this._state.value = res.join("");
            this._updateTextarea(this._state.value, start + 1);
        }
    }

    onWithVirtual(event, isHold) {
        const isCyrillicInput = JSON.parse(localStorage.getItem("isCyrillicInput"));
        if (event.code.includes("Digit")) {
            this._addOrRemoveClass(event.code.substring(5), isHold);
            return;
        }
        if (event.code.includes("Key")) {
            let srch = this._state.capsLock ? event.code.substring(3).toUpperCase() : event.code.substring(3).toLowerCase();
            this._addOrRemoveClass(srch, isHold);
            return;
        }
        switch (event.code) {
            case "Backspace":
                this._addOrRemoveClass("backspace", isHold);
                break;
            case "Tab":
                this._addOrRemoveClass("tab", isHold);
                break; 
            case "Delete":   
                this._addOrRemoveClass("del", isHold);
                break; 
            case "CapsLock":
                this._addOrRemoveClass("caps", isHold); 
                if (isHold) {
                    if(event.getModifierState("CapsLock") !== this._state.capsLock) {
                        this._switchCapsLock(); 
                        this._findKey("caps").classList.toggle("keypad__key-turnon", this._state.capsLock); 
                    }
                }
                break;                
            case "Enter":
                this._addOrRemoveClass("enter", isHold);
                break; 
            case "ShiftLeft":
                this._addOrRemoveClass("shift l", isHold);
                break; 
            case "ShiftRight":
                this._addOrRemoveClass("shift r", isHold);
                break; 
            case "ControlLeft":
                this._addOrRemoveClass("ctrl l", isHold);
                break; 
            case "ControlRight":
                this._addOrRemoveClass("ctrl r", isHold);
                break;
            case "AltLeft":
                this._addOrRemoveClass("alt l", isHold);
                break; 
            case "AltRight":
                this._addOrRemoveClass("alt r", isHold);
                break;
            case "ArrowUp":
                this._addOrRemoveClass("↑", isHold);
                break;
            case "ArrowDown":
                this._addOrRemoveClass("↓", isHold);
                break;  
            case "ArrowRight":
                this._addOrRemoveClass("→", isHold);
                break;
            case "ArrowLeft":
                this._addOrRemoveClass("←", isHold);
                break;
            case "MetaLeft":
                this._addOrRemoveClass("win", isHold);
                break;
            case "Space":
                this._addOrRemoveClass("space", isHold);       
                break;
            case "Backquote":
                this._addOrRemoveClass(isCyrillicInput ?  "ё" : "`", isHold);
                break;
            case "Minus":
                this._addOrRemoveClass("-", isHold);
                break;
            case "Equal":
                this._addOrRemoveClass("=", isHold);
                break;
            case "BracketLeft":
                this._addOrRemoveClass(isCyrillicInput ? "х" : "[", isHold);
                break;
            case "BracketRight":
                this._addOrRemoveClass(isCyrillicInput ? "ъ" : "]", isHold);
                break;
            case "Backslash":
                this._addOrRemoveClass("\\", isHold);
                break;
            case "Semicolon":
                this._addOrRemoveClass(isCyrillicInput ? "ж" : ";", isHold);
                break;
            case "Quote": 
                this._addOrRemoveClass(isCyrillicInput ? "э" : "'", isHold);
                break;
            case "Comma":
                this._addOrRemoveClass(isCyrillicInput ? "б" : ",", isHold);
                break;
            case "Period":
                this._addOrRemoveClass(isCyrillicInput ? "ю" : ".", isHold);
                break;
            case "Slash":
                this._addOrRemoveClass(isCyrillicInput ? "?" : "/", isHold);
            default:
                break;
        }
    }

    
    updateTextareaReal(value) {
        if(value === null) {
            return;
        }
        this._textarea.value = this._textarea.value.substr(0, this._textarea.value.length - 1);
        let findRus = KEY_COLLECTION_RUS.find(k => k.toLowerCase() === value.toLowerCase());
        let findEng = KEY_COLLECTION_ENG.find(k => k.toLowerCase() === value.toLowerCase());
        let isCyrillicInput = JSON.parse(localStorage.getItem('isCyrillicInput'));
        if ((isCyrillicInput && findRus) || (!isCyrillicInput && findEng))
            this._state.value += value  
        else {
            if (findRus) {
               let ltrRus = KEY_COLLECTION_ENG[KEY_COLLECTION_RUS.indexOf(findRus)];
               this._state.value +=  this._state.capsLock ? ltrRus.toUpperCase() : ltrRus.toLowerCase();
            }  
            else {              
                let ltrEng = KEY_COLLECTION_RUS[KEY_COLLECTION_ENG.indexOf(findEng)];
                this._state.value +=  this._state.capsLock ? ltrEng.toUpperCase() : ltrEng.toLowerCase();
            }             
        }   
        this._textarea.value = this._state.value;   
        document.querySelector("textarea").focus(); 
    }

    _addOrRemoveClass(btnName, isHold) {
        if(isHold)
            this._findKey(btnName).classList.add("keypad__key_virtual");
        else 
            this._findKey(btnName).classList.remove("keypad__key_virtual");
    }

    _findKey(btnName) {
        return this._keys.find(k => k.textContent === btnName);
    }

    _createButtons() {
        const part = document.createDocumentFragment(); 

        let collection = JSON.parse(localStorage.getItem("isCyrillicInput")) ?  KEY_COLLECTION_RUS : KEY_COLLECTION_ENG;
        
        for (const key of collection) {
            const keyButton = document.createElement("button");          
            keyButton.setAttribute("type", "button");
            keyButton.classList.add("keypad__key");
            keyButton.textContent = key.toLowerCase();
            part.appendChild(keyButton);

            if (["backspace", "caps", "enter"].includes(key))
                    keyButton.classList.add("keypad__key-expand");  
            if (key === "space")                           
                    keyButton.classList.add("keypad__key-whitespace");           
            if (["backspace", "del", "enter", "↑"].includes(key)) {
                part.appendChild(document.createElement("br"));
            }
        };

        return part;
    }

    _updateTextarea(value, pos) {
        this._textarea.value = value;
        document.querySelector("textarea").focus(); 
        document.querySelector("textarea").setSelectionRange( pos, pos);
    }
    _switchCapsLock() {
        this._state.capsLock = ! this._state.capsLock;          
        for (const key of this._keys) {
            key.textContent = this._state.capsLock && !SPEC_BUTTONS.some(b => b === key.textContent) 
                ? key.textContent.toUpperCase() 
                : key.textContent.toLowerCase();
        }
    }

}

const SERVICE = new KeypadService();

window.addEventListener("DOMContentLoaded", function () {      
   SERVICE.showKeypad();
});

let keysSwitchLanguage = new Set();

window.addEventListener("keydown",  (event) => {
    if(event.ctrlKey)
        keysSwitchLanguage.add("Ctrl");
    if(event.key === "Meta")
        keysSwitchLanguage.add("Meta");
    if(keysSwitchLanguage.size > 1) {
        SERVICE.changeKeyboardLayout();
    }
    SERVICE.onWithVirtual(event, true);
  });

window.addEventListener("keyup", (event) => {
    keysSwitchLanguage.clear();
    SERVICE.onWithVirtual(event, false);
});

window.addEventListener("click", (event) => {
    if(event.target.type === "button")    
        SERVICE.clickVirtualButton(event.target);
});

window.addEventListener("input", (event) => {
    SERVICE.updateTextareaReal(event.data);
});