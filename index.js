let restrictedKeyCodes = [9, 16, 17, 18, 19, 20, 27, 33, 34, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
let isBooted = false
let isBooting = false
let terminal = document.getElementById("area")

var messages = []
var tempMessages = []
var currentText = ""

function constructP(msg, color) {
    color = color == undefined ? "FFF" : color
    return "<p style=\"color: #" + color + ";\">" + msg + "</p>"
}

function updateText() {
    terminal.innerHTML = ""
    messages.forEach(msg => {
        terminal.innerHTML += msg
    });
    terminal.scrollTop = terminal.scrollHeight + 10
    terminal.innerHTML += constructP(currentText, "FFF")
}

function scriptReader(p, delay, isTemp, overwriteTemp) {
    delay = typeof delay == 'undefined' ? 0 : delay
    return new Promise(resolve => {
        setTimeout(() => {
            sendText(p, isTemp, overwriteTemp)
            resolve()
        }, delay)
    })
}

function sendText(p, isTemp, overwriteTemp) {
    if (!isTemp) {messages.push(p)} else {tempMessages.push(p)}
    if (overwriteTemp && isTemp) {tempMessages = [p]} else {
        if (overwriteTemp) tempMessages = []
    }
    updateText()
    tempMessages.forEach(item => {
        terminal.innerHTML += item
    });
}

async function scriptPlayer(script) {
    for (const line of script) {
        let msg = line.split("/")[0]
        let delay = line.split("/")[1]
        let color = line.split("/")[2]
        let options = line.split("/")[3].split("")
        color = color == '' ? "FFF" : color
        options[0] = typeof options[0] == 'undefined' ? 0 : options[0]
        options[1] = typeof options[1] == 'undefined' ? 0 : options[1]
        temp = options[0] == '0' ? false : true
        overwrite = options[1] == '0' ? false : true
        await scriptReader(constructP(msg, color), delay, temp, overwrite)
    }
}

function input(e) {
    if (isBooting) return
    if (!isBooted) return boot()

    var isRestricted = false
    restrictedKeyCodes.forEach(code => {
        if (code == e.keyCode) isRestricted = true
    });
    if (isRestricted) return
    switch(e.keyCode) {
        case 8:
            currentText = currentText.slice(0, -1)
        break;
        case 13:
            messages.push(constructP(currentText))
            currentText = ""
        break;
        default:
            currentText += e.key
        break;
    }
    updateText()
}

async function boot() {
    isBooting = true
    await scriptPlayer(bootScript)
    isBooted = true
    isBooting = false
}

sendText(constructP('SCP FOUNDATION Workstation Alternate Access Link Network (WAALN)','ff0'), true)
sendText(constructP('>>> TERMINAL OFFLINE. PRESS ANY KEY TO BOOT <<<', 'ff0'), true)

//scripts
/*
constructP / delay / color / options (XX)

options first value is isTemp, second is overwriteTemp
default for options is 00.

constructP(msg, color)
*/
let bootScript = ["--- BOOTING UP TERMINAL (WAALN)//ff0/01","Checking Interface./400//10","Checking Interface../400//11","Checking Interface.../400//11","Checking Interface.../200//01","Welcome, user!/600//","sudo -t='192.168.200.140' connect_terminal/300/ff0/","WAALN Interface Client v2.20///", "[]: Checking validity of certificate.../200//", "[]: Transferring privillages [█-----]/500//11", "[]: Transferring privillages [██----]/500//11","[]: Transferring privillages [███---]/500//11","[]: Transferring privillages [████--]/500//11","[]: Transferring privillages [█████-]/500//11","[]: Transferring privillages [██████]/500//01","[]: Complete///","--- checking stability of connection/600/ff0/", "--- connection established and verified/1200/ff0/","<br>///",">>> TERMINAL CONNECTED. RESUMING NORMAL BOOT... <<</300/ff0/", "<br>/1000//","Foundation Terminal (Workstation Edition) v2.20///","Facility status: BREACHED - Follow Class-EK evacuation proceedure immediately.//f00/","<br>///"]