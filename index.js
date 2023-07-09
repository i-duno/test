let restrictedKeyCodes = [9, 16, 17, 18, 19, 20, 27, 33, 34, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
let isBooted = false
let terminal = document.getElementById("area")

//scripts
let bootScript = ["Foundation 12.0 (Workstation Edition)/fff/0","Kernel 5.3-1102w2 on x86_64 (tty1)/fff/1000","<br>//100", "[BOOT]: Verifying credentials.../fff/2000","serverlogin: logix/3c3/400","password: ••••••••••/3c3/400","certificate: Tuesday Feb 23 16:52:21 on tty1/f33/400","signature: 984TJD=130A/3c3/400","server code: 200 (OK)/3c3/400","server certificate: trusted/3c3/400","server platform: Apache HTTP/3c3/400","<br>//600","[BOOT]: Fixing certificate.../fff/2000","[CERTIFICATE]: Generating.../fff/50","[CERTIFICATE]: Parsing.../fff/200","[CERTIFICATE]: Applying.../fff/300","[CERTIFICATE]: Finsihed!/fff/2000","[BOOT]: All components fine./fff/500","[BOOT]: Risk score: 13/ff0/300","[BOOT]: Launching.../fff/400","<br>//5000"]
var messages = []
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
    terminal.scrollTop = terminal.scrollHeight
    terminal.innerHTML += constructP(currentText, "FFF")
}

function sendText(p) {
    messages.push(p)
    updateText()
}

function scriptPlayer(script) {
    var timer = 0
    let promise = new Promise(finish => {
    script.forEach(line => {
        let msg = line.split("/")[0]
        let color = line.split("/")[1]
        let delay = line.split("/")[2]
        timer = timer + Number(delay)
        setTimeout(() => {
            sendText(constructP(msg, color))
        }, timer)
    });
    finish()
})

promise.then(
    function() {return 'done'}
)
}

function input(e) {
    if (isBooted) return boot()
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