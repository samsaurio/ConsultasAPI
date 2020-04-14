# -*- coding: utf-8 -*-
import scrapy
from scrapy.loader import ItemLoader

from diarios.items import DiariosItem


class DelfinoSpider(scrapy.Spider):
    name = 'delfino'
    country='costa rica'
    allowed_domains = ['delfino.cr']
    start_urls = ['https://delfino.cr/columnas']

    def parse(self, response):
        """
        @url https://delfino.cr/columnas
        @returns items 1 18
        @returns requests 0 0
        @scrapes author title url
        """
        selectors = response.xpath('//div[@class="col-3 css-1cvc9xn"]')
    
        for selector in selectors:
            yield self.parse_article(selector, response)

    def parse_article(self, selector, response):
        loader = ItemLoader(DiariosItem(), selector=selector)

        loader.add_xpath('title', './/a/p/text()')
        loader.add_xpath('author', './/h6/text()')
        loader.add_xpath('url', './/a/@href')


        return loader.load_item()
