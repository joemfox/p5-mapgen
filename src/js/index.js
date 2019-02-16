require("babel-polyfill")
const P5 = require("p5")
import d3 from "./d3-bundle.js"
import { Delaunay } from "d3-delaunay"

function centroid(pts) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < pts.length; i++) {
        x += pts[i][0];
        y += pts[i][1];
    }
    return [x/pts.length, y/pts.length];
}

function improvePoints(pts, n, extent) {
    n = n || 1;
    extent = extent || defaultExtent;
    for (var i = 0; i < n; i++) {
        pts = voronoi(pts, extent)
            .polygons(pts)
            .map(centroid);
    }
    return pts;
}

function createMap(w,h) {
    let randWidth = d3.randomUniform(0,w)
    let randHeight = d3.randomUniform(0,h)

    let points = new Array(256).fill([0,0]).map(d => {
        return [
            Math.round(randWidth()),
            Math.round(randHeight())
        ]
    });



    let delaunay = Delaunay.from(points);
    let voronoi = delaunay.voronoi([0,0,w,h])

    let polys = Array.from(voronoi.cellPolygons())
    points = points.map((d,i) => {
        return d3.polygonCentroid(polys[i])
    })

    delaunay = Delaunay.from(points);
    voronoi = delaunay.voronoi([0,0,w,h])

    return {points:points, voronoi:voronoi}
}

let mapgen = async p5 => {
    let app = {}
    app.width = 100
    app.height = 100

    p5.setup = async () => {
        p5.pixelDensity(window.devicePixelRatio)
        app.width = window.innerWidth
        app.height = window.innerHeight

        app = Object.assign({},app, createMap(app.width,app.height))
        p5.createCanvas(app.width, app.height, p5.WEBGL)

        
        // p5.textFont(await p5.loadFont("./build/fonts/CooperHewitt-OTF-public/CooperHewitt-Semibold.otf"))
        // p5.textSize(34)
    }

    p5.draw = () => {
        p5.clear()
        p5.translate(-app.width/2,-app.height/2,0);

        p5.fill('tomato')
        p5.noStroke()
        app.points.forEach(d => {
            p5.circle(...d,3)
        })

        p5.noFill()
        p5.stroke('black')

        for(let x of app.voronoi.cellPolygons()){
            p5.beginShape()
            x.forEach(v => {
                p5.vertex(...v,0)
            })
            p5.endShape(p5.CLOSE)
        }

        // p5.text("THIS IS NOT A MAP",width/2, height/2)
    }

    p5.mouseClicked = () => {
        app = Object.assign({},app,createMap(app.width,app.height))
    }
}

let map = new P5(mapgen,'body')