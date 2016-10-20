cd tutorial
echo "######################"
echo "#EMPIEZA MARCA SPIDER#"
echo "######################"
python marca_delete.py
scrapy crawl marca 
echo "#######################"
echo "#TERMINA MARCA SPIDER#"
echo "######################"
echo "######################"
echo "#EMPIEZA MIRROR SPIDER#"
echo "######################"
python mirror_delete.py
scrapy crawl mirror 
echo "#######################"
echo "#TERMINA MIRROR SPIDER#"
echo "######################"
echo "##########################"
echo "#EMPIEZA GAZZETTA SPIDER#"
echo "#########################"
python gazzetta_delete.py
scrapy crawl gazzetta 
echo "##########################"
echo "#TERMINA GAZZETTA SPIDER#"
echo "########################"