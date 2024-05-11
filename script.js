let slots = {
    MON: {
        Theory: ["A1","F1","D1","TB1","TG1","-","Lunch","A2","F2","D2","TB2","TG2","-","V3"],
        Lab: ["L1","L2","L3","L4","L5","L6","Lunch","L31","L32","L33","L34","L35","L36","-"]
    },
    TUE: {
        Theory: ["B1","G1","E1","TC1","TAA1","-","Lunch","B2","G2","E2","TC2","TAA2","-","V4"],
        Lab: ["L7","L8","L9","L10","L11","L12","Lunch","L37","L38","L39","L40","L41","L42","-"]
    },
    WED: {
        Theory: ["C1","A1","F1","V1","V2","-","Lunch","C2","A2","F2","TD2","TBB2","-","V5"],
        Lab: ["L13","L14","L15","L16","L17","L18","Lunch","L43","L44","L45","L46","L47","L48","-"]
    },
    THU: {
        Theory: ["D1","B1","G1","TE1","TCC1","-","Lunch","D2","B2","G2","TE2","TCC2","-","V6"],
        Lab: ["L19","L20","L21","L22","L23","L24","Lunch","L49","L50","L51","L52","L53","L54","-"]
    },
    FRI: {
        Theory: ["E1","C1","TA1","TF1","TD1","-","Lunch","E2","C2","TA2","TF2","TDD2","-","V7"],
        Lab: ["L25","L26","L27","L28","L29","L30","Lunch","L55","L56","L57","L58","L59","L60","-"]
    }
}

let timetable = [
    {
        id: "CSI2007",
        slot: "G1+TG1",
        type: "ETH",
        venue: "SJT702"
    },
    {
        id: "CSI1007",
        slot: "B1",
        type: "ETH",
        venue: "SJT702"
    },
    {
        id: "CSI1007",
        slot: "L39+L40",
        type: "ELA",
        venue: "SJT416"
    },
    {
        id: "CSI2004",
        slot: "C1+TC1",
        type: "TH",
        venue: "SJT703"
    },
    {
        id: "CSI2005",
        slot: "F2+TF2",
        type: "TH",
        venue: "SJT702"
    },
    {
        id: "STS2022",
        slot: "D1+TD1",
        type: "SS",
        venue: "SJT703"
    },
    {
        id: "MAT1022",
        slot: "G2+TG2",
        type: "TH",
        venue: "SJT602A"
    },
    {
        id: "CSI2003",
        slot: "L23+L24",
        type: "ELA",
        venue: "SJT416"
    },
    {
        id: "CSI2003",
        slot: "E1",
        type: "ETH",
        venue: "SJT703"
    },
    {
        id: "CSI2007",
        slot: "L55+L56",
        type: "ELA",
        venue: "SJT621"
    }
];


theory_times = ['08:00 - 08:50', '09:00 - 09:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '- - -', 'Lunch - Lunch', '14:00 - 14:50', '15:00 - 15:50', '16:00 - 16:50', '17:00 - 17:50', '18:00 - 18:50', '18:51 - 19:00', '19:01 - 19:50']
lab_times = ['08:00 - 08:50', '08:51 - 09:40', '09:51 - 10:40', '10:41 - 11:30', '11:40 - 12:30', '12:31 - 13:20', 'Lunch - Lunch', '14:00 - 14:50', '14:51 - 15:40', '15:51 - 16:40', '16:41 - 17:30', '17:40 - 18:30', '18:31 - 19:20', '- - -']


const days = {
    MON: "MON",
    TUE: "TUE",
    WED: "WED",
    THU: "THU",
    FRI: "FRI",
};
const daysList = [days.MON, days.TUE, days.WED, days.THU, days.FRI];
    
const typeOf = (slot) => {
    return (/^L/.test(slot)) ? "Lab" : "Theory"
}

const hasMultiSlots = (slot) => {
    return /[a-zA-Z]{1,4}[0-9]{1,2}\+[a-zA-Z]{1,4}[0-9]{1,2}/.test(slot)
}

const isOnDay = (slot, day) => {
    let type = typeOf(slot);
    const daySlots = slots[day][type];
    return daySlots.includes(slot);
}

const dayIndex = (slot, day) => {
    let type = typeOf(slot)
    const daySlots = slots[day][type];
    return daySlots.indexOf(slot);
}

const checkMultiSlots = (slot, day) => {
    const status = [];
    let isonday = false;
    if (hasMultiSlots(slot)) {
        let slotList = slot.split('+');
        for (const slot of slotList) {
            status.push(isOnDay(slot,day));
        } 
        isonday = status.some(i => i);
    } else {
        isonday = isOnDay(slot, day);
    }
    return isonday
}

const timeOfSlot = (slot, day) => {
    if (hasMultiSlots(slot)){
        let slotList = slot.split('+')
        let times = [];
        for (const slot of slotList) {
            times = times.concat(timeOfSlot(slot, day));
        }
        return times
    }
    let type = typeOf(slot);
    let occurs = dayIndex(slot, day);
    let from = (type == "Lab") ? lab_times : theory_times;
    return (occurs != -1)?[from[occurs]]:null;
}

class fmt{
    constructor(time) {
        this.time = time;
        this.start = parseInt(time.split("-")[0].split(":").join(""))
        this.end = parseInt(time.split("-")[1].split(":").join(""));
    }
}


function cmp(a, b) {
    const a_fmt = new fmt(a.time);
    const b_fmt = new fmt(b.time);
    if (a_fmt.start > b_fmt.end) {
        return 1;
    } else if (a_fmt.end > b_fmt.start) {
        return -1;
    } else {
        return 0;
    }
}


const formatTiming = (timings) => {
    let timeString = "";
    let times = timings.filter(e => e);
    if (times.length == 2) {
        for (const i in times) {
            if (times[i]) {
                times[i] = times[i].split("-");
            }
        }
        return `${times[0][0]} - ${times[times.length - 1][1]}`;
    } else {
        return times[0];
    }
}

const daySchedule = (day) => {
    let schedule = []
    if (!day) {
        return null;
    } 
    for (const course of timetable) {
        if (!checkMultiSlots(course.slot,day)) {
            console.log("Not on day");
            continue;
        }

        let timing = formatTiming(timeOfSlot(course.slot, day));
        schedule.push({id:course.id,time:timing,venue:course.venue})
    }
    for (let i = 0; i < schedule.length;i++) {
        for (let j = i + 1; j < schedule.length; j++) {
            let compare = cmp(schedule[i], schedule[j]);
            switch (compare) {
                case 1:
                    let temp = schedule[i];
                    schedule[i] = schedule[j];
                    schedule[j] = temp;
                    break;
                case -1:
                    break;
                case 0:
                    break;
            }
        }
    }
    return schedule;
}

const today = new Date();
const day = daysList[today.getDay() - 1] ?? null;

const iframeEle = document.getElementById('frame');
let tableHtml = '<table style="color:white;border: 1px solid white;border-collapse: collapse;"><tr><th style = "border: 1px solid white">Course ID</th><th style = "border: 1px solid white">Time</th><th style = "border: 1px solid white">Venue</th></tr>';
data = daySchedule(days.MON); 
if (!data) {
    iframeEle.contentDocument.body.innerHTML = '<p style="color:white" id="notable">No classes today!</p>';
}
else {
    for (const course of data) {
        tableHtml += `<tr><td style = "border: 1px solid white">${course.id}</td><td style = "border: 1px solid white">${course.time}</td><td style = "border: 1px solid white">${course.venue}</td></tr>`;
    }
    iframeEle.contentDocument.body.innerHTML = '<div style="display:flex;justify-content:center;align-itmes:center">'+ tableHtml+"</div>";
}

function resizeIFrameToFitContent( iFrame ) {

    iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}

window.addEventListener('DOMContentLoaded', function(e) {

    var iFrame = document.getElementById( 'frame' );
    resizeIFrameToFitContent( iFrame );

    // or, to resize all iframes:
    var iframes = document.querySelectorAll("iframe");
    for( var i = 0; i < iframes.length; i++) {
        resizeIFrameToFitContent( iframes[i] );
    }
} );


