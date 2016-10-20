import os
from pymongo import MongoClient

dbdb = os.getenv('MONGO_DATABASE',None)
dbhost = os.getenv('MONGO_HOST',None)
dbport = os.getenv('MONGO_PORT',None)
dbuser = os.getenv('MONGO_USER',None)
dbpass = os.getenv('MONGO_PASS',None)
dbcoll = os.getenv('MONGO_COLL',None)


otherClient = MongoClient('mongodb://'+dbuser+':'+dbpass+'@'+dbhost+':'+dbport+'/'+dbdb)
db = otherClient[dbdb]
news_data = db['news-data']

print "BORRO LOS DATOS DE MIRROR"
news_data.delete_many({"source" : "Mirror"})