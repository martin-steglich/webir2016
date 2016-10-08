from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from tutorial.items import TutorialItem
from scrapy import Selector
import re
from pymongo import MongoClient
import os






class MundoDeportivoSpider(BaseSpider):
    teamsList = ['alaves', 'athletic-bilbao', 'atletico-madrid', 'betis', 'celta-vigo', 'deportivo-coruna', 'eibar', 
        'fc-barcelona', 'granada','leganes', 'malaga', 'osasuna', 'real-madrid', 'rcd-espanyol', 'real-sociedad', 
        'sevilla', 'sporting-gijon', 'ud-las-palmas', 'valencia', 'villarreal']

    name = "mundodeportivo"
    allowed_domains = ["mundodeportivo.com"]
    start_urls = [
    "http://www.mundodeportivo.com/futbol/" + team for team in teamsList]

    #allowed_domains = ["www.goal.com"]
    #start_urls = ["http://www.goal.com/en/rumours/last/168"]

    def parse(self, response):
        for news in response.css("[class=container\ no-padding]").css("[class=structure-global]").css("[class=col-md-12\ col-xs-12]").css("[class=row]"):  
            print news
        # news_list_str = response.css("[class=container\ no-padding]").css("[class=structure-global]").extract()[0]
        # sel = Selector(text = news_list_str, type = 'html')
        # items = []
        # for news in sel.xpath('//li//article'):
        #     team = re.sub('^[\s]|[\n]', '', news.css('[class=ribbon] span::text').extract()[1])
        #     if team != 'LALIGA SANTANDER':
        #         title = news.css('[class=mod-header]').css('[class=mod-title] a::text').extract()[0].replace('\n','')
        #         url = news.css('[class=mod-header]').css('[class=mod-title] a::attr(href)').extract()[0].replace('\n','')
        #         image = news.css('[class=multimedia-item]').css('img::attr(src)').extract()[0]
        #         item = {}
        #         item['team'] = team
        #         item['title'] = title
        #         item['url'] = url
        #         item['image'] = image
        #         item['source'] = 'Marca'
        #         items.append(item)
        
        # self.database_connection().insert_many(items)
                #yield item

            #<Selector xpath=u"descendant-or-self::*[@class = 'auto-items']" data=u'<ul class="auto-items"><li class="conten'>
        #titles = response.xpath("//span[@class='container']")
        #for titles in titles:
         #   title = titles.select("a/text()").extract()
          #  link = titles.select("a/@href").extract()
           # print title, link

        #for rumor in response.css("[id=rumours]").css("[class=rumour]"):
            #print rumor



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

    def teamsList(self):
        return ['alaves', 'athletic-bilbao', 'atletico-madrid', 'betis', 'celta-vigo', 'deportivo-coruna', 'eibar', 
        'fc-barcelona', 'granada','leganes', 'malaga', 'osasuna', 'real-madrid', 'rcd-espanyol', 'real-sociedad', 
        'sevilla', 'sporting-gijon', 'ud-las-palmas', 'valencia', 'villarreal']