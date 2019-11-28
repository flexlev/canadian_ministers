import sys
import os
project_dir = "/home/flex_lev/Dev"
sys.path.append( project_dir )

import time
import random
import datetime
from random import shuffle

import pandas as pd
import json
import re
import gender_guesser.detector as gender
import datefinder
from collections import OrderedDict

activity = {"dm" : 280, "dw" : 20, "mm" : 30, "mw" : 5}

parliament_dates = dict()
parliament_dates[17] = {"start" : "09-09-1930", "end" : "14-08-1935", "election_date" : "28-07-1930"}
parliament_dates[18] = {"start" : "06-02-1936", "end" : "25-01-1940", "election_date" : "14-10-1935"}
parliament_dates[19] = {"start" : "16-05-1940", "end" : "16-04-1945", "election_date" : "26-03-1940"}
parliament_dates[20] = {"start" : "06-09-1945", "end" : "30-04-1949", "election_date" : "11-06-1945"}
parliament_dates[21] = {"start" : "15-09-1949", "end" : "13-06-1953", "election_date" : "27-06-1949"}
parliament_dates[22] = {"start" : "12-11-1953", "end" : "12-04-1957", "election_date" : "10-08-1953"}
parliament_dates[23] = {"start" : "14-10-1957", "end" : "01-02-1958", "election_date" : "10-06-1957"}
parliament_dates[24] = {"start" : "12-05-1958", "end" : "19-04-1962", "election_date" : "31-03-1958"}
parliament_dates[25] = {"start" : "27-09-1962", "end" : "06-02-1963", "election_date" : "18-06-1962"}
parliament_dates[26] = {"start" : "16-05-1963", "end" : "08-09-1965", "election_date" : "08-04-1963"}
parliament_dates[27] = {"start" : "18-01-1966", "end" : "23-04-1968", "election_date" : "08-11-1965"}
parliament_dates[28] = {"start" : "12-09-1968", "end" : "01-09-1972", "election_date" : "25-06-1968"}
parliament_dates[29] = {"start" : "04-01-1973", "end" : "09-05-1974", "election_date" : "30-10-1972"}
parliament_dates[30] = {"start" : "30-09-1974", "end" : "26-03-1979", "election_date" : "08-08-1974"}
parliament_dates[31] = {"start" : "09-10-1979", "end" : "14-12-1979", "election_date" : "22-05-1979"}
parliament_dates[32] = {"start" : "14-04-1980", "end" : "09-07-1984", "election_date" : "18-02-1980"}
parliament_dates[33] = {"start" : "05-11-1984", "end" : "01-10-1988", "election_date" : "04-09-1984"}
parliament_dates[34] = {"start" : "12-12-1988", "end" : "08-09-1993", "election_date" : "21-11-1988"}
parliament_dates[35] = {"start" : "17-01-1994", "end" : "27-04-1997", "election_date" : "25-10-1993"}
parliament_dates[36] = {"start" : "22-09-1997", "end" : "22-10-2000", "election_date" : "02-06-1997"}
parliament_dates[37] = {"start" : "29-01-2001", "end" : "23-05-2004", "election_date" : "27-11-2000"}
parliament_dates[38] = {"start" : "04-10-2004", "end" : "29-11-2005", "election_date" : "28-06-2004"}
parliament_dates[39] = {"start" : "03-04-2006", "end" : "07-09-2008", "election_date" : "23-01-2006"}
parliament_dates[40] = {"start" : "18-11-2008", "end" : "26-03-2011", "election_date" : "14-10-2008"}
parliament_dates[41] = {"start" : "02-06-2011", "end" : "02-08-2015", "election_date" : "02-05-2011"}
parliament_dates[42] = {"start" : "03-12-2015", "end" : "11-09-2019", "election_date" : "19-10-2015"}
parliament_dates[43] = {"start" : "21-10-2019", "end" : "20-11-2019", "election_date" : "21-10-2019"}
parliament_dates[44] = {"start" : "", "end" : "", "election_date" : "21-10-2023"}

prime_info = dict()
prime_info[15] = "Richard Bedford Bennett (1930-1935)"
prime_info[16] = "William Lyon Mackenzie King (1935-1948)"
prime_info[17] = "Louis St-Laurent (1948-1957)"
prime_info[18] = "John Diefenbaker (1957-1963)"
prime_info[19] = "Lester B. Pearson (1963-1968)"
prime_info[20] = "Pierre Elliott Trudeau (1968-1979)"
prime_info[21] = "Joe Clark (1979-1980)"
prime_info[22] = "Pierre Elliott Trudeau (1980-1984)"
prime_info[23] = "John Turner (1984-1984)"
prime_info[24] = "Brian Mulroney (1984-1993)"
prime_info[25] = "Kim Campbell (1993-1993)"
prime_info[26] = "Jean Chrétien (1993-2003)"
prime_info[27] = "Paul Martin (2003-2006)"
prime_info[28] = "Stephen Harper (2006-2015)"
prime_info[29] = "Justin Trudeau (2015 - Now)"

def create_parliament():
	d = gender.Detector()

	df_p = pd.DataFrame()
	for file in os.listdir("/home/flex_lev/Dev/Perso/canadian_ministry/dump"):
		if "Parliament" in file:
			df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/dump/" + file, sep="|").rename(columns = {'Unnamed: 0':'index_rows'})
			index_number = re.findall(r'\d+', file)[0]
			df["start"] = parliament_dates[int(index_number)]["start"]
			df["end"] = parliament_dates[int(index_number)]["end"]
			df["parliament_number"] = int(index_number)
			df["sex"] = df["name"].apply(lambda x: d.get_gender(x.split(" ")[0]) )
			if df_p.shape[0] == 0:
				df_p = df
			else:
				df_p = pd.concat([df_p, df], ignore_index=True)
	
	print(df_p.shape)
	df_p[ [col for col in df_p.columns if "sex" not in col]  + ["sex"] ].sort_values(by=["sex"]).to_csv("parliament.csv", sep="|", index=False)

	# df = []
	# for i in range(338):
	# 	print(i)
	# 	schedule = []
	# 	start = 0
	# 	while(start < 1000):
	# 		end = start + random.randrange(0,300)
	# 		if end >= 1000:
	# 			end = 1000
	# 		schedule.append( str(start) + "," + str(end) + "," + random.choice([k for k in activity for dummy in range(activity[k])]) )
	# 		start = end+1
	# 	df.append( "|".join(schedule ) )

	# df = pd.DataFrame(df, columns = ["schedule"])
	# df.to_csv("sample.csv", sep="|", index=False)


def resave_parliament():
	df_p = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/parliament_corrected.csv", sep="|")
	df_p.sort_values(by=["sex", "name"]).to_csv("/home/flex_lev/Dev/Perso/canadian_ministry/parliament_corrected_2.csv", sep="|", index=False)

def find_date(x, selector):
	splitter = "-" if len(x.split("-"))>1 else "–"
	try:
		if "Present" in x.split(splitter)[selector]:
			return "2019-11-20"
		return list(datefinder.find_dates(x.split(splitter)[selector]))[0]
	except:
		return "NULL"

def create_minister():
	d = gender.Detector()

	df_p = pd.DataFrame()
	for file in os.listdir("/home/flex_lev/Dev/Perso/canadian_ministry/dump"):
		if "Parliament" not in file:
			print(file)
			df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/dump/" + file, sep="|").rename(columns = {'Unnamed: 0':'index_rows'})
			index_number = re.findall(r'\d+', file)[0]
			df["start"] = df["date"].apply(lambda x : find_date(x, 0) )
			df["end"] = df["date"].apply(lambda x : find_date(x, 1)  )
			df["minister_number"] = int(index_number)
			df["sex"] = df["name"].apply(lambda x: d.get_gender(x.split(" ")[0]) )
			if df_p.shape[0] == 0:
				df_p = df
			else:
				df_p = pd.concat([df_p, df], ignore_index=True)
	
	print(df_p.shape)
	df_p[ [col for col in df_p.columns if "sex" not in col]  + ["sex"] ].sort_values(by=["sex"]).to_csv("ministers.csv", sep="|", index=False)

def resave_ministers():
	df_p = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/ministers_2.csv", sep="|")
	df_p.sort_values(by=["sex", "name"]).to_csv("/home/flex_lev/Dev/Perso/canadian_ministry/ministers_3.csv", sep="|", index=False)


def get_clean_name(row):
	return row.split("(", 1)[0].strip()

def create_final_dataset():
	df_deputies = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/parliament_corrected_2.csv", sep="|")
	df_deputies["start_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x]["election_date"], '%d-%m-%Y'))
	df_deputies["end_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x+1]["election_date"], '%d-%m-%Y'))
	df_deputies["sex"] = df_deputies["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 
	df_deputies["name_clean"] = df_deputies["name"].apply(lambda x : get_clean_name(x) )

	df_ministers = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/ministers_3.csv", sep="|")
	# df_ministers = df_ministers[~df_ministers["name"].str.contains("Vacant")]
	df_ministers["name_clean"] = df_ministers["name"].apply(lambda x : get_clean_name(x) )
	df_ministers["start_date"] = df_ministers["start"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') +datetime.timedelta(days=1) )
	df_ministers["end_date"] = df_ministers["end"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') ) 
	df_ministers["sex"] = df_ministers["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 

	#creating concatenated dataframe
	frames = []
	for file in sorted(os.listdir("/home/flex_lev/Dev/Perso/canadian_ministry/dump")):
		if "Parliament" not in file:
			df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/dump/" + file, sep="|").rename(columns = {'Unnamed: 0':'index_rows'})
			frames.append(df)

	df_ministers_original = pd.concat(frames)


	# dates = list(set(df_deputies["start_date"].values)) + list(set(df_ministers["start_date"].values))
	# dates = sorted(dates)
	dates = ["1930-01-01", "2020-01-01"]
	start, end = [datetime.datetime.strptime(_, "%Y-%m-%d") for _ in dates]
	dates =  OrderedDict(((start + datetime.timedelta(_)).strftime(r"%b-%Y"), None) for _ in range((end - start).days)).keys()
	dates = [datetime.datetime.strptime(_, "%b-%Y") for _ in dates]

	print(dates)
	print(len(dates))

	dates_ministers = list(set(df_deputies["start_date"].values))

	alive = True	
	nodes_length = 338
	nodes = [{"previous_index" : -1, "status" : "i", "schedule" : ""} for i in range(nodes_length)]

	nodes_length = 40
	nodes_ministers = [{"previous_index" : -1, "status" : "i", "schedule" : ""} for i in range(nodes_length)]

	i = 0
	alive =False

	list_parliament = df_deputies.sort_values(["parliament_number"])["parliament_number"].unique()

	#go for all dates and if date in modify

	for index_d, date in enumerate(dates):
		concerned_ministers = df_ministers_original.merge(df_ministers[(df_ministers["start_date"] <= date) & (df_ministers["end_date"] > date)], on=["position", "name", "date"] ,how="inner").drop_duplicates("name_clean")
		concerned_deputies = df_deputies[(df_deputies["start_date"] <= date) & (df_deputies["end_date"] > date)]
		
		print(date)

		# for index, node in enumerate(nodes):

		# 	node_previous_index = node["previous_index"]
		# 	node_previous_status = node["status"]

		# 	last_update = False
		# 	try:
		# 		next_status = "m" if (concerned_deputies[concerned_deputies["index_rows"] == index]["sex"].iloc[0] == "male") else "w"
		# 		next_name = concerned_deputies[concerned_deputies["index_rows"] == index]["name_clean"].iloc[0]
		# 	except IndexError:
		# 		# print("cant find index : {}".format(index) )
		# 		next_status = "i"
		# 		next_name = ""

		# 	position = "d"
		# 	# if next_name != "":
		# 	# 	print("Looking for : {} ".format(next_name) )
		# 	# 	for minister_name in concerned_ministers["name"].unique():
		# 	# 		if next_name in minister_name:
		# 	# 			print(minister_name)
		# 	# 			position = "m"

		# 	if node["schedule"] == "":
		# 		node["schedule"] += str(node_previous_index+1) + "," + str(node_previous_index+2) + "," + (next_status if (next_status == "i") else (position + next_status))
		# 	else:
		# 		node["schedule"] += "|" + str(node_previous_index+1) + "," + str(node_previous_index+2) + "," + (next_status if (next_status == "i") else (position + next_status))

		# 	node["previous_index"] = node_previous_index+2
		# 	node["status"] = (next_status if (next_status == "i") else (position + next_status))

		for index, node in enumerate(nodes_ministers):

			node_previous_index = node["previous_index"]
			node_previous_status = node["status"]

			last_update = False
			try:
				next_status = "m" if (concerned_ministers.iloc[index]["sex"] == "male") else "w"
				next_name = concerned_ministers.iloc[index]["name_clean"]
			except IndexError:
				# print("cant find index : {}".format(index) )
				next_status = "i"
				next_name = ""

			position = "m"
			# if next_name != "":
			# 	print("Looking for : {} ".format(next_name) )
			# 	for minister_name in concerned_ministers["name"].unique():
			# 		if next_name in minister_name:
			# 			print(minister_name)
			# 			position = "m"

			if node["schedule"] == "":
				node["schedule"] += str(node_previous_index+1) + "," + str(node_previous_index+2) + "," + (next_status if (next_status == "i") else (position + next_status))
			else:
				node["schedule"] += "|" + str(node_previous_index+1) + "," + str(node_previous_index+2) + "," + (next_status if (next_status == "i") else (position + next_status))

			node["previous_index"] = node_previous_index+2
			node["status"] =  (next_status if (next_status == "i") else (position + next_status))


	# df = pd.DataFrame(nodes)
	# df[["schedule"]].to_csv("temp.csv", index=False)

	df = pd.DataFrame(nodes_ministers)
	df[["schedule"]].to_csv("temp_ministers.csv", index=False)

def create_schedule_dataset():
	df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/visualization/dataview/data/data.csv",sep=",")
	df["sum"] = df["deputies_w"] + df["deputies_m"]
	print(df["deputies_m"].max())
	nodes = [] #length of df["sum"].max()
	for i in range(df["sum"].max()):
		pass

def print_number_ministers():
	df_deputies = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/parliament_corrected_2.csv", sep="|")
	df_deputies["start_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x]["election_date"], '%d-%m-%Y'))
	df_deputies["end_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x+1]["election_date"], '%d-%m-%Y'))
	df_deputies["sex"] = df_deputies["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 
	df_deputies["name_clean"] = df_deputies["name"].apply(lambda x : get_clean_name(x) )

	df_ministers = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/ministers_3.csv", sep="|")
	# df_ministers = df_ministers[~df_ministers["name"].str.contains("Vacant")]
	df_ministers["name_clean"] = df_ministers["name"].apply(lambda x : get_clean_name(x) )
	df_ministers["start_date"] = df_ministers["start"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') +datetime.timedelta(days=1) )
	df_ministers["end_date"] = df_ministers["end"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') ) 
	df_ministers["sex"] = df_ministers["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 


	dates = list(set(df_deputies["start_date"].values)) + list(set(df_ministers["start_date"].values))
	dates = sorted(dates)
	frames = []

	for file in sorted(os.listdir("/home/flex_lev/Dev/Perso/canadian_ministry/dump")):
		if "Parliament" not in file:
			df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/dump/" + file, sep="|").rename(columns = {'Unnamed: 0':'index_rows'})
			frames.append(df)

			print(df.shape[0])
			df = df.merge( df_ministers , on=["position", "name", "date"] ,how="inner")
			for date in dates:
				df_temp = df[(df["start_date"] <= date) & (df["end_date"] > date)].drop_duplicates("name_clean")
				if df_temp.shape[0] != 0:
					print(df_temp.sex.value_counts())
	df_concat = pd.concat(frames)
	print(df_concat.shape)
	print(df_concat.sample(5))

def create_dates():
	df_deputies = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/parliament_corrected_2.csv", sep="|")
	df_deputies["start_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x]["election_date"], '%d-%m-%Y'))
	df_deputies["end_date"] = df_deputies["parliament_number"].apply(lambda x: datetime.datetime.strptime( parliament_dates[x+1]["election_date"], '%d-%m-%Y'))
	df_deputies["sex"] = df_deputies["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 
	df_deputies["name_clean"] = df_deputies["name"].apply(lambda x : get_clean_name(x) )

	df_ministers = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/ministers_3.csv", sep="|")
	# df_ministers = df_ministers[~df_ministers["name"].str.contains("Vacant")]
	df_ministers["name_clean"] = df_ministers["name"].apply(lambda x : get_clean_name(x) )
	df_ministers["start_date"] = df_ministers["start"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') +datetime.timedelta(days=1) )
	df_ministers["end_date"] = df_ministers["end"].apply(lambda row: datetime.datetime.strptime(row, '%Y-%m-%d') ) 
	df_ministers["sex"] = df_ministers["sex"].apply(lambda row: "female" if (row in ["mostly_female", "female"]) else "male") 

	#creating concatenated dataframe
	frames = []
	for file in sorted(os.listdir("/home/flex_lev/Dev/Perso/canadian_ministry/dump")):
		if "Parliament" not in file:
			df = pd.read_csv("/home/flex_lev/Dev/Perso/canadian_ministry/dump/" + file, sep="|").rename(columns = {'Unnamed: 0':'index_rows'})
			frames.append(df)

	df_ministers_original = pd.concat(frames)


	dates = ["1930-01-01", "2020-01-01"]
	start, end = [datetime.datetime.strptime(_, "%Y-%m-%d") for _ in dates]
	dates =  OrderedDict(((start + datetime.timedelta(_)).strftime(r"%b-%Y"), None) for _ in range((end - start).days)).keys()
	dates = [datetime.datetime.strptime(_, "%b-%Y") for _ in dates]

	df_ministers = df_ministers.sort_values("start_date")
	minister_numb = []
	for date in dates[:-1]:
		try:
			val = df_ministers[df_ministers["start_date"] >= date]["minister_number"].iloc[0]
			minister_numb.append(val)
			previous_val = val
		except:
			minister_numb.append(previous_val)
		
	minister_numb.append(val)

	f = open("dates.csv", "w")
	for index, date in enumerate(dates):
		f.write("{ 'date' : '" + pd.to_datetime(str(date)).strftime('%d, %b %Y') + "', 'file' : 'image" + str(minister_numb[index]) + ".jpg', 'info': '" + prime_info[minister_numb[index]] + "'}," + "\n")
	f.close()

	# df = pd.DataFrame({"date" : [pd.to_datetime(str(date)).strftime('%d, %b %Y') for date in dates]}).to_csv("dates.csv", index=False)

if __name__ == "__main__":
	print_number_ministers()
	#create_dates()