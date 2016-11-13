# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import HtmlXPathSelector
from tutorial.items import TutorialItem
from scrapy import Selector
import re
from pymongo import MongoClient
import os
from unidecode import unidecode


class MirrorSpider(Spider):
	teamsList = ['arsenal-fc', 'afc-bournemouth', 'burnley-fc', 'chelsea-fc', 'crystal-palace-fc', 'everton-fc', 'hull-city-fc'
	'leicester-city-fc', 'liverpool-fc', 'manchester-city-fc', 'manchester-united-fc', 'middlesbrough-fc', 'southampton-fc'
	'stoke-city-fc', 'sunderland-afc', 'swansea-city-fc', 'tottenham-hotspur-fc', 'watford-fc', 'west-bromwich-albion-fc'
	'west-ham-united-fc']
	
	teams_dict = {'manchester city fc': 65,'arsenal fc': 57,'totthenham hotspur fc': 73,'liverpool fc': 64,'chelsea fc': 61,'everton fc': 62,
	'manchester united fc': 66,'southampton fc': 340,'crystal palace fc': 354,'watford fc': 46,'afc bournemouth': 1044,'west bromwich albion fc': 74,
	'leicester city fc': 338,'burnley fc': 328,'west ham united fc': 563,'hull city fc': 322,'middlesbrough fc': 343,'stoke city fc': 70,'swansea city fc': 72,'sunderland afc': 71}

	name = "mirror"
	allowed_domains = ["mirror.co.uk"]
	start_urls = ['http://www.mirror.co.uk/all-about/'+ team for team in teamsList]
	#start_urls = ['http://www.mirror.co.uk/all-about/afc-bournemouth']

	def parse(self, response):
		title_str = response.css('[id=page]').css('[class=tmRow\ span-24]').css('[class=curated-hdr]').css('[class=channel-hdr-wrapper]').css('div').css('[class=channel-hdr]').extract()[0]
		sel = Selector(text = title_str, type = 'html')
		team = sel.css('h1::text').extract()[0].lower()
		items = []
		item = {}
		item['image'] = response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-17-5\ last]').css('[class=teaser\ dh-teaser\ left-headline]').css('figure').css('a').css('img::attr(src)').extract()[0]
		item['url'] = response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-17-5\ last]').css('[class=teaser\ dh-teaser\ left-headline]').css('figure').css('a::attr(href)').extract()[0]
		item['title'] = response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-17-5\ last]').css('[class=teaser\ dh-teaser\ left-headline]').css('h3').css('a::text').extract()[0]
		item['team'] = self.teams_dict[team]
		item['team_name'] = team
		item['source'] = 'Mirror'
		item['league_id'] = 426
		items.append(item)

		for article in response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-8-5\ col-1] div').css('div'):
			#print article
			item = {}
			item['title'] = article.css('h2').css('a::text').extract()[0].replace('\n','')
			item['url'] = article.css('h2').css('a::attr(href)').extract()[0]
			item['image'] = article.css('figure').css('a').css('img::attr(src)').extract()[0]
			item['team'] = self.teams_dict[team]
			item['source'] = 'Mirror'
			item['league_id'] = 426
			item['team_name'] = team
			items.append(item)

		for article in response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-8-5\ col-2\ last] div').css('div'):
			#print article
			item = {}
			if article.css('h2').css('a::text'):
				item['title'] = article.css('h2').css('a::text').extract()[0].replace('\n','')
				item['url'] = article.css('h2').css('a::attr(href)').extract()[0]
				item['image'] = article.css('figure').css('a').css('img::attr(src)').extract()[0]
				item['team'] = self.teams_dict[team]
				item['team_name'] = team
				item['source'] = 'Mirror'
				item['league_id'] = 426
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



