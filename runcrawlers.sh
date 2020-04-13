#!/bin/sh
#export TESTING='True'
export LOG_FOLDER='./logs/'

cd diarios  || exit

#argentina
scrapy crawl clarin
scrapy crawl lanacion
scrapy crawl pagina12
scrapy crawl perfil
#cr
scrapy crawl nacion
scrapy crawl crhoy
#scrapy crawl delfino
scrapy crawl larepublica
#paraguay
scrapy crawl lanacionpy
scrapy crawl abc
scrapy crawl ultimahora
