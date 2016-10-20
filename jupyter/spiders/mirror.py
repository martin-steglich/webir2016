# -*- coding: utf-8 -*-

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from tutorial.items import TutorialItem
from scrapy import Selector
import re
from pymongo import MongoClient
import os
from unidecode import unidecode


class MirrorSpider(BaseSpider):
	teamsList = ['arsenal-fc', 'afc-bournemouth', 'burnley-fc', 'chelsea-fc', 'crystal-palace-fc', 'everton-fc', 'hull-city-fc'
	'leicester-city-fc', 'liverpool-fc', 'manchester-city-fc', 'manchester-united-fc', 'middlesbrough-fc', 'southampton-fc'
	'stoke-city-fc', 'sunderland-afc', 'swansea-city-fc', 'tottenham-hotspur-fc', 'watford-fc', 'west-bromwich-albion-fc'
	'west-ham-united-fc']

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
		item['team'] = team
		item['source'] = 'Mirror'
		items.append(item)

		for article in response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-8-5\ col-1] div').css('div'):
			#print article
			item = {}
			item['title'] = article.css('h2').css('a::text').extract()[0].replace('\n','')
			item['url'] = article.css('h2').css('a::attr(href)').extract()[0]
			item['image'] = article.css('figure').css('a').css('img::attr(src)').extract()[0]
			item['team'] = team
			item['source'] = 'Mirror'
			items.append(item)

		for article in response.css('[class=tmRow\ span-24\ row]').css('[class=tmCol\ span-18\ col-1]').css('[class=tmCol\ span-8-5\ col-2\ last] div').css('div'):
			#print article
			item = {}
			if article.css('h2').css('a::text'):
				item['title'] = article.css('h2').css('a::text').extract()[0].replace('\n','')
				item['url'] = article.css('h2').css('a::attr(href)').extract()[0]
				item['image'] = article.css('figure').css('a').css('img::attr(src)').extract()[0]
				item['team'] = team
				item['source'] = 'Mirror'
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



