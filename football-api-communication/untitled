# -*- coding: utf-8 -*-
import scrapy
import re

from tutorial.items import RumorItem

class MarcaSpider(scrapy.Spider):
    name = "marca"
    allowed_domains = ["www.marca.com"]
    start_urls = [        
        "http://www.marca.com/futbol/primera-division.html"
    ]

    def parse(self, response):
        for title in response.css('div.container'):
            yield title #{'title': title.css('a ::text').extract_first()}

        #next_page = response.css('div.prev-post > a ::attr(href)').extract_first()
        #if next_page:
        #    yield scrapy.Request(response.urljoin(next_page), callback=self.parse)