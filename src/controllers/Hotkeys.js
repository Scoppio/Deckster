export const hotkeys = () => {};

class MacKeys {
  isKey = (event, key, func) => {
    if (!event.metaKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };

  isCtrlKey = (event, key, func) => {
    if (event.metaKey && !event.shiftKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };

  isCtrlShiftdKey = (event, key, func) => {
    if (event.metaKey && event.shiftKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };
  isAltKey = (event, key, func) => {
    if (event.altKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };
}

class WindowsKeys {
  isKey = (event, key, func) => {
    if (!event.ctrlKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };

  isCtrlKey = (event, key, func) => {
    if (event.ctrlKey && !event.shiftKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };

  isCtrlShiftdKey = (event, key, func) => {
    if (event.ctrlKey && event.shiftKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };

  isAltKey = (event, key, func) => {
    if (event.altKey && event.key === key) {
      event.preventDefault();
      func();
    }
  };
}

class HotkeysChooser {
  constructor() {
    const isMac = window.navigator.userAgent.includes("Macintosh");
    if (isMac) {
      this.hotkeys = new MacKeys();
    } else {
      this.hotkeys = new WindowsKeys();
    }
  }
}

export class HotKeys {
  constructor(gameController, playerRefs) {
    this.gameController = gameController;
    this.playerRefs = {};
    this.isLocked = false;

    playerRefs.forEach((p, idx) => {
      this.playerRefs[idx + 1] = p;
    });

    this.k = new HotkeysChooser().hotkeys;

    this.macCtrlKeyCommand = [];
    this.macCtrlShiftKeyCommand = [];
    this.macAltKeyCommand = [];
    this.macKeyCommand = [];

    this.ctrlKeyCommand = [];
    this.ctrlShiftKeyCommand = [];
    this.altKeyCommand = [];
    this.keyCommand = [];
  }

  get keyCommands() {
    if (this.isMac) {
      return this.macKeyCommand;
    }
    return this.keyCommand;
  }

  get ctrlKeyCommands() {
    if (this.isMac) {
      return this.macCtrlKeyCommand;
    }
    return this.ctrlKeyCommand;
  }

  get ctrlKeyCommandModifier() {
    if (this.isMac) {
      return "command";
    }
    return "ctrl";
  }

  get ctrlShiftKeyCommands() {
    if (this.isMac) {
      return this.macCtrlShiftKeyCommand;
    }
    return this.ctrlShiftKeyCommand;
  }

  get ctrlShiftKeyCommandModifier() {
    if (this.isMac) {
      return "command shift";
    }
    return "ctrl shift";
  }

  get altKeyCommands() {
    if (this.isMac) {
      return this.macAltKeyCommand;
    }
    return this.altKeyCommand;
  }

  get altKeyCommandModifier() {
    if (this.isMac) {
      return "option";
    }
    return "alt";
  }

  lock() {
    this.isLocked = true;
  }

  unlock() {
    this.isLocked = false;
  }

  registerKeyCommand = (key, func, description, os) => {
    if (this.isLocked) return;
    if (os === "mac") {
      this.macKeyCommand.push({ key, func, description });
    } else {
      this.keyCommand.push({ key, func, description });
    }
  };

  registerCtrlKeyCommand = (key, func, description, os) => {
    if (this.isLocked) return;
    if (os === "mac") {
      this.macCtrlKeyCommand.push({ key, func, description });
    } else {
      this.ctrlKeyCommand.push({ key, func, description });
    }
  };

  registerCtrlShiftKeyCommand = (key, func, description, os) => {
    if (this.isLocked) return;
    if (os === "mac") {
      this.macCtrlShiftKeyCommand.push({ key, func, description });
    } else {
      this.ctrlShiftKeyCommand.push({ key, func, description });
    }
  };

  registerAltKeyCommand = (key, func, description, os) => {
    if (this.isLocked) return;
    if (os === "mac") {
      this.macAltKeyCommand.push({ key, func, description });
    } else {
      this.altKeyCommand.push({ key, func, description });
    }
  };

  handleKeyDown = (event) => {
    console.log(event);
    if (this.isMac) {
      this.macCtrlKeyCommand.forEach((command) => {
        this.k.isCtrlKey(event, command.key, command.func);
      });

      this.macCtrlShiftKeyCommand.forEach((command) => {
        this.k.isCtrlShiftdKey(event, command.key, command.func);
      });

      this.macAltKeyCommand.forEach((command) => {
        this.k.isAltKey(event, command.key, command.func);
      });

      this.macKeyCommand.forEach((command) => {
        this.k.isKey(event, command.key, command.func);
      });
    } else {
      this.ctrlKeyCommand.forEach((command) => {
        this.k.isCtrlKey(event, command.key, command.func);
      });

      this.ctrlShiftKeyCommand.forEach((command) => {
        this.k.isCtrlShiftdKey(event, command.key, command.func);
      });

      this.altKeyCommand.forEach((command) => {
        this.k.isAltKey(event, command.key, command.func);
      });

      this.keyCommand.forEach((command) => {
        this.k.isKey(event, command.key, command.func);
      });
    }
  };
}
