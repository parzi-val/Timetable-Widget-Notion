from enum import Enum
import re
from datetime import datetime


class days(Enum):
    MON = "mon"
    TUE = "tue"
    WED = "wed"
    THU = "thu"
    FRI = "fri"

class compare:
    def __init__(self,value):
        self.value = value
        self.end = int("".join(self.value[8:].split(":")))
        self.start = int("".join(self.value[:6].split(":")))
    
    def __gt__(self,other):
        return self.start > other.end

    def __eq__(self,other):
        return self.start == other.start
    
    def __lt__(self,other):
        return self.end < other.start
    

with open("slots.txt","r") as f:
    text = f.read()

text = text.split('\n')

times = [i.split("\t") for i in text[:4]]
theory_times,lab_times = times[:2],times[2:4]

theory_times = [f"{theory_times[0][i]} - {theory_times[1][i]}" for i,_ in enumerate(theory_times[0])]
lab_times = [f"{lab_times[0][i]} - {lab_times[1][i]}" for i,_ in enumerate(lab_times[0])]


text = [i.split("\t") for i in text[4:]]

daysList = [days.MON,days.TUE,days.WED,days.THU,days.FRI]

multiStatus = lambda string: re.match(r"[a-zA-Z]{1,4}[0-9]{1,2}\+[a-zA-Z]{1,4}[0-9]{1,2}",string)

def getTimes(slot,day):
    index = -1

    if multiStatus(slot):
        slots = slot.split("+")
        times = []

        for i in slots:
            times.extend(getTimes(i,day))
        
        return times
    
    labStatus = slot.startswith("L")
    day = daysList.index(day)+1
    dayIndex = day*2-1 if labStatus else day*2-2

    for i in range(1,15):
        index = i if text[dayIndex][i] == slot else index
    
    time = lab_times[index] if labStatus else theory_times[index]
    return [time] if index != -1 else []


with open("timetable.txt","r") as f:
    timetable = f.read()

timetable = tuple(
            map(lambda x: x.split("-"),
                set(map(lambda x: x.strip(),
                        timetable.split("\n")))))

courses = {}

for record in timetable:
    slot,courseID,type,venue = record
    if f"{courseID} {type}" in courses.keys():
        existingSlot = courses[f"{courseID} {type}"][0]
        slot = f"{existingSlot}+{slot}"
    courses[f"{courseID} {type}"] = [slot,type,venue]

day = days.MON


def getDayTimeTable(day:days):
    day_timetable = {}

    for k,v in courses.items():
        if (time := getTimes(v[0],day)):
            if any(time):
                time = [i for i in time if i]
                augment = lambda time : [i.split("-") for i in time]
                time = f"{augment(time)[0][0]}-{augment(time)[-1][-1]}" if len(time) > 1 else time[0]
                day_timetable[k] = time


    day_timetable = list(day_timetable.items())
    return day_timetable

def cmp(item):
    return compare(item[1])



#['TD1+D1', 'SS', 'SJT703', '10:00 - 10:50']

def jsonify(key,res):
    res = {
        'id'   : key,
        'slot' : res[0],
        'type' : res[1],
        'venue': res[2],
        'time' : res[3],
    }
    return res


def response(day=None):
    day = day if day or day == 0 else datetime.now().weekday() 
    print(day)
    try:
        (tt := getDayTimeTable(daysList[day])).sort(key=cmp)
    except IndexError as e:
        res = {'classes' : None}
    else:
        res = {
            'classes':[jsonify(key,courses[key]+[val]) for key,val in tt]
        }
    return res


