import sys
import os
project_dir = "/home/flex_lev/Dev"
sys.path.append( project_dir )

from selenium import webdriver
import chromedriver_binary  # Adds chromedriver binary to path
import time
import selenium.webdriver.support.ui as ui
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

import pandas as pd
import json

def main():
	wiki_page = "https://en.wikipedia.org/wiki/17th_Canadian_Parliament#List_of_members"
	options = Options()
	# options.add_argument("--headless") # Runs Chrome in headless mode.
	# options.add_argument('--no-sandbox') # Bypass OS security model
	# options.add_argument('--disable-gpu')  # applicable to windows os only
	# options.add_argument('start-maximized') # 
	# options.add_argument('disable-infobars')
	# options.add_argument("--disable-extensions")

	driver = webdriver.Chrome(chrome_options=options, executable_path="/home/flex_lev/Downloads/chromedriver")
	driver.delete_all_cookies()
	driver.get(wiki_page)

	WebDriverWait(driver,5).until(
		EC.presence_of_element_located((By.XPATH,"(//table[@class='wikitable'])[1]")))
	tables_locator = "//table[@class='wikitable']"
	tables = driver.find_elements_by_xpath(tables_locator)
	print(len(tables))

	df = []
	for table in tables[1:-1]:
		for row in table.find_elements_by_xpath(".//tr"):
			current_row = [td.text for td in row.find_elements_by_xpath(".//td")][1:]
			if len(current_row) == 3:
				df.append(current_row)
				print(current_row)

	df = pd.DataFrame(df, columns = ["location", "name", "party"])
	df.to_csv("dump/" + wiki_page.split("/")[-1] + ".csv", sep="|")

if __name__ == "__main__":
	main()