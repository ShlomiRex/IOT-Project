# libraries
import datetime
import random
import subprocess
import os
import csv
import datetime
from pymongo import MongoClient



def checkIfUse(prograss, hour):
    if prograss==1:
        if hour > 8 and hour< 18:
            return True
    elif prograss==2: 
        if (hour > 8 and hour< 10) or (hour > 14 and hour< 21):
            return True
    elif prograss==3:
        if hour > 10 and hour< 19:
            return True
    elif prograss==4: 
        if hour > 8 and hour< 16:
            return True
    elif prograss==5:
        if (hour > 9 and hour< 11) or (hour > 13 and hour< 21):
            return True                  
    elif prograss==6: 
        if hour > 7 and hour< 12:
            return True
    elif prograss==7: 
        if (hour > 6 and hour< 12) or (hour > 13 and hour< 21):
            return True
    elif prograss==8: 
        if (hour > 7 and hour< 9) or (hour > 17 and hour< 20):
            return True
    elif prograss==9: 
        if (hour > 15 and hour< 18) :
            return True
    elif prograss==10: 
        if (hour > 9 and hour< 17) or (hour > 18 and hour< 19):
            return True
    elif prograss==11: 
        if (hour > 9 and hour< 20) :
            return True
    elif prograss==12: 
        if (hour > 17 and hour< 19) or (hour > 20 and hour< 23):
            return True
    elif prograss>=13: 
        if random.randint (0, 2) == 0:
            return True
    return False
    
def isMotion (inUse):
    if(inUse and random.randint(0, 30) != 0) or (not inUse and random.randint(0, 20) == 0):
        return 1
    return 0

def upgradeTemp (temp, inUse, lastInUse, hour):
    proportion = 0.3                                        #make it real
    change = 0
    if (inUse):
        change += random.randint(2, 10) * proportion
    elif (lastInUse):
        change -= random.randint(1, 8) * proportion
    if hour < 6:
        change -= random.randint(-1, 7) * proportion
    elif hour < 11:
        change += random.randint(-2, 12) * proportion
    elif hour <14:
        change += random.randint(-2, 20) * proportion
    elif hour < 18:
        change -= random.randint(-2, 8) * proportion
    else:
        change -= random.randint(-2, 18) * proportion
    temp += change
    if(temp > 500):
        temp = 500
    elif temp < 100:
        temp = 100
    return temp

def upgradeLight (light, hour, month):
    proportion = 12                                        #make it real
    change = 0
    max = 3000        #if there is clouds
    if(month < 4 or month > 10):
        if (random.randint (0, 7) == 0 ):
            max = 2000
    elif (random.randint (0, 20)== 0):
        max= 2000

    if hour < 5:
        change -= random.randint(-2, 2) * proportion
    elif hour < 11:
        change += random.randint(-1, 20) * proportion
    elif hour <14:
        change += random.randint(-2, 10) * proportion
    elif hour < 18:
        change -= random.randint(-10, 2) * proportion
    else:
        change -= random.randint(-20, 1) * proportion

    light += change
    if(light > max):
        light = max
    elif light < 800:
        light = 800
    return light

def setLight (naturalLight, isPower):
    if(isPower):
        return (1700 + int(naturalLight*0.2))
    else:
        return naturalLight

def upgradeHumi (humidity, inUse, lastInUse, hour):
    proportion = 1.2                                        #make it real
    change = 0
    if (inUse and not lastInUse):
        change += random.randint(0, 5) * proportion
    elif (lastInUse):
        change -= random.randint(0, 6) * proportion

    if hour < 6:
        change += random.randint(-2, 8) * proportion
    elif hour < 11:
        change -= random.randint(-2, 11) * proportion
    elif hour <14:
        change -= random.randint(-2, 25) * proportion
    elif hour < 18:
        change += random.randint(-2, 8) * proportion
    else:
        change += random.randint(-2, 15) * proportion

    humidity += change
    if(humidity > 1000):
        humidity = 1000
    elif humidity < 100:
        humidity = 100
    return humidity

def createTime(year,month,day,hour,minute):
    month+=1
    day+=1
    if(month < 10):
        month = "0"+str(month)
    else:
        month = str(month)
    if(day < 10):
        day = "0"+str(day)
    else:
        day = str(day)
    if(hour < 10):
        hour = "0"+str(hour)
    else:
        hour = str(hour)
    time = str(year)+"/"+month+"/"+day+" "+hour+":"+str(minute)+"0"
    return datetime.datetime.strptime(time, '%Y/%m/%d %H:%M')




if __name__ == "__main__":
    client = MongoClient('localhost',27017)                                                #fix the port
    db=client.iot                                                              #fix the collection name
    collection = db.esp_sensors
    year="2019"
    DiW=2
    prograss = 0
    randPower=0
    lastInUse = False
    lastInPower = False
    temp = 200     
    humidity = 500 
    naturalLight = 1100                                #make it real
    daysPerMonth = [31,28,31,30,31,30,31,31,30,31,31,31]
    for month in range(8):
        for day in range(daysPerMonth[month]):
            DiW=(1+DiW)%7
            if DiW == 0:
                prograss = 0
            else:
                prograss = random.randint(0, 20)
            for hour in range(24):
                for minute in range(6):
           
                    inUse = checkIfUse(prograss, hour)
                    isPower = (inUse or (lastInUse and random.randint(0, 10) > 0))
                    motion = isMotion(inUse)
                    temp = upgradeTemp(temp, inUse, lastInUse, hour)
                    tempForDb = int (temp / 10)
                    naturalLight = upgradeLight(naturalLight, hour, month)
                    currentLight = setLight(naturalLight,isPower)
                    humidity = upgradeHumi(humidity, inUse, lastInUse, hour)
                    dt = createTime(year,month,day,hour,minute)


                    row = {    #    fields = ["timestamp", "Light", "Motion", "Temp", "Humidity", "InUse"]
                        'timestamp' : dt,
                        'light' : currentLight,
                        'pir' : motion,
                        'temp' : tempForDb,
                        'humid' : int(humidity),
                        'inUse' : inUse
                    }
                    result=collection.insert_one(row)

                    lastInUse = inUse
                    lastIsPower = isPower
