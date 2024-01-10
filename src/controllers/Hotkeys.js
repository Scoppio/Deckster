export const hotkeys = () => {

}

/*

Ctrl+A: Minha mão
Ctrl+S: Meu battlefield
Ctrl+D: Minha Library
Ctrl+F: Meu Graveyard
Ctrl+Q: Minha Exiled Pile
Ctrl+W: Minha Exiled Facedown Pile
Ctrl+E: Minha Command Zone
Ctrl+R: Alguma área que eu tenha esquecido mas que surja depois.
*
Ctrl+1: Avatar do Jogador 1. Segue até Ctrl+6. O Jogador 1 é sempre quem criou a mesa, e os outros são numerados na ordem em que entram, o que o app sorteia é qual dos números começa, não quem é o 1. O avatar é o tabindex imediatamente antes do battlefield do Jogador, e informa nome, vida, contadores, Commander, quantas cartas na mão, quantas no grave e quantas na library, nessa ordem.
*
Dentro do Battlefield:
Shift+Z: Manda todas as selecionadas para a mão
Shift+X: Idem para o graveyard
Shift+C: Idem para Exile
Shift+V: Idem para Library
Shift+b: Idem para Command Zone

*
Ctrl+vírgula: Desvira todo o Battlefield.
Ctrl+ponto: Compra uma carta
Ctrl+/: Passa o turno.
Ctrl+Mais e Menos do Numpad: Aumenta ou diminui minha vida.
Ctrl+Asterisco do Numpad: Abre dialog para digitar um integer para definir a vida, pra evitar 100 calls pro backend à toa.
*
Outras funções de jogo como Tap/Untap, Declare as Attacking/Blocking, Scry, Roll/Flip, Add/Remove +1/+1 ou -1/-1, podem ser alocadas em Ctrl+J, K, L, U, I O e P.

*/

class MacKeys {
    isKey = (event, key, func) => {
        if (event.key === key){
            event.preventDefault()
            func()
        }
    }

    isCtrlKey = (event, key, func) => {
        if ((event.metaKey && !event.shiftKey) && (event.key === key)){
            event.preventDefault()
            func()
        }
    }

    isCtrlShiftdKey = (event, key, func) => {
        if ((event.metaKey && event.shiftKey) && (event.key === key)){
            event.preventDefault()
            func()
        }
    }
    isAltKey = (event, key, func) => {
        if (event.altKey && (event.key === key)){
            event.preventDefault()
            func()
        }
    }
}


class WindowsKeys {
    isKey = (event, key, func) => {
        if (event.key === key){
            event.preventDefault()
            func()
        }
    }

    isCtrlKey = (event, key, func) => {
        if ((event.ctrlKey && !event.shiftKey) && (event.key === key)){
            event.preventDefault()
            func()
        }
    }

    isCtrlShiftdKey = (event, key, func) => {
        if ((event.ctrlKey && event.shiftKey) && (event.key === key)){
            event.preventDefault()
            func()
        }
    }

    isAltKey = (event, key, func) => {
        if (event.altKey && (event.key === key)){
            event.preventDefault()
            func()
        }
    }
    
}

class HotkeysChooser {
    constructor() {
        const isMac = window.navigator.userAgent.includes('Macintosh');
        if (isMac) {
            this.hotkeys = new MacKeys()
        } else {
            this.hotkeys = new WindowsKeys()
        }
    }
}

export class HotKeys {
    constructor(gameController, playerRefs) {
        this.gameController = gameController
        this.playerRefs = {}

        playerRefs.forEach((p, idx) => {
            this.playerRefs[idx + 1] = p
        })

        this.k = new HotkeysChooser().hotkeys
        this.macCtrlKeyCommand = []
        this.macCtrlShiftKeyCommand = []
        this.ctrlKeyCommand = []
        this.ctrlShiftKeyCommand = []
        this.altKeyCommand = []
        this.macAltKeyCommand = []
        this.keyCommand = []
        this.macKeyCommand = []
    }

    registerKeyCommand = (key, func, os) => {
        if (os === 'mac') {
            this.macKeyCommand.push({key, func})
        } else {
            this.keyCommand.push({key, func})
        }
    }

    registerCtrlKeyCommand = (key, func, os) => {
        if (os === 'mac') {
            this.macCtrlKeyCommand.push({key, func})
        } else {
            this.ctrlKeyCommand.push({key, func})
        }
    }

    registerCtrlShiftKeyCommand = (key, func, os) => {
        if (os === 'mac') {
            this.macCtrlShiftKeyCommand.push({key, func})
        } else {
            this.ctrlShiftKeyCommand.push({key, func})
        }
    }

    registerAltKeyCommand = (key, func, os) => {
        if (os === 'mac') {
            this.macAltKeyCommand.push({key, func})
        } else {
            this.altKeyCommand.push({key, func})
        }
    }

    handleKeyDown = (event) => {
        if (this.isMac)
        {
            this.macCtrlKeyCommand.forEach((command) => {
                this.k.isCtrlKey(event, command.key, command.func)
            })
    
            this.macCtrlShiftKeyCommand.forEach((command) => {
                this.k.isCtrlShiftdKey(event, command.key, command.func)
            })

            this.macAltKeyCommand.forEach((command) => {
                this.k.isAltKey(event, command.key, command.func)
            })

            this.macKeyCommand.forEach((command) => {
                this.k.isKey(event, command.key, command.func)
            })
            
        } else {
            this.ctrlKeyCommand.forEach((command) => {
                this.k.isCtrlKey(event, command.key, command.func)
            })
    
            this.ctrlShiftKeyCommand.forEach((command) => {
                this.k.isCtrlShiftdKey(event, command.key, command.func)
            })

            this.altKeyCommand.forEach((command) => {
                this.k.isAltKey(event, command.key, command.func)
            })

            this.keyCommand.forEach((command) => {
                this.k.isKey(event, command.key, command.func)
            })
        }
    }
}