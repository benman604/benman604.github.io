const overpassAPI = "https://overpass-api.de/api/interpreter?data=" 
const reverseGeocodeAPI = "https://nominatim.openstreetmap.org/reverse"
const ipGeoAPI = "//ip-api.com/json"
// const zipCodeAPI = "//api.geonames.org/postalCodeLookupJSON?username=benny12&country=US&postalcode="
const geocodeAPI = "https://nominatim.openstreetmap.org/search?format=json&q="

const default_places = [
  {
    coord: '37.792855,-122.3968986',
    file: 'map/sfbay_geodata.json'
  },
  {
    coord: '40.7127281,-74.0060152',
    file: 'map/nymetro_geodata.json'
  },
  {
    coord: '34.070877749999994,-118.44685070595054',
    file: 'map/la_geodata.json'
  }
]

let startSelection = {state: "Select", nodeId: null};
let endSelection = {state: "Select", nodeId: null};
let path = []; // list of node IDs
let roadMap = new Map(); // adjacency list of node IDs

let highwaysData;
let geoData;
let nodesMap = new Map(); // maps node IDs to lat lon x y
let windowWidthMiles = 30;
let minLat, maxLat, minLon, maxLon;
let mapGraphics;
let mapPathOverlay;

let currentSearchID = -1
let readyToStartNextSearch = true
let found = false
let backtrace = new Map()
let visited = new Set()

let waitOneMsEvery = 10;
const _waitOneMsEvery = 10;

function miToDegLat(mi) {
  return mi / 69.172;
}

function miToDegLon(mi, lat) {
  return mi / (69.172 * Math.cos(radians(lat)));
}

function xyToLatLon(x, y) {
  let lat = map(y, 0, height, maxLat, minLat);
  let lon = map(x, 0, width, minLon, maxLon);
  return {lat, lon};
}

function latLonToXY(lat, lon) {
  let x = map(lon, minLon, maxLon, 0, width);
  let y = map(lat, maxLat, minLat, 0, height);
  return {x, y};
}

async function fetchCurrentGeo() {
  let response = await fetch(ipGeoAPI);
  let data = await response.json();
  console.log("Fetched IP geolocation:", data);
  return data.lat + "," + data.lon;
}

async function fetchGeoFromSearch(search) {
  let response = await fetch(geocodeAPI + search);
  let data = await response.json();
  console.log("Fetched search geolocation:", data);
  if (!data || data.length === 0) {
    screenLoadingState("Invalid search");
    return;
  }
  console.log(data);
  return data[0].lat + "," + data[0].lon;
}

// async function fetchGeoFromZip(zip) {
//   let response = await fetch(zipCodeAPI + zip);
//   let data = await response.json();
//   console.log("Fetched zip code geolocation:", data);
//   if (!data.postalcodes || data.postalcodes.length === 0) {
//     screenLoadingState("Invalid zip code");
//     return;
//   }
//   return data.postalcodes[0].lat + "," + data.postalcodes[0].lng;
// }

async function fetchGeoData(coord, useDefault = false) {
  mapGraphics.clear();
  mapPathOverlay.clear();
  path = [];
  nodesMap.clear();

  screenLoadingState("Loading...");
  setButtonsEnabled(false);

  let place;
  if (useDefault) {
    place = default_places[Math.floor(Math.random() * default_places.length)];
    coord = place.coord;
  }

  let w = windowWidthMiles; // viewport width in miles
  let h = windowHeight * windowWidthMiles / windowWidth; 

  let centerLat = parseFloat(coord.split(",")[0]);
  let centerLon = parseFloat(coord.split(",")[1]);

  // bbox coordinates
  minLat = centerLat - miToDegLat(h) / 2;
  maxLat = centerLat + miToDegLat(h) / 2;
  minLon = centerLon - miToDegLon(w, centerLat) / 2;
  maxLon = centerLon + miToDegLon(w, centerLat) / 2;

  console.log(minLat, maxLat, minLon, maxLon);

  // overpass ql query
  let query = `[out:json];
    (
      way["highway"~"trunk|primary|secondary|motorway|motorway_link"](bbox:${minLat},${minLon},${maxLat},${maxLon});
      node(w);
    );
    out body;`;

  // HTTP request to overpass API
  try {
    let response;
    if (useDefault) {
      response = await fetch(place.file);
    } else {
      response = await fetch(overpassAPI + encodeURIComponent(query));
    }
    let data = await response.json();
    console.log("Fetched geo data:", data);
    highwaysData = data;

    // let hwDataElmsNew = []
    for (let node of highwaysData.elements) {
      if (node.type === "node") {
        let xyPos = latLonToXY(node.lat, node.lon);
        if (xyPos.x > 0 && xyPos.x < width && xyPos.y > 0 && xyPos.y < height) {
          nodesMap.set(node.id, {
            lat: node.lat,
            lon: node.lon,
            x: xyPos.x,
            y: xyPos.y
          });
          // hwDataElmsNew.push(node);
        }
      }
    }
    // highwaysData.elements = hwDataElmsNew;
    drawHighways();
    selectRandomEndpoints();
  } catch(error) {
    console.error("Failed to fetch geo data:", error);
    screenLoadingState("Failed to fetch data");
  }
}

async function fetchReverseGeocode(lat, lon) {
  try {
    let response = await fetch(reverseGeocodeAPI + `?lat=${lat}&lon=${lon}&format=json`);
    let data = await response.json();
    return data;
  } catch(error) {
    console.error("Failed to fetch reverse geocode:", error);
    return;
  }
}

function screenLoadingState(message) {
  mapGraphics.background(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  mapGraphics.stroke(outlineColor);
  mapGraphics.fill(outlineColor);
  mapGraphics.strokeWeight(1);
  mapGraphics.textSize(16);
  mapGraphics.text((message) ? message : "Loading...", width/2, height/2); 
}

async function setup() {
  // document.querySelectorAll('.buttons-map').forEach(element => {
  //   element.style.visibility = 'visible';
  // });
  // document.getElementById('buttons-maze').style.display = 'none';

  let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('sketch');

  mapGraphics = createGraphics(width, height);
  mapPathOverlay = createGraphics(width, height);
  screenLoadingState();

  // let coord = await fetchCurrentGeo();
  let coord = "37.7749,-122.4194"; // San Francisco
  coord = "40.7127281,-74.0060152"; // New York
  await fetchGeoData(coord, useDefault = true);
  drawHighways();
}

// let drewHighways = false;
function draw() {
  // if (highwaysData && !drewHighways) {
  //   drawHighways();
  //   drewHighways = true;
  // }
  background(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  if (mapGraphics)  image(mapGraphics, 0, 0);
  if (mapPathOverlay) image(mapPathOverlay, 0, 0);
  noStroke();
  fill(highlightColor.r, highlightColor.g, highlightColor.b);

  if (startSelection.state == "Selected") {
    let node = nodesMap.get(startSelection.nodeId); 
    ellipse(node.x, node.y, 20, 20);
  }
  if (endSelection.state == "Selected") {
    let node = nodesMap.get(endSelection.nodeId);
    triangle(node.x, node.y - 10, node.x - 10, node.y + 10, node.x + 10, node.y + 10);
    // triangle(endSelection.x, endSelection.y - 10, endSelection.x - 10, endSelection.y + 10, endSelection.x + 10, endSelection.y + 10);
  }

  if (path.length > 0) {
    stroke(highlightColor.r, highlightColor.g, highlightColor.b);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let nodeId of path) {
      let node = nodesMap.get(nodeId);
      vertex(node.x, node.y);
    }
    endShape();
  }
}
  
function drawHighways() {
  roadMap = new Map();
  mapGraphics.clear();
  backtrace.clear();
  mapGraphics.stroke(outlineColor);
  mapGraphics.strokeWeight(2);
  mapGraphics.noFill();

  for (let way of highwaysData.elements) {
    if (way.type === "way" && way.nodes.length > 1) {
      mapGraphics.beginShape();
      for (let i=0; i<way.nodes.length-1; i++) {
        let nodeId = way.nodes[i];
        let nextNodeId = way.nodes[i+1];

        let node = nodesMap.get(nodeId);
        if (node) {
          mapGraphics.vertex(node.x, node.y);
        }

        if (!roadMap.get(nodeId) && nodesMap.get(nodeId)) roadMap.set(nodeId, []);
        if (nodesMap.get(nodeId) && nodesMap.get(nextNodeId))  roadMap.get(nodeId).push(nextNodeId)
        if (!roadMap.get(nextNodeId) && nodesMap.get(nextNodeId)) roadMap.set(nextNodeId, []);
        if (nodesMap.get(nodeId) && nodesMap.get(nextNodeId)) roadMap.get(nextNodeId).push(nodeId)
      }

      let lastNode = way.nodes[way.nodes.length - 1];
      let lastNodeData = nodesMap.get(lastNode);
      if (lastNodeData) {
        mapGraphics.vertex(lastNodeData.x, lastNodeData.y);
      }
      mapGraphics.endShape();
    }
  }

  setButtonsEnabled(true);
}

function getGeodataName(data) {
  if (data && data.address) {
    let houseNumber = data.address.house_number;
    if (houseNumber) houseNumber = houseNumber.split(";")[0];
    if (data.name) return data.name;
    if (data.address.road) return ((houseNumber) ? houseNumber : "") + " " + data.address.road;
    if (data.address.city) return data.address.city;
    if (data.address.state) return data.address.state;
    if (data.address.country) return data.address.country;
  }
  return "Unknown";
}

async function mousePressed() {
  if (!highwaysData) return;
  if (!(startSelection.state === "Selecting" || endSelection.state === "Selecting")) return;

  let coord = xyToLatLon(mouseX, mouseY);
  let data = await fetchReverseGeocode(coord.lat, coord.lon);
  let nearestNode = findNearestNode(coord.lat, coord.lon);
  console.log(coord.lat + "," + coord.lon);
  console.log(nodesMap.get(nearestNode));

  let name = getGeodataName(data);

  if (startSelection.state === "Selecting") {
    startSelection.nodeId = nearestNode;
    startSelection.state = "Selected";
    selStartBtn.innerText = name;
  } else if (endSelection.state === "Selecting") {
    endSelection.nodeId = nearestNode;
    endSelection.state = "Selected";
    selEndBtn.innerText = name;
  }
}

document.getElementById('searchform').addEventListener('submit', async (e) => {
  screenLoadingState();
  startSelection.state = "Select";
  endSelection.state = "Select";
  selStartBtn.innerText = "Select start";
  selEndBtn.innerText = "Select end";

  e.preventDefault();
  document.activeElement.blur();
  let query = e.target.elements['query'].value;
  // let coord = await fetchGeoFromZip(zip);
  let coord = await fetchGeoFromSearch(query);
  if (coord) {
    await fetchGeoData(coord);
  }
});

function findNearestNode(lat, lon) {
  let nearestNode = null;
  let nearestDistance = Infinity;

  for (let [nodeId, node] of nodesMap) {
    // let node = nodesMap[nodeId];
    let distance = dist(lat, lon, node.lat, node.lon);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestNode = nodeId;
    }
  }

  return nearestNode;
}

const leftOfScreen = 368;
async function selectRandomEndpoints() {
  let nodeIds = Array.from(nodesMap.keys());
  if (nodeIds.length < 2) return;
  let startIndex;
  let times = 0;
  do {
    startIndex = Math.floor(Math.random() * nodeIds.length);
    times++;
  } while (nodesMap.get(nodeIds[startIndex]).x < leftOfScreen && times < 100);
  let endIndex;
  times = 0;
  do {
    endIndex = Math.floor(Math.random() * nodeIds.length);
    times++;
  } while (endIndex === startIndex || nodesMap.get(nodeIds[endIndex]).x < leftOfScreen && times < 100);

  startSelection.nodeId = nodeIds[startIndex];
  endSelection.nodeId = nodeIds[endIndex];

  startSelection.state = "Selected";
  endSelection.state = "Selected";

  let startloc = nodesMap.get(startSelection.nodeId);
  let endloc = nodesMap.get(endSelection.nodeId);

  let data = await fetchReverseGeocode(startloc.lat, startloc.lon);
  selStartBtn.innerText = getGeodataName(data);
  data = await fetchReverseGeocode(endloc.lat, endloc.lon);
  selEndBtn.innerText = getGeodataName(data);
}

const selStartBtn = document.getElementById('sel-start');
const selEndBtn = document.getElementById('sel-end');

selStartBtn.addEventListener('click', () => {
  startSelection.state = "Selecting";
  selStartBtn.innerText = "Selecting start";
  prepareForSearch();
});

selEndBtn.addEventListener('click', () => {
  endSelection.state = "Selecting";
  selEndBtn.innerText = "Selecting end";
  prepareForSearch();
});

function onUpdateColorTheme() {
  drawHighways();
  // noStroke();
  // fill(highlightColor.r, highlightColor.g, highlightColor.b);
  // if (startSelection.state === "Selected")
  //   ellipse(startSelection.x, startSelection.y, 20, 20);
  // if (endSelection.state === "Selected")
  //   triangle(endSelection.x, endSelection.y - 10, endSelection.x - 10, endSelection.y + 10, endSelection.x + 10, endSelection.y + 10);
}

function prepareForSearch() {
  path = [];
  pq = new PriorityQueue();
  distTo.clear();
  visited.clear();
  found = false;
  waitOneMsEvery = _waitOneMsEvery

  mapPathOverlay.clear();
  // mapPathOverlay.stroke(60, 255, 255);
  mapPathOverlay.stroke(100, 100, 255);
  mapPathOverlay.strokeWeight(2);
  mapPathOverlay.noFill();
}

function setButtonsEnabled(val) {
	document.getElementById('mastar').disabled = !val
	document.getElementById('mbfs').disabled = !val
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function startSearch() {
  currentSearchID = floor(millis());
  console.log("starting search", currentSearchID)
}

function endSearch() {
  currentSearchID = -1;
  readyToStartNextSearch = true;
}
