# -*- coding: utf-8 -*-
"""
Created on Sun Dec  1 16:05:09 2019

@author: user
"""

import pandas as pd

df = pd.read_csv("D:/Dev/perso/canadian_ministers/visualization/dataview/data/sample_off.csv", sep="\n")

data = []
for index, row in df.iterrows():
    for row in row["schedule"].split("|"):
        data.append( [int(row.split(",")[0]), int(row.split(",")[1]), row.split(",")[2]] )

data = pd.DataFrame(data, columns=["act", "start", "end"])

data.to_csv("D:/Dev/perso/canadian_ministers/visualization/dataview/data/data.csv", index=False)