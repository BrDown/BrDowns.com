  
import json
  
# Opening JSON file
f = open('nodes.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
  
# Iterating through the json
# list
for i in data['13232691']:
    print(i)
  
# Closing file
f.close()