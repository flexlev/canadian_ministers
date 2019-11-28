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
import random

import pandas as pd
import json

activity = {"dm" : 280, "dw" : 20, "mm" : 30, "mw" : 5}

def main():
	df = []
	for i in range(338):
		print(i)
		schedule = []
		start = 0
		while(start < 1000):
			end = start + random.randrange(0,300)
			if end >= 1000:
				end = 1000
			schedule.append( str(start) + "," + str(end) + "," + random.choice([k for k in activity for dummy in range(activity[k])]) )
			start = end+1
		df.append( "|".join(schedule ) )

	df = pd.DataFrame(df, columns = ["schedule"])
	df.to_csv("sample.csv", sep="|", index=False)

if __name__ == "__main__":
	main()