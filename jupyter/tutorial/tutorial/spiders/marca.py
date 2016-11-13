# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import HtmlXPathSelector
from tutorial.items import TutorialItem
from scrapy import Selector
import re
from pymongo import MongoClient
import os
from unidecode import unidecode






class MarcaSpider(Spider):

    teamsList = ['alaves', 'athletic', 'atletico', 'betis', 'celta', 'deportivo', 'eibar', 
        'barcelona', 'granada','leganes', 'malaga', 'osasuna', 'real-madrid', 'espanyol', 'real-sociedad', 
        'sevilla', 'sporting', 'las-palmas', 'valencia', 'villarreal']

    teams_dict = {'atletico de madrid': 78,'real madrid': 86,'sevilla': 559,'barcelona': 81,'villarreal': 94,'athletic': 77,
    'las palmas': 275,'eibar': 278,'alaves': 263,'real sociedad': 92,'leganes': 745,'celta': 558,'malaga': 84,
    'valencia': 95,'deportivo': 560,'betis': 90,'espanyol': 80,'sporting de gijon': 96,'osasuna': 79,'granada': 83}

    teams_name = {'atletico de madrid': 'Atlético de Madrid','real madrid': 'Real Madrid','sevilla': 'Sevilla','barcelona': 'Barcelona','villarreal': 'Villarreal','athletic': 'Athletic de Bilbao',
    'las palmas': 'Las Palmas','eibar': 'Eibar','alaves': 'Alavés','real sociedad': 'Real Sociedad','leganes': 'Leganés','celta': 'Celta de Vigo','malaga': 'Málaga',
    'valencia': 'Valencia','deportivo': 'Deportivo','betis': 'Real Betis','espanyol': 'Espanyol','sporting de gijon': 'Sporting de Gijón','osasuna': 'Osasuna','granada': 'Granada'}
 


    name = "marca"
    allowed_domains = ["marca.com"]
    start_urls = ['http://www.marca.com/futbol/'+ team +'.html' for team in teamsList]
    #start_urls = ['http://www.marca.com/futbol/alaves.html']
    #self.database_connection().delete_many({"source" : "Marca"})


    def parse(self, response):
        team = unidecode(response.css("[class=tab-title]").css("[class=container-header]").css('span::text').extract()[0].lower())
        news_list_str = response.css("[class=container]").css("[class=auto-items]").extract()[0]
        sel = Selector(text = news_list_str, type = 'html')
        items = []
        for news in sel.xpath('//li//article'):
            #team = re.sub('^[\s]|[\n]', '', news.css('[class=ribbon] span::text').extract()[1]).lower()
            title = news.css('[class=mod-header]').css('[class=mod-title] a::text').extract()[0].replace('\n','')
            url = news.css('[class=mod-header]').css('[class=mod-title] a::attr(href)').extract()[0].replace('\n','')
            image = news.css('[class=multimedia-item]').css('img::attr(src)').extract()[0]
            item = {}
            item['team'] = self.teams_dict[team]
            item['team_name'] = self.teams_name[team]
            item['title'] = title
            item['url'] = url
            item['image'] = image
            item['source'] = 'Marca'
            item['league_id'] = 436
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