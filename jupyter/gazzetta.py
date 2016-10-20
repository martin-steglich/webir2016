# -*- coding: utf-8 -*-

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from scrapy import Selector
import re
from pymongo import MongoClient
import os
from unidecode import unidecode


class GazzettaSpider(BaseSpider):
	teamsList = ['Atalanta', 'Bologna', 'Cagliari', 'Chievo', 'Crotone', 'Empoli', 'Fiorentina', 'Genoa', 'Inter',
	'Juventus', 'Lazio', 'Milan', 'Napoli', 'Palermo', 'Pescara', 'Roma', 'Sampdoria', 'Sassuolo', 'Torino', 'Udinese']
	teams_dict = {'juventus fc': 109,'as roma': 100,'ac milan': 98,'torino fc': 586,'ssc napoli': 113,'ss lazio': 110,
	'ac chievo': 106,'cagliari': 104,'genoa': 107,'us sassuolo': 471,'inter fc': 108,'bologna fc': 103,'atalanta': 102,
	'fiorentina': 99,'sampdoria': 584,'pescara': 585,'udinese': 115,'palermo': 114,'empoli': 445,'crotone': 472} 


	name = "gazzetta"
	allowed_domains = ["gazzetta.it"]
	
	start_urls = ['http://www.gazzetta.it/Calcio/Squadre/'+ team + '/' for team in teamsList]
	#start_urls = ['http://www.gazzetta.it/Calcio/Squadre/Atalanta']

	def parse(self, response):
		items = []
		main_container = response.css('[id=calcio]').css('[class=main-container]')
		team = main_container.css('[class=category-header]').css('[class=category-header]').css('div')[0].css('h1').css('a::text').extract()[0].lower()

		for article in main_container.css('[class=central-articles]').css('[class=MXXX-central-articles-main-column]').css('[class=row]').css('article'):
			item = {}
			item['image'] = article.css('[class=u024-article-image-column]').css('[class=image-container]').css('a').css('[class=embed-container]').css('img::attr(src)').extract()[0]
			item['url'] = 	article.css('[class=u024-article-image-column]').css('[class=image-container]').css('a::attr(href)').extract()[0]
			item['title'] = article.css('[class=titoli]').css('header')[0].css('[class=title]').css('a::text').extract()[0]
			item['team'] = teams_dict[team]
			item['source'] = 'Gazzetta'
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

