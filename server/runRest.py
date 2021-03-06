#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket, os
from flask import Flask,jsonify,request,g
from bson import json_util
from bson.objectid import ObjectId
import json
from flask_cors import CORS, cross_origin
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from functools import wraps
from pymongo import MongoClient
import httplib
from random import randint

auth = HTTPBasicAuth()
app = Flask(__name__)
CORS(app,supports_credentials=False)

app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
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
news_data = db['news-data']


#users = db["users"]


#leagues = {426: 'Premier League (Inglaterra)', 430: 'Bundesliga (Alemania)', 433: 'Eredivisie (Holanda)', 434: 'Ligue 1 (Francia)', 436: 'LaLiga Santander (España)', 438: 'Serie A (Italia)', 439: 'Primeira Liga (Portugal)', 440: 'Champions League'}
leagues = {436: {'name' :'Primera Division 2016/17', 'logo':'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQydRXL7i4m2yO-6ysRDGVwBrMk80o4UiBe7SjlcIeKPoI7ldacxg'}, 
438: {'name': 'Serie A 2016/17', 'logo': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSrJppTvzFKBrv8nys8XNQTxwR3kotjSV5HYZmIZYkKpZyRPnlQ4g'}}
#, 426: {'name' : 'Premier League 2016/17', 'logo': 'http://sportsopendata.net/wp-content/uploads/2016/08/Premier_League_Logo_2016-1.png' }}


def hash_password(password):
    return pwd_context.encrypt(password)

def verify_password(user, password):
    return pwd_context.verify(password, user['password'])

def generate_auth_token(user,expiration=600):	
    s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
    return s.dumps({'id': str(user['_id'])})

def verify_auth_token(token):
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None    # valid token, but expired
    except BadSignature:
        return None    # invalid token
    user = users.find_one({'_id':ObjectId(data['id'])})
    return user


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response
        g.user = verify_auth_token(request.headers.get('Authorization'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/webir2016/api/signup', methods=['POST'])
def signup():
    if not request.json.get('pin',None) or request.json['pin'] != os.getenv('SIGNUP_PIN',None):
        response = jsonify(message='Wrong signup PIN')
        response.status_code = 401
        return response
    if not request.json.get('email',None) or not request.json.get('password',None):
        response = jsonify(message='Wrong signup data')
        response.status_code = 401
        return response
    if users.find_one({'email':request.json.get('email',None)}):
       response = jsonify(message='User exists')
       response.status_code = 422
       return response
    user = {'email':request.json['email'].lower(), 'password': hash_password(request.json['password'])}
    users.insert_one(user)
    token = generate_auth_token(user)
    return jsonify({ 'token': token.decode('ascii') })

@app.route('/webir2016/api/leagues', methods = ['GET'])
#@login_required
def get_leagues_info():
    try:
        leagues_list = []
        leagues_response = {}
        for league in list(leagues.keys()):
            #league_in_db = league_data.find_one({'league_id' : league})
            url = 'http://api.football-data.org/v1/competitions/' + str(league) + '/leagueTable'
            connection.request('GET', url, None, headers )
            response = json.loads(connection.getresponse().read().decode('utf-8'))
            response['league_id'] = league
            response['league_logo'] = leagues[int(league)]['logo']
            leagues_list.append(response)

        leagues_response['leagues'] = leagues_list
        print leagues_response['leagues']
        return jsonify(**leagues_response)
    except Exception, e:
        print "AAAAAA"
        return jsonify(error='Error', exception=str(e))

@app.route('/webir2016/api/search', methods = ['GET'])
#@login_required
def get_search_items():
    try:
        search_list = []
        search_response = {}
        for league in list(leagues.keys()):
            #league_in_db = league_data.find_one({'league_id' : league})
            url = 'http://api.football-data.org/v1/competitions/' + str(league) + '/leagueTable'
            connection.request('GET', url, None, headers )
            response = json.loads(connection.getresponse().read().decode('utf-8'))
            l = {}
            l['name'] = response['leagueCaption']
            l['id'] = league
            l['logo'] = leagues[int(league)]['logo']
            l['matchday'] = response['matchday']
            l['type'] = 'LIGA'
            search_list.append(l)
            for team in response['standing']:
                t = {}
                t['name'] = team['team']
                t['id'] = team['teamId']
                t['logo'] = team['crestURI']
                t['type'] = 'EQUIPO'
                search_list.append(t)

        search_response['search'] = search_list
        #print leagues_response['leagues']
        return jsonify(**search_response)
    except Exception, e:
        print "AAAAAA"
        return jsonify(error='Error', exception=str(e))

@app.route('/webir2016/api/leaguematchday', methods = ['GET'])
def get_league_matchday():
    try:
        matchday = request.args.get('matchday',None)
        league_id = request.args.get('league', None)
        url = 'http://api.football-data.org/v1/competitions/' + str(league_id) + '/fixtures?matchday=' + str(matchday)
        connection.request('GET', url, None, headers )
        response = json.loads(connection.getresponse().read().decode('utf-8'))
        response['league_id'] = league_id
        response['matchday'] = matchday
        response['league_name'] = leagues[int(league_id)]['name']
        response['league_logo'] = leagues[int(league_id)]['logo']
        return jsonify(**response)
    except Exception, e:
        return jsonify(error='Error', exception=str(e))

@app.route('/webir2016/api/league', methods = ['GET'])
def get_league():
    try:
        matchday = request.args.get('matchday',None)
        league_id = request.args.get('league', None)
        url = 'http://api.football-data.org/v1/competitions/' + str(league_id) + '/fixtures?matchday=' + str(matchday)
        connection.request('GET', url, None, headers )
        response = json.loads(connection.getresponse().read().decode('utf-8'))
        response['league_id'] = league_id
        response['matchday'] = matchday
        response['league_logo'] = leagues[int(league_id)]['logo']

        url = 'http://api.football-data.org/v1/competitions/' + str(league_id) + '/leagueTable'
        connection.request('GET', url, None, headers )
        response_league = json.loads(connection.getresponse().read().decode('utf-8'))
        response['league_standing'] = response_league['standing']
        response['league_name'] = response_league['leagueCaption']

        news_db = list(news_data.find({'league_id' : int(league_id)}))
        print len(news_db)
        news_list = []
        for i in range(0,9):
            news_list.append(news_db[randint(0,len(news_db) - 1)])

        idx = 0
        for data in news_list:
            data[u'_id'] = str(data[u'_id'])
            data[u'index'] = idx
            idx += 1

        response['league_news'] = news_list

        return jsonify(**response)
    except Exception, e:
        return jsonify(error='Error', exception=str(e))

@app.route('/webir2016/api/teaminfo', methods = ['GET'])
def get_team_info():
    try:
        team_id = request.args.get('team', None)
        ret_info = {}
        #Obtengo la info general del cuadro
        url = 'http://api.football-data.org/v1/teams/' + str(team_id)
        connection.request('GET', url, None, headers )
        team_info = json.loads(connection.getresponse().read().decode('utf-8'))
        ret_info['name'] = team_info['name']
        ret_info['shortName'] = team_info['shortName']
        ret_info['squadMarketValue'] = team_info['squadMarketValue']
        ret_info['logo'] = team_info['crestUrl']
        ret_info['team_id'] = team_id
        

        #Obtengo los jugadores del cuadro
        url = 'http://api.football-data.org/v1/teams/' + str(team_id) + '/players'
        connection.request('GET', url, None, headers )
        players_info = json.loads(connection.getresponse().read().decode('utf-8'))
        ret_info['team_players'] = {}
        ret_info['team_players']['count'] = players_info['count']
        newlist = sorted(players_info['players'], key=lambda k: k['jerseyNumber']) 
        ret_info['team_players']['players'] = newlist
        
        #Obtengo los partidos del cuadro
        url = 'http://api.football-data.org/v1/teams/' + str(team_id) + '/fixtures'
        connection.request('GET', url, None, headers )
        fixtures_info = json.loads(connection.getresponse().read().decode('utf-8'))
        ret_info['team_fixtures'] = {}
        ret_info['team_fixtures']['count'] = fixtures_info['count']
        ret_info['team_fixtures']['fixtures'] = fixtures_info['fixtures']

        return jsonify(**ret_info)

    except Exception, e:
        print e
        return jsonify(err0r='Error', exception=str(e))

@app.route('/webir2016/api/leaguenews', methods = ['GET'])
def get_league_news():
    try:
        league_id = request.args.get('league', None)
        news_db = list(news_data.find({'league_id' : league_id}))
        news_list = []
        for i in range(0,9):
            news_list.append(news_db[randint(0,len(news_db) - 1)])

        idx = 0
        for data in news_list:
            data[u'_id'] = str(data[u'_id'])
            data[u'index'] = idx
            idx += 1

        news = {}
        news['league_news'] = news_list
        news['league_name'] = leagues[int(league_id)]['name']
        return jsonify(**news)
    except Exception, e:
        return jsonify(err0r = 'Error', exception = str(e))

@app.route('/webir2016/api/teamnews', methods = ['GET'])
def get_team_news():
    try:   
        idx = 0
        team_id = int(request.args.get('team', None))

        news_list = list(news_data.find({'team' : team_id}))
        for data in news_list:
            data[u'_id']=str(data[u'_id'])
            data[u'index'] = idx
            idx += 1

        news = {}
        news['team'] = team_id
        news['count'] = len(news_list[:10])
        news['team_news'] = news_list[:10]
        return jsonify(**news)
    except Exception, e:
        return jsonify(err0r = 'Error', exception=str(e))

@app.route('/webir2016/api/matchnews', methods = ['GET'])
def get_match_news():
    try:
        news_ret = {}
        for i in [1,2]:
            idx = 0
            team_id = int(request.args.get('team' + str(i), None))

            news_list = list(news_data.find({'team' : team_id}))
            for data in news_list:
                data[u'_id']=str(data[u'_id'])
                data[u'index'] = idx
                idx += 1

            news = {}
            news['team'] = team_id
            news['count'] = len(news_list[:10])
            news['team_news'] = news_list[:10]


            url = 'http://api.football-data.org/v1/teams/' + str(team_id)
            connection.request('GET', url, None, headers )
            team_info = json.loads(connection.getresponse().read().decode('utf-8'))
            news['team_name'] = team_info['name']
            news['team_logo'] = team_info['crestUrl']
            news_ret['team' + str(i)] = news



        url = 'http://api.football-data.org/v1/teams/' + str(news_ret['team1']['team']) + '/fixtures'
        connection.request('GET', url, None, headers)
        fixtures = json.loads(connection.getresponse().read().decode('utf-8'))['fixtures']
        matches = []
        for match in fixtures:
            if match['homeTeamName'] == news_ret['team2']['team_name'] or match['awayTeamName'] == news_ret['team2']['team_name']:
                if match['awayTeamName'] == news_ret['team2']['team_name']:
                    news_ret['match'] = match
                matches.append(match)
                continue

        news_ret['matches'] = matches


        return jsonify(**news_ret)
    except Exception, e:
        return jsonify(err0r = 'Error', exception=str(e))


@app.route('/classify/api/login', methods=['POST'])
def login():
    user = users.find_one({'email':request.json.get('email',None)})
    if not user or not verify_password(user,request.json['password']):
        response = jsonify(message='Wrong Email or Password',debug = hash_password(request.json['password']))
        response.status_code = 401
        return response
    token = generate_auth_token(user)
    return jsonify({ 'token': token.decode('ascii') })


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=6666,threaded=True)
    
