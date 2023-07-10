let restrictedKeyCodes = [9, 16, 17, 18, 19, 20, 27, 33, 34, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
let isBooted = false
let isBooting = false
let terminal = document.getElementById("area")

var cosmeticDirLength = 0

var messages = []
var tempMessages = []
var currentText = ""
var environment = {
    'System' : {
        'ServerLogs' : {

        },
        'Updates' : {

        },
        'SystemLogs' : {

        }
    },
    'User' : {
        'Files' : {

        },
        'Worksheets' : {

        },
        'Entries' : {

        },
        'Messages' : {
            'Site-02' : {

            },
            'Director' : {

            },
            'Dr.Brian' : {

            },
            'Dr.Edna' : {

            },
            'Researcher.Dan' : {

            },
            'Security.Philip' : {

            },
            'Security.Erik' : {

            },
            'Security.Yu' : {

            }
        },
        'LiveUpdates' : {

        }
    },
    'InjectedFiles' : {
        'Classified' : {

        },
        'StabilityLogs' : {

        }
    }
}
var working_directory = []

function constructP(msg, color) {//constructs p elements
    color = color == undefined ? "FFF" : color
    return "<p style=\"color: #" + color + ";\">" + msg + "</p>"
}

function updateText() {//update text
    terminal.innerHTML = ""
    messages.forEach(msg => {
        terminal.innerHTML += msg
    });
    terminal.scrollTop = terminal.scrollHeight
    terminal.innerHTML += constructP(currentText, "FFF")
}

function scriptReader(p, delay, isTemp, overwriteTemp) {//dependency of scriptPlayer
    delay = typeof delay == 'undefined' ? 0 : delay
    return new Promise(resolve => {
        setTimeout(() => {
            sendText(p, isTemp, overwriteTemp)
            resolve()
        }, delay)
    })
}

function sendText(p, isTemp, overwriteTemp) {//sends and updates text
    if (!isTemp) {messages.push(p)} else {tempMessages.push(p)}
    if (overwriteTemp && isTemp) {tempMessages = [p]} else {
        if (overwriteTemp) tempMessages = []
    }
    updateText()
    tempMessages.forEach(item => {
        terminal.innerHTML += item
    });
}

async function scriptPlayer(script) { //uses script reader to play script
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

function getLocation() {
    var env = environment
    working_directory.forEach(el => {
        env = env[el]
    });
    return env
}

function getCosmeticDir() {
    var dir = "C://"
    working_directory.forEach(el => {
        dir += el + "/"
    });
    dir += "> "
    cosmeticDirLength = dir.length
    return dir
}

function runCommand(cmd) {
let operator = cmd.split(" ")[1]
let params = cmd.split(" ")
switch(operator) {
    case "cd" :
        let found = false
        if (params[2] == "..") {
            working_directory.pop()
            return
        }
        Object.keys(getLocation()).forEach(el => {
            if (el == params[2]) {
                if (typeof getLocation()[el] !== 'object') return
                working_directory.push(el)
                found = true
            }
        });
        if (!found) sendText(constructP('Cannot find specified path.'))
    break;
    case "ls" :
        let keys = Object.keys(getLocation())
        let horizontalOverflow = 4
        let horiz = 0
        var result = ""
        keys.forEach((el, i) => {
            result += el
            horiz++
            if (horiz == horizontalOverflow) {
                result += "<br>"
                return
            }
            if (keys.length - 1 > i) result += ", "
        });
        sendText(constructP(result))
    break;
}
}


function input(e) { //handles input -calls runCommand when enter is pressed
    if (isBooting) return
    if (!isBooted) return boot()

    var isRestricted = false
    restrictedKeyCodes.forEach(code => {
        if (code == e.keyCode) isRestricted = true
    });
    if (isRestricted) return
    switch(e.keyCode) {
        case 8:
            if (currentText.length <= cosmeticDirLength) return
            currentText = currentText.slice(0, -1)
        break;
        case 13:
            messages.push(constructP(currentText))
            runCommand(currentText)
            currentText = getCosmeticDir()
        break;
        default:
            currentText += e.key
        break;
    }
    updateText()
}

async function boot() { //enables isBooted
    isBooting = true
    await scriptPlayer(bootScript)
    isBooted = true
    isBooting = false
    input({'keyCode' : 13, 'key': ''})
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
let bootScript = ["--- BOOTING UP TERMINAL (WAALN)//ff0/01","Checking Interface./400//10","Checking Interface../400//11","Checking Interface.../400//11","Checking Interface.../200//01","Welcome, user!/600//","sudo -t='192.168.200.140' connect_terminal/300/ff0/","WAALN Interface Client v2.20///", "[]: Checking validity of certificate.../200//", "[]: Transferring privillages [█-----]/500//11", "[]: Transferring privillages [██----]/500//11","[]: Transferring privillages [███---]/500//11","[]: Transferring privillages [████--]/500//11","[]: Transferring privillages [█████-]/500//11","[]: Transferring privillages [██████]/500//01","[]: Complete///","--- checking stability of connection/600/ff0/", "--- connection established and verified/1200/ff0/","<br>///",">>> TERMINAL CONNECTED. RESUMING NORMAL BOOT... <<</300/ff0/", "<br>/1000//","Foundation Terminal (Workstation Edition) v2.20///","Facility status: BREACHED - Follow Class-EK evacuation proceedure immediately.//fa0/","<br>///"]
