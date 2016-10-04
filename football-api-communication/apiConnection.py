#!/bin/python
# -*- coding: utf-8 -*-

from pymongo import MongoClient
import time
import sys
import datetime
import os
import json
import httplib

script = os.path.basename(__file__)

#DB NER
dbdb = os.getenv('MONGO_DATABASE',None)
dbhost = os.getenv('MONGO_HOST',None)
dbport = os.getenv('MONGO_PORT',None)
dbuser = os.getenv('MONGO_USER',None)
dbpass = os.getenv('MONGO_PASS',None)
dbcoll = os.getenv('MONGO_COLL',None)




connection = httplib.HTTPConnection('api.football-data.org')
headers = { 'X-Auth-Token': 'd34fb39b00c3449f90aee2c1ac91c908', 'X-Response-Control': 'minified' }

#Info corridas
otherClient = MongoClient('mongodb://'+dbuser+':'+dbpass+'@'+dbhost+':'+dbport+'/'+dbdb)
db = otherClient[dbdb]
league_data = db['league-data']
match_data = db['match-data']



leagues = {426: 'Premier League (Inglaterra)', 430: 'Bundesliga (Alemania)', 433: 'Eredivisie (Holanda)', 434: 'Ligue 1 (Francia)', 436: 'LaLiga Santander (España)', 438: 'Serie A (Italia)', 439: 'Primeira Liga (Portugal)', 440: 'Champions League'}

def getLeaguesInfo():
    for league in list(leagues.keys()):
        league_in_db = league_data.find_one({'league_id' : league})
        url = 'http://api.football-data.org/v1/competitions/' + str(league) + '/leagueTable'
        connection.request('GET', url, None, headers )
        response = json.loads(connection.getresponse().read().decode('utf-8'))
        if league_in_db:
            league_data.update_one({'_id' : league_in_db['_id']}, {'$set':{'matchday' : response['matchday']}})
        else:
            response['league_id'] = league
            league_data.insert_one(response)

    return None


def getLeagueMatchday(league_id, matchday):
    leagueMatchday = match_data.find_one({'league_id': league_id, 'matchday': matchday})
    if leagueMatchday:
        return leagueMatchday
    else:
        url = 'http://api.football-data.org/v1/competitions/' + str(league_id) + '/fixtures?matchday=' + str(matchday)
        connection.request('GET', url, None, headers )
        response = json.loads(connection.getresponse().read().decode('utf-8'))
        response['league_id'] = league_id
        response['matchday'] = matchday
        match_data.insert_one(response)
        return response

getLeaguesInfo()
print getLeagueMatchday(426, 8)



