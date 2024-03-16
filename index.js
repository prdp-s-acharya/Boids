const canva = document.getElementById("canva")
const bgImg = document.getElementById("source");
bgImg.width = window.innerWidth;
bgImg.height = window.innerHeight;
canva.height = window.innerHeight;
canva.width = window.innerWidth ;
const ctx = canva.getContext("2d");

const boxW = 5;
const boxH = 5;

const s = 0.005; const sDx = s, sDy = s;
const a = 0.9; const aDx = a, aDy = a;
const c = 5; const cDx = c, cDy = c;
const p = 2; const pDx = p, pDy = p;

const closeR = 100;

const boids = [];
const boidCount = 200

let mx = 0, my = 0;

const init = ()=>{
    for (let index = 0; index < boidCount; index++) {
        const posX = getRandom(-canva.width/2, canva.width/2)
        const posY = getRandom(-canva.height/2, canva.height/2)

        const vX = getRandom(-1, 1);
        const vY = getRandom(-1, 1);

        boids.push({
            id : index,
            pos : [posX, posY],
            dir : [vX, vY],
            near : []
        });
    }
    window.requestAnimationFrame(loop)
}

const loop = ()=>{

    ctx.clearRect(0,0,canva.width, canva.height);
    ctx.drawImage(bgImg, 0, 0);

    document.addEventListener('click', handler);
   
    for (let i = 0; i < boids.length; i++) {
        boids.near = []
        for(let j = 0; j < boids.length; j++){
            if(j == i) continue;
            if(dist(boids[i], boids[j]) < closeR){
                boids[i].near.push(boids[j])
            }
        }
    }
    for (let i = 0; i < boids.length; i++) {
        pointToCenter(boids[i], mx, my);
        separation(boids[i]);
        alignment(boids[i]); 
        cohesion(boids[i]); 
               
        ctx.fillRect(boids[i].pos[0] + canva.width/2, boids[i].pos[1] + canva.height/2, boxW, boxH)
    }
    window.requestAnimationFrame(loop)
} 

const dist = (b1, b2) =>{
    const a = Math.floor( b1.pos[0] - b2.pos[0]);
    const b = Math.floor( b1.pos[1] - b2.pos[1]);
    return Math.sqrt(a*a + b*b);
}

const normalize = (v) => {
    vl = Math.sqrt(Math.floor(v[0] * v[0]) + Math.floor(v[1] * v[1]));
    if(vl === 0) return v;
    v[0] /= vl;
    v[1] /= vl;
    return v;  
}

const separation = (b) =>{
    let xavg = 0;
    let yavg = 0;
    let aPow = 1;
    if(b.near.length > 0){
        for(var i = 0; i < b.near.length; i++){
            xavg += b.near[i].pos[0];
            yavg += b.near[i].pos[1];
        }
        xavg /= b.near.length;
        yavg /= b.near.length;

        xavg -= b.pos[0];
        yavg -= b.pos[1];

        aPow = b.near.length/boidCount;
    }

    b.dir[0] = Math.cos(Math.PI)*xavg - Math.sin(Math.PI)*yavg;
    b.dir[1] = Math.sin(Math.PI)*xavg + Math.cos(Math.PI)*yavg;
    b.dir = normalize(b.dir);

    b.pos[0] += b.dir[0] * sDx * aPow; 
    b.pos[1] += b.dir[1] * sDy * aPow;
}

const alignment = (b)=>{
    let xavg = 0;
    let yavg = 0;

    let aPow = 1;
    if(b.near.length > 0){
        for(var i = 0; i < b.near.length; i++){
            xavg += b.near[i].dir[0];
            yavg += b.near[i].dir[1];
        }
        xavg /= b.near.length;
        yavg /= b.near.length;

        aPow = b.near.length/boidCount;
    }

    b.dir[0] = xavg;
    b.dir[1] = yavg;
    b.dir = normalize(b.dir);

    b.pos[0] += b.dir[0] * aDx * aPow; 
    b.pos[1] += b.dir[1] * aDy * aPow;
}

const cohesion = (b)=>{
    let xavg = 0;
    let yavg = 0;
    let aPow = 1;
    if(b.near.length > 0){
        for(var i = 0; i < b.near.length; i++){
            xavg += b.near[i].pos[0];
            yavg += b.near[i].pos[1];
        }
        xavg /= b.near.length;
        yavg /= b.near.length;

        xavg -= b.pos[0];
        yavg -= b.pos[1];

        aPow = b.near.length/boidCount;
    }

    b.dir[0] = xavg;
    b.dir[1] = yavg;
    b.dir = normalize(b.dir);

    b.pos[0] += b.dir[0] * cDx / aPow; 
    b.pos[1] += b.dir[1] * cDy / aPow;
}

const pointToCenter = (b, x, y)=>{
    let xavg = x;
    let yavg = y;

    xavg -= b.pos[0];
    yavg -= b.pos[1];

    b.dir[0] = xavg;
    b.dir[1] = yavg;
    b.dir = normalize(b.dir);

    b.pos[0] += b.dir[0] * pDx; 
    b.pos[1] += b.dir[1] * pDy;
}
  
const getRandom = (min, max) =>{
    return Math.random() * (max - min) + min;
}    

const handler = (e) => {
    var pagex = e.pageX;
    var pagey = e.pageY;
    
    mx = pagex - canva.width/2;
    my = pagey - canva.height/2; 
    //console.log(pagex, pagey);

}
init();