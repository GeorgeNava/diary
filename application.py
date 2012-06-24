#!/usr/bin/python

# Bottle.py is the only dependency

import bottle as app
import models

app.debug(True)

@app.route('/')
def index():
    return app.template('diary')


#---- API -------------------------------------------------


@app.route('/api/:date',method='GET')
def apiGetActivities(date=None):
    data = models.getActivities(date)
    return data

@app.route('/api/:date',method='POST')
def apiSaveActivity(date=None):
    models.saveActivity(date,app.request.forms.get('text'))
    return '{"status":200}'

@app.route('/api/:date',method='DELETE')
def apiDropActivity(date=None):
    models.dropActivity(date)
    return '{"status":200}'


application = app.default_app()


#---- END -------------------------------------------------
