# -*- coding: utf-8 -*-

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from tutorial.items import TutorialItem
from scrapy import Selector
import re
from pymongo import MongoClient
import os
from unidecode import unidecode






class MarcaSpider(BaseSpider):

    teamsList = ['alaves', 'athletic', 'atletico', 'betis', 'celta', 'deportivo', 'eibar', 
        'barcelona', 'granada','leganes', 'malaga', 'osasuna', 'real-madrid', 'espanyol', 'real-sociedad', 
        'sevilla', 'sporting', 'las-palmas', 'valencia', 'villarreal']

    name = "marca"
    allowed_domains = ["marca.com"]
    start_urls = ["http://www.marca.com/futbol/primera-division.html"] + ['http://www.marca.com/futbol/'+ team +'.html' for team in teamsList]


    def parse(self, response):
        news_list_str = response.css("[class=container]").css("[class=auto-items]").extract()[0]
        sel = Selector(text = news_list_str, type = 'html')
        items = []
        for news in sel.xpath('//li//article'):
            team = re.sub('^[\s]|[\n]', '', news.css('[class=ribbon] span::text').extract()[1]).lower()
            teams = self.get_team(team)
            if teams:
                title = news.css('[class=mod-header]').css('[class=mod-title] a::text').extract()[0].replace('\n','')
                url = news.css('[class=mod-header]').css('[class=mod-title] a::attr(href)').extract()[0].replace('\n','')
                image = news.css('[class=multimedia-item]').css('img::attr(src)').extract()[0]
                for t in teams:
                    item = {}
                    item['team'] = t
                    item['title'] = title
                    item['url'] = url
                    item['image'] = image
                    item['source'] = 'Marca'
                    items.append(item)
        
        self.database_connection().insert_many(items)




    def database_connection(self):
        script = os.path.basename(__file__)

        #DB NER
        dbdb = os.getenv('MONGO_DATABASE',None)
        dbhost = os.getenv('MONGO_HOST',None)
        dbport = os.getenv('MONGO_PORT',None)
        dbuser = os.getenv('MONGO_USER',None)
        dbpass = os.getenv('MONGO_PASS',None)
        dbcoll = os.getenv('MONGO_COLL',None)

        
        #Info corridas
        otherClient = MongoClient('mongodb://'+dbuser+':'+dbpass+'@'+dbhost+':'+dbport+'/'+dbdb)
        db = otherClient[dbdb]
        news_data = db['news-data']

        return news_data

    def get_team(self, team):
        teamsList = ['alaves', 'athletic', 'atletico', 'betis', 'celta', 'deportivo', 'eibar', 
        'barcelona', 'granada','leganes', 'malaga', 'osasuna', 'real', 'espanyol', 'real', 
        'sevilla', 'sporting', 'palmas', 'valencia', 'villarreal']
        teams = None
        team = re.sub('\d', '', team).lower()
        team = re.sub(' +',' ',team)
        team = unidecode(team)
        if '-' in team:
            for t in team.split('-'):
                isTeam = False
                for word in re.sub('^[\s]|[\s]$', '', t).split(' '):
                    if word in teamsList:
                        isTeam = True

                if isTeam:
                    if teams == None:
                        teams = []
                    teams.append(re.sub('^[\s]|[\s]$', '', t))
        else:
            isTeam = False
            for word in re.sub('^[\s]|[\s]$', '', team).split(' '):
                if word in teamsList:
                    isTeam = True

            if isTeam:
                if teams == None:
                    teams = []
                teams.append(re.sub('^[\s]|[\s]$', '', team))

        return teams