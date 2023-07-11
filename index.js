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
    case "open" :
        var foundFile = false
        Object.keys(getLocation()).forEach(el => {
            if (el == params[2]) {
                if (typeof getLocation()[el] == 'object') return
                //read or run
                foundFile = true
            }
        });
        if (!foundFile) sendText(constructP('Cannot find specified file.'))
    break;
    case "help" :
        
    break;
    case "time" :
        returnTime()
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

//time loop crash
let deviation = Math.round(Math.random()*60)
var timeleft = 180
var mins = 3
var seconds = 0

timeleft = timeleft - deviation

function updateTime() {
    seconds = timeleft
    mins = Math.round(seconds / 60)
    seconds = seconds % 60
    timeleft--
}

function crash() {
    updateTime()
    if (timeleft <= 0) {
        console.log('crash')
        timeleft = 180
    }
}

//use setinterval cause its easier and makes for unpredictability.
setInterval(() => {crash()}, 1000)

sendText(constructP('SCP FOUNDATION Workstation Alternate Access Link Network (WAALN)','ff0'), true)
sendText(constructP('>>> TERMINAL DISCONNECTED. PRESS ANY KEY TO BOOT <<<', 'ff0'), true)


//scripts
/*
constructP / delay / color / options (XX)

options first value is isTemp, second is overwriteTemp
default for options is 00.

constructP(msg, color)
*/
function returnTime() {
sendText(constructP('[PROTOCOL]: Estimated time until reality playback: ' + mins + ":" + seconds + ".","ff0"))
}

var bootScript = ["[PROTOCOL]: Setting up WAALN connection...//ff0/01","[PROTOCOL]: Attempting to secure connection./3000/ff0/","[PROTOCOL]: Secure connection failed, injecting TROJAN. [-----]/1000/ff0/10","[PROTOCOL]: Secure connection failed, injecting TROJAN. [█----]/1000/ff0/11","[PROTOCOL]: Secure connection failed, injecting TROJAN. [██---]/1000/ff0/11","[PROTOCOL]: Secure connection failed, injecting TROJAN. [███--]/1000/ff0/11","[PROTOCOL]: Secure connection failed, injecting TROJAN. [████-]/1000/ff0/11","[PROTOCOL]: Secure connection failed, injecting TROJAN. [█████]/1000/ff0/01", "[PROTOCOL]: Deploying payload./500/ff0/","[PROTOCOL]: Privillages transferred successfully./3000/ff0/","Welcome, user!///","Foundation Workstation v2.20 (FWprofessional)///","<br>///","Service wide notice: FACILITY IS BREACHED.//f50/","An immediate XK-Class scenario threat has been detected by our systems. //f50/","MTF Forces within 7 klicks will arrive shortly.//f50/","Their mission is to contain the threat, do not expect help from them.//f50/","<br>///","You have 6 new messages!///","///"]


