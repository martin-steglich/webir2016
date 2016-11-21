
while true
do
	echo "######################"
	echo "#EMPIEZA MARCA SPIDER#"
	echo "######################"
	scrapy crawl marca 
	echo "#######################"
	echo "#TERMINA MARCA SPIDER#"
	echo "######################"
	# echo "######################"
	# echo "#EMPIEZA MIRROR SPIDER#"
	# echo "######################"
	# scrapy crawl mirror 
	# echo "#######################"
	# echo "#TERMINA MIRROR SPIDER#"
	# echo "######################"
	echo "##########################"
	echo "#EMPIEZA GAZZETTA SPIDER#"
	echo "#########################"
	scrapy crawl gazzetta 
	echo "##########################"
	echo "#TERMINA GAZZETTA SPIDER#"
	echo "########################"
	sleep 15
done