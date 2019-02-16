const P5 = require("p5")

let mapgen = async p5 => {
    let width = 100
    let height = 100

    p5.setup = async () => {
        width = window.innerWidth
        height = window.innerHeight

        p5.createCanvas(width, height)

        p5.textFont(await p5.loadFont("./build/fonts/Staatliches/Staatliches-Regular.ttf"))
        p5.textSize(34)
    }

    p5.draw = () => {
        p5.clear()
        p5.text("THIS IS NOT A MAP",width/2, height/2)
    }
}

let map = new P5(mapgen,'body')