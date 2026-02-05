#!/usr/bin/env python3
import math
import os
import sys

import requests
output_dir = "map"
filename = "ucla_geodata.json"
output_path = os.path.join(output_dir, filename)


query = f"""[out:json][timeout:300];
(
  // Major roads
  way["highway"="motorway"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="trunk"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="primary"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="secondary"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="tertiary"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  
  way["highway"="unclassified"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="residential"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="service"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="living_street"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);

  // Walkways / paths
  way["highway"="footway"]["footway"!="sidewalk"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="path"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="steps"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="pedestrian"]["footway"!="sidewalk"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
  way["highway"="cycleway"](34.06005455089264,-118.46797943115236,34.080246667433315,-118.42489242553712);
);
out body;
>;
out skel qt;
"""

# Fetch from Overpass and write to map/ directory
overpass_api = "https://overpass-api.de/api/interpreter"
params = {"data": query}
print("Requesting Overpass data...")
resp = requests.get(overpass_api, params=params, timeout=60)
resp.raise_for_status()

os.makedirs(output_dir, exist_ok=True)
with open(output_path, "wb") as f:
    f.write(resp.content)

print(f"Saved geojson to: {output_path}")
# Print exactly the default_places-style entry
print("Suggested default_places entry:")
print("{" + f"file: '{output_dir}/{filename}'" + "}")
