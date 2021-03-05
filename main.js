// Base.js
class Base {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.c = this.canvas.getContext("2d");

        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
    }
}

// Random.js
class Random {
    static random(min, max) {
        return Math.random() * (max - min + 1) + min;
    } 
}

// Snowflake.js 
class Snowflake {
    constructor() {
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.speedX = Random.random(-10, 10);
        this.speedY = Random.random(5, 15);
        this.radius = Random.random(0.5, 5);
        this.opacity = Math.random();
    }
}

// Snowflakes.js
class Snowflakes extends Base {
    constructor(c) {
        super(c);
        this.snowflakes = [];

        this.friction = 0.8;
        this.gravity = 0.5;

        this.snowPosition = innerHeight * 0.975;

        this.selectAction();
    }

    createSnowflakes() {
        for (let i = 0; i < innerHeight / 2; i++) {
            this.snowflakes.push(new Snowflake());
        }
    }

    drawSnowflakes() {
        this.snowflakes.forEach(snowflake => {
            const x = snowflake.x;
            const y = snowflake.y;
            const radius = snowflake.radius;
            const opacity = snowflake.opacity;

            const gradient = this.c.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(226, 234, 252, ${opacity})`);
            gradient.addColorStop(1, `rgba(237, 242, 251, ${opacity})`);

            this.c.beginPath();
            this.c.arc(x, y, radius, 0, Math.PI * 2, false);
            this.c.fillStyle = gradient;
            this.c.fill();
        });
    }

    selectAction() {
        const toggle = document.querySelector("#toggle");
        const bodyClass = document.body.className;

        toggle.addEventListener("click", () => {
            if (bodyClass === "") {
                document.body.classList.add("off");
            } else {
                document.body.classList.remove("off");
            }
        });

        this.snowflakes.forEach(snowflake => {
            if (bodyClass === "off") {
                this.offFalling(snowflake);
            } else {
                this.onFalling(snowflake);
            }

            snowflake.x += snowflake.speedX;
            snowflake.y += snowflake.speedY;
        })
    }

    onFalling(snowflake) {
        if (snowflake.y + snowflake.radius + snowflake.speedY > this.snowPosition) {
            snowflake.y = this.snowPosition - snowflake.radius;

            snowflake.speedX = 0;
            snowflake.speedY = 0;

            this.snowflakes.push(new Snowflake());
            this.snowflakes.shift();
        }
    }

    offFalling(snowflake) {
        if (snowflake.y + snowflake.radius + snowflake.speedY > this.snowPosition) {
            snowflake.speedY *= -1;
            snowflake.speedY *= this.friction;
            snowflake.speedX *= this.friction;
        } else {
            snowflake.speedY += this.gravity;
        }

        if (snowflake.x + snowflake.radius >= innerWidth || snowflake.x - snowflake.radius <= 0) {
            snowflake.speedX = -snowflake.speedX * this.friction;
        }
    }

    fallSnowflakes() {
        requestAnimationFrame(this.fallSnowflakes.bind(this));
        this.c.clearRect(0, 0, innerWidth, innerHeight);
        this.drawSnowflakes();
        this.selectAction();
    }
}

// Snowdrift.js
class Snowdrift {
    constructor(snowflakes) {
        this.x = undefined;
        this.y = undefined;

        this.snowflakes = snowflakes;

        window.addEventListener("mousemove", (e) => {
            this.x = e.x;
            this.y = e.y;
            this.enlargeSnowflakes();
        })
    }

    enlargeSnowflakes() {
        const maxRadius = innerWidth / 200;
        const distance = 150;

        this.snowflakes.forEach(snowflake => {

            if (this.x - snowflake.x < distance && this.x - snowflake.x > -distance && this.y - snowflake.y < distance && this.y - snowflake.y > -distance) {
                if (snowflake.radius < maxRadius) {
                    snowflake.radius += 0.5;
                }
            } 
        })
    }
}

// Snow.js 
class Snow {
    constructor() {
        this.snowflakes = new Snowflakes();
        this.snowflakes.createSnowflakes();
        this.snowflakes.fallSnowflakes();
        this.snowflakes.selectAction();

        this.snowdrift = new Snowdrift(this.snowflakes.snowflakes);
    }
}

// Flash.js
class Flash {
    constructor() {
        this.wires = document.querySelectorAll(".wire");
        this.starLights = document.querySelectorAll(".christmas-star div");
    }
    
    onChristmasLights() {
        const blueLights = [];
        const redLights = [];
        const yellowLights = [];
        const purpleLights = [];

        for (let i = 0; i < this.wires.length; i++) {
            const lights = this.wires[i].querySelectorAll("li");

            for (let j = 0; j < lights.length; j++) {
                if (j % 4 === 0) {
                    blueLights.push(lights[j]);
                    redLights.push(lights[j + 1]);
                    yellowLights.push(lights[j + 2]);
                    purpleLights.push(lights[j + 3]);
                }
            }
        }

        this.addBlueLights(blueLights);
        this.addRedLights(redLights);
        this.addYellowLights(yellowLights);
        this.addPurpleLights(purpleLights);
    }

    offChristmasLights() {
        const christmasLights = document.querySelectorAll("li");
        christmasLights.forEach(christmasLight => christmasLight.style.animationName = "");
    }

    correctArray(arr) {
        arr = arr.filter( elem => elem !== undefined);
        return arr;
    }

    addBlueLights(blueLights) {
        for (let i = 0; i < blueLights.length; i++) {
            if ((i > 2 && i < 5) || (i > 6 && i < 8) || 
            (i > 11 && i < 14) || (i > 15 && i < 17)) {
                blueLights[i].style.animationName = "first-flash-odd";
            } else {
                blueLights[i].style.animationName = "first-flash-even";
            }
        }
    }

    addRedLights(redLights) {
        redLights = this.correctArray(redLights);
        
        for (let i = 0; i < redLights.length; i++) {
            if ((i > 1 && i < 4) || (i > 5 && i < 7) ||
            (i > 9 && i < 12) || (i > 13 && i < 15)) {
                redLights[i].style.animationName = "second-flash-odd";
            } else {
                redLights[i].style.animationName = "second-flash-even";
            }
        }
    }

    addYellowLights(yellowLights) {
        yellowLights = this.correctArray(yellowLights);

        for (let i = 0; i < yellowLights.length; i++) {
            if ((i > 1 && i < 4) || i === 5 || 
            (i > 7 && i < 10) || i === 11) {
                yellowLights[i].style.animationName = "third-flash-odd";
            } else {
                yellowLights[i].style.animationName = "third-flash-even";
            }
        }
    }

    addPurpleLights(purpleLights) {
        purpleLights = this.correctArray(purpleLights);

        for (let i = 0; i < purpleLights.length; i++) {
            if ((i > 1 && i < 3) || i === 4 ||
            (i > 6 && i < 8) || i === 9) {
                purpleLights[i].style.animationName = "fourth-flash-odd";
            } else {
                purpleLights[i].style.animationName = "fourth-flash-even";
            }
        }
    }

    onChristmasStar() {
        this.starLights.forEach(light => light.classList.add("star-flash"));
    }

    offChristmasStar() {
        this.starLights.forEach(light => light.classList.remove("star-flash"));
    }
}

// AudioPlayer.js
class AudioPlayer extends Flash {
    constructor(audio = []) {
        super();
        this.playerElem = document.querySelector(".audio-player");
        this.audio = audio;
        this.currentAudio = null;
        this.createPlayerElements();
        this.audioContext = null;
    }

    createVisualizer() {
        this.audioContext = new AudioContext();
        this.src = this.audioContext.createMediaElementSource(this.audioElem);

        const analyser = this.audioContext.createAnalyser();
        this.src.connect(analyser);
        analyser.connect(this.audioContext.destination);
        analyser.fftSize = 64;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderSpeed = () => {
            requestAnimationFrame(renderSpeed);
            analyser.getByteFrequencyData(dataArray);
        }

        renderSpeed();

        const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

        setInterval(() => {
            const speed = (2 - ((arrAvg(dataArray) / 100).toFixed(1)));

            const lights = document.querySelectorAll("li");
            lights.forEach(light => light.style.animationDuration = speed + "s");
        }, 1000)
    }

    createPlayerElements() {
        this.audioElem = document.createElement("audio");
        const playListElem = document.createElement("div");
        playListElem.classList.add("playlist");

        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);

        this.createPlaylistElements(playListElem);
    }

    createPlaylistElements(playListElem) {
        this.audio.forEach(audio => {
            const audioItem = document.createElement("a");
            audioItem.href = audio.url;
            audioItem.classList.add("christmas-ball");
            audioItem.classList.add(audio.order);
            audioItem.innerHTML = `<i class="fa fa-play"></i>`;
            this.setUpEventListener(audioItem);
            playListElem.appendChild(audioItem);
        })
    }

    setUpEventListener(audioItem) {
        audioItem.addEventListener("click", (e) => {
            e.preventDefault();

            if (!this.audioContext) {
                this.createVisualizer();
            }

            const isCurrentAudio = audioItem.getAttribute("href") === (this.currentAudio && this.currentAudio.getAttribute("href"));

            if (isCurrentAudio && !this.audioElem.paused) {
                this.setPlayIcon(this.currentAudio);
                this.audioElem.pause();

                this.offChristmasLights();
                this.offChristmasStar();

            } else if (isCurrentAudio && this.audioElem.paused) {
                this.setPauseIcon(this.currentAudio);
                this.audioElem.play();

                this.onChristmasLights();
                this.onChristmasStar();

            } else {
                if (this.currentAudio) {
                    this.setPlayIcon(this.currentAudio);
                }

                this.currentAudio = audioItem;
                this.setPauseIcon(this.currentAudio);
                this.audioElem.src = this.currentAudio.getAttribute("href");
                this.audioElem.play();

                this.onChristmasLights();
                this.onChristmasStar();
            }

            this.audioElem.addEventListener("ended", () => {
                this.setPlayIcon(this.currentAudio);
                
                this.offChristmasLights();
                this.offChristmasStar();
            })
        })
    }

    setPlayIcon(elem) {
        const icon = elem.querySelector("i");
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
    }

    setPauseIcon(elem) {
        const icon = elem.querySelector("i");
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
    }
}

// ChristmasApp.js
class ChristmasApp {
    constructor() {
        this.base = new Base();
        this.snow = new Snow();
        // Music: https://www.bensound.com
        this.audioPlayer = new AudioPlayer([
            { url: "songs/Acoustic Breeze.mp3", order: "one"},
            { url: "songs/Creative Minds.mp3", order: "two"},
            { url: "songs/Energy.mp3", order: "three"},
            { url: "songs/Evolution.mp3", order: "four"},
            { url: "songs/Happy Rock.mp3", order: "five"},
            { url: "songs/Jezzy Frenchy.mp3", order: "six"},
            { url: "songs/Memories.mp3", order: "seven"},
            { url: "songs/Moose.mp3", order: "eight"},
            { url: "songs/Ukulele.mp3", order: "nine"}
        ]);

        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.base.canvas.width = innerWidth;
        this.base.canvas.height = innerHeight;
        this.snow.snowflakes.snowPosition = innerHeight * 0.975;
    }
}

const christmasApp = new ChristmasApp();

