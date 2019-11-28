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
	wiki_page = "https://en.wikipedia.org/wiki/15th_Canadian_Ministry"
	options = Options()
	options.add_argument("--headless") # Runs Chrome in headless mode.
	options.add_argument('--no-sandbox') # Bypass OS security model
	options.add_argument('--disable-gpu')  # applicable to windows os only
	options.add_argument('start-maximized') # 
	options.add_argument('disable-infobars')
	options.add_argument("--disable-extensions")

	driver = webdriver.Chrome(chrome_options=options, executable_path="/home/flex_lev/Downloads/chromedriver")
	driver.delete_all_cookies()
	driver.get(wiki_page)

	table_locator = "//table[@class = 'wikitable']"
	table = driver.find_element_by_xpath(table_locator)

	df = []
	for row in table.find_elements_by_xpath(".//tr")[2:]:
		try:
			if len(row.find_elements_by_xpath(".//td")) <4:
				position = previous_row[0]
				name = row.find_elements_by_xpath(".//td")[0].text
				date = row.find_elements_by_xpath(".//td")[1].text + "-" + row.find_elements_by_xpath(".//td")[2].text
				current_row = [position, name, date]
			else:
				position = row.find_elements_by_xpath(".//td")[0].text
				name = row.find_elements_by_xpath(".//td")[1].text
				date = row.find_elements_by_xpath(".//td")[2].text + "-" + row.find_elements_by_xpath(".//td")[3].text
				current_row = [position, name, date]
			print(current_row)
			df.append(current_row)
			previous_row = current_row
		except:
			print("ERROR")

	df = pd.DataFrame(df, columns = ["position", "name", "date"])
	df.to_csv("dump/" + wiki_page.split("/")[-1] + ".csv", sep="|")

if __name__ == "__main__":
	main()