#!/usr/bin/python

import pymongo,json




#---- MONGO -----------------------------------------------

_host = 'yourHost'
_port = 'yourPort'
_user = 'yourUser'
_pswd = 'yourPass'
_conn = pymongo.Connection(_host,_port)
db    = _conn['diary']
db.authenticate(_user,_pswd)




#---- CALENDAR --------------------------------------------

"""
calendar = {
    _id  : '201209260400'
    ymd  : '20120926'
    text : 'Wake up and hack the world!'
}
"""

def getActivities(date):
    # get all activities for the day, one per hour
    recs = db.calendar.find({'ymd':date[0:8]}).sort('_id',1)
    list = [[item['_id'],item['text']] for item in recs]
    data = {"status":200,"date":date,"list":list}
    return json.dumps(data)

def saveActivity(date,text):
    if not text: return False
    rec = db.calendar.find_one({'_id':date})
    if rec:
        rec['text'] = text
        db.calendar.save(rec)
    else:
       db.calendar.insert({'_id':date,'ymd':date[0:8],'text':text})
    return True

def dropActivity(date):
    if not date: return False
    db.calendar.remove({'_id':date})
    return True




#---- END -------------------------------------------------