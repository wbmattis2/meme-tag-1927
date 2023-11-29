//Meme Tag 1927
//A game for two players by Benny Mattis

const state = {
    audio: new Audio("./music.mp3"),
    audioStartTime: null, //used for playback loop
    audioEndTime: null, //used for playback loop
    frame: 0, //used for old film fade effect
    opacityAdded: 0, //used for old film fade effect
    paused: true,
    banner: document.getElementById("mainBanner"),
    story: document.getElementById("mainStory"),
    level: 0, //start at 0
    lastRound: 5, //How many rounds in each level. Initialize "round" equivalent to this
    lastLevel: 3, 
    round: 5, //Set this equivalent to lastRound
    teamInfluence: 0.05, //set this to some number between 0 and 0.5. Higher values will lead to hearts being won sooner once they are tagged with a team.
    scores: { //how many rounds won in the current level
        "P1": 0,
        "P2": 0,
        "CPU": 0
    },
    hearts: { //how many hearts won in the current round
        "P1": 0,
        "P2": 0,
        "CPU": 0
    },
    totals: { //how many levels won in the current game
        "P1": 0,
        "P2": 0,
        "CPU": 0
    },
    agents: [], //list of game objects
    winner: null,
    speed: .0125,
    divHeight: 5,
    divWidth: 5,
    refresher: null, //used for rendering loop
    gameKeyFunctions: {
        "ArrowDown": function() {if (!state.paused) state.agents[1].yAcceleration = 1},
        "ArrowUp": function() {if (!state.paused) state.agents[1].yAcceleration = -1},
        "ArrowLeft": function() {if (!state.paused) state.agents[1].xAcceleration = -1},
        "ArrowRight": function() {if (!state.paused) state.agents[1].xAcceleration = 1},
        "s": function() {if (!state.paused) state.agents[0].yAcceleration = 1},
        "w": function() {if (!state.paused) state.agents[0].yAcceleration = -1},
        "a": function() {if (!state.paused) state.agents[0].xAcceleration = -1},
        "d": function() {if (!state.paused) state.agents[0].xAcceleration = 1},
        " ": function() {state.paused = !state.paused;}
        },
    sceneIndex: 0,
    cutscenes: [
        [[
            `<div>MEME TAG 1927</div>
            <div>A game for two players</div>
            <div>by Benny Mattis</div>
            <div>Press any key to continue.</div>`
        ],[
            `<div>The SINGER walks across the railroad tracks to enter a hastily branded Prohibition-era "Restaurant." 
            An imported copy of Sigmund Freud's latest work falls out of his bag as he enters.</div>
            
            <div>Unimpressed, the RESTAURANTEUR glances up from a translation of Blaise Pascal. 
            "Performers set up over there."</div>`
        ],[
            `<div>The RESTAURANTEUR sighs wearily at the thought of another phony gospel singer: an irreligious artist and intellectual who doubtless cares more about "fine culture" than about cultivating the holy spirits that once enlivened this old building. 
            Nevertheless, with no rational justification his own simple faith, the RESTAURANTEUR considers it better to simply keep his distance from tonight's performance.</div>
            <div>Sensing his host's hostility, the SINGER wonders how the RESTAURANTEUR can fancy himself religious when rumor had it that not ten years ago this building was an establishment of ill repute.
            Regardless, the SINGER surmises that his host is doubtless stuck in old habits of thinking, and resolves to focus on his own performance for the night.</div>`
        ]],
        [[
            `<div>A familiar scent fills the RESTAURANTEUR's nostrils as the establishment's signature dish simmers in the kitchen.</div>
            <div>The establishment's former owner, the RESTAURANTEUR's father, used to cook this dish better than anyone, before he made tracks to avoid manslaughter charges in the wake of an ugly tussle.</div>
            <div>The RESTAURANTEUR works for no father now but the one who resides in heaven.</div> 
            <div>As customers begin pouring in, the RESTAURANTEUR resolves to make an effort in influencing them to throw in with a faith like that of Pascal.</div>
            <div>If they are left to the influence of the SINGER, they might be liable to seek in science and culture what they could only ever find in God.</div>`
        ],[
            `<div>As the SINGER finishes preparing for the show to begin, his thoughts wander to his father, an upstanding citizen who was killed indiscriminately somewhere in this very town.</div>
            <div>Mourning gives way to determination as the SINGER considers the cathartic effect of beauty on people with chaos in their souls.</div>
            <div>He resolves tonight, as every night, to honor his forebear with a singing voice that might bring out the better angels of human nature.</div>
            <div>If the audience is left to the influence of the RESTAURANTEUR, they might be liable to seek in religious illusion what can only be be attempted through science and culture.</div>`
        ]],
        [[
            `<div>A new face walks through the restaurant doors, holding a confidence unlike that of any of the other customers.</div>
            <div>"Somebody's got to turn the lights on in this joint."</div>
            <div>A glance at the literature in possession of the SINGER and the RESTAURANTEUR prompt additional comment from the unimpressed RATIONALIST: "metaphorically and literally."</div>
            <div>"If you prefer to live in ignorance, you're welcome to accept the idea that we can know nothing with certainty.</div> 
            <div>But I will show your patrons that life is neither a game of chance nor one of induction. It is a syllogism!</div>`
        ]],
        [[
            `<div>The RATIONALIST leaves the restaurant in order to gather more followers, spreading a message of certainty.</div>
            <div>Despite their opposing beliefs, The SINGER and the OWNER continue their uneasy business partnership, because neither know what tomorrow may bring.</div>
            <div>Nevertheless, the RATIONALIST has sown doubts in their mind as to whether reality might not be ascertainable after all...</div>`
        ],[
            `<div>Thank you for playing MEME TAG 1927</div>
            <div>Designed and developed by Benny Mattis</div>
            <div>as a submission for the Gaming Like it's 1927 game jam on itch.io</div>`
        ],[
            `<div>inspired by:</div>
            <div><cite>The Way of All Flesh</cite> (Dir. Viktor Fleming; Written by Lajos Biró, Jules Furthman, and Julian Johnson; 1927) described on IMDb and TCM</div>
            <div><cite>The Future of an Illusion</cite> (Sigmund Freud, 1927)</div>
            <div><cite>Pensées</cite> (Blaise Pascal, 1670)</div>
            <div>with accompanying music <cite>Early in the Morning Blues</cite> (The Virginians; Ray Klages; Ross Gorman; 1922) uploaded to archive.org by Jeff Kaplan
            </div>`
        ],[
            `This work was released to the public domain on February 1, 2023.`
        ], [
            `Refresh your browser to play again.`
        ]]
    ],
    instructions: [
        `<div>Player 1 (left < side) accelerates with W (up), A (left), S (down), and D (right) keys. 
        Player 2 (right > side) accelerates with the arrow keys. 
        Either player can pause the game by hitting the SPACEBAR.</div>
        <div>The game ends when player 1 and player 2 collide. 
        If it happens on the left side of the screen, player 1 wins. 
        If it happens on the right side, player 2 wins.</div>`,
        `<div>Tag customers to influence their mind with your meme (< or >).
        When a customer tagged with your meme crosses all they way to the far edge of your side of the screen, their heart has been won.
        Tag the opposing player while on your side of the screen to bring them under the influence of your meme.
        When all non-player characters' hearts have been won, the player whose meme has won the most hearts wins.</div>`,
        `<div>The RATIONALISTS (^) are skilled in rhetoric. 
        Avoid them at all costs while attempting to win hearts!</div>`
    ]
};

const clearScreen = function() {
    state.winner = null;
    state.agents.forEach(agent => {
        document.body.removeChild(agent.div);
    });
    state.agents = [];
    state.banner.style.display = "none";
    if (state.refresher) clearInterval(state.refresher);
};

const bannerContents = function() {
    let result = `<div>Level ${state.level}, Round ${state.round}</div>
    <div>${state.winner} wins!</div>`;
    if (state.level > 1) {
        result += `<div class="underline">HEARTS WON THIS ROUND:</div>
            <div>P1: ${state.hearts["P1"]} &hearts; P2: ${state.hearts["P2"]}`;
        if (state.level > 2) {
            result += ` &hearts; CPU: ${state.hearts["CPU"]}`;
        }
        result += `</div>`;
    }
    result += `<div class="underline">ROUNDS WON THIS LEVEL:</div>
        <div>P1: ${state.scores["P1"]} &hearts; P2: ${state.scores["P2"]}`;
    if (state.level > 2) {
        result += ` &hearts; CPU: ${state.scores["CPU"]}`;
    }
    result += `</div>
        <div class="underline">LEVELS WON THIS GAME:</div>
        <div>P1: ${state.totals["P1"]} &hearts; P2: ${state.totals["P2"]}`;
    if (state.level > 2) {
        result += ` &hearts; CPU: ${state.totals["CPU"]}`;
    }
    result += `</div>`;
    if ((state.level == state.lastLevel) && (state.round == state.lastRound)) {
        let [oneTotal, twoTotal] = [state.totals["P1"], state.totals["P2"]];
        if (oneTotal == twoTotal) {
            result += `<div>TIE GAME!</div>`;
        } else {
            result += `<div>GAME WINNER: ${oneTotal > twoTotal ? "P1" : "P2"}</div>`;
        }
    }
    result += `<div>Press any key to continue.</div>`;
    return result;
};

const displayBanner = function() {
    state.banner.innerHTML = `<div>ROUND WINNER: ${state.winner}</div>`;
    state.banner.style.display = "flex";
    clearInterval(state.refresher);
    setTimeout(() => {
        state.banner.innerHTML = bannerContents();
        document.onkeydown = () => {
            nextScene();
        };
    }, 1500);
    
};

const displayPauseScreen = function() {
    state.banner.innerHTML = `${state.instructions[state.level - 1]}
    <div>Press SPACEBAR to continue playing</div>`;
    state.banner.style.display = "flex";
};

const roundOver = function() {
    state.scores[state.winner]++;
    if (state.round == state.lastRound) {
        let levelWinner;
        let maxScore = 0;
        for (const player in state.scores) {
            const playerScore = state.scores[player];
            if (playerScore > maxScore) {
                maxScore = playerScore;
                levelWinner = player;
            }
        }
        state.totals[levelWinner]++;
        console.log(`Level winner: ${levelWinner} (${state.scores[levelWinner]})`);
    }
    displayBanner();
};

const handleCollision = function(firstAgent, secondAgent) {
    if (firstAgent.agentType == "player" && secondAgent.agentType == "player") {
        if ((state.agents[0].x + state.divWidth - 50) < (50 - state.agents[1].x)){
                state.winner = "P1";
                roundOver();
        } else {
                state.winner = "P2";
                roundOver();
        }
    } else if (secondAgent.team == "^" || firstAgent.team == "=") {
        firstAgent.team = secondAgent.team;
        firstAgent.div.innerHTML = secondAgent.team;
        if (firstAgent.agentType == "player") {
            firstAgent.agentType = "npc";
            firstAgent.div.className = "npc";
        }
    } else if (firstAgent.team == "^" || secondAgent.team == "=") {
        secondAgent.team = firstAgent.team;
        secondAgent.div.innerHTML = firstAgent.team;
        if (secondAgent.agentType == "player") {
            secondAgent.agentType = "npc";
            secondAgent.div.className = "npc";
        }
    } else {
        secondAgent.team = firstAgent.team;
        secondAgent.div.innerHTML = secondAgent.team;
    }
};

const remedyOverlaps = function(firstAgent, secondAgent) {
    const overlapType = ["", ""];
    const topEdge = firstAgent.y;
    const bottomEdge = topEdge + state.divHeight;
    const compareTopEdge = secondAgent.y;
    const compareBottomEdge = compareTopEdge + state.divHeight;
    if (topEdge > compareTopEdge && topEdge < compareBottomEdge) {
        overlapType[0] = "bottom";
    } else if (topEdge < compareTopEdge && bottomEdge > compareTopEdge) {
        overlapType[0] = "top";
    } else if (topEdge == compareTopEdge && bottomEdge == compareBottomEdge) {
        overlapType[0] = "exact";
    } else {
        return;
    }
    const leftEdge = firstAgent.x;
    const rightEdge = leftEdge + state.divWidth;
    const compareLeftEdge = secondAgent.x;
    const compareRightEdge = compareLeftEdge + state.divWidth;
    if (leftEdge > compareLeftEdge && leftEdge < compareRightEdge) {
        overlapType[1] = "right";
    } else if (leftEdge < compareLeftEdge && rightEdge > compareLeftEdge) {
        overlapType[1] = "left";
    } else if (leftEdge == compareLeftEdge && rightEdge == compareRightEdge) {
        overlapType[1] = "exact";
    } else {
        return;
    }
    if (overlapType[0] == "top") {
        firstAgent.y = compareTopEdge - state.divHeight;
        firstAgent.yAcceleration = -1;
        secondAgent.yAcceleration = 1;
    } else if (overlapType[0] == "bottom") {
        firstAgent.y = compareBottomEdge;
        firstAgent.yAcceleration = 1;
        secondAgent.yAcceleration = -1;
    } 
    if (overlapType[1] == "right") {
        firstAgent.x = compareRightEdge;
        firstAgent.xAcceleration = 1;
        secondAgent.xAcceleration = -1;
    } else if (overlapType[1] == "left") {
        firstAgent.x = compareLeftEdge - state.divWidth;
        firstAgent.xAcceleration = -1;
        secondAgent.xAcceleration = 1;
    }
    [firstAgent.yVelocity, secondAgent.yVelocity] = [0, 0];
    handleCollision(firstAgent, secondAgent);
    return;
    }

const checkCollisions = function() {
    for (let i = 0; i < state.agents.length; i++) {
        const firstAgent = state.agents[i];
        for (let j = i + 1; j < state.agents.length; j++) {
            const secondAgent = state.agents[j];
            if (firstAgent.active && secondAgent.active) {
                remedyOverlaps(firstAgent, secondAgent);
            }
        }
    }
};

const captureAgent = function(agent, capturer) {
    agent.active = false;
    agent.div.style.opacity = .5;
    state.hearts[capturer]++;
    console.log(`${capturer} hearts: ${state.hearts[capturer]}`);
};

const calculateWinner = function() {
    let mostHearts = 0;
    for (const player in state.hearts) {
        const currentHearts = state.hearts[player];
        if (currentHearts > mostHearts) {
            mostHearts = currentHearts;
            state.winner = player;
        }
    }
    console.log(`Round winner: ${state.winner} Hearts: ${state.hearts["P1"]}, ${state.hearts["P2"]}, ${state.hearts["CPU"]}`);
};

const moveAgent = function(agent) {
    checkCollisions();
    if (agent.agentType == "npc") {
        if (agent.team == "<") {
            agent.xAcceleration = (Math.random() < (0.5 + state.teamInfluence) ? -1 : 1);
        } else if (agent.team == ">") {
            agent.xAcceleration = (Math.random() > (0.5 + state.teamInfluence) ? -1 : 1);
        } else {
            agent.xAcceleration = (Math.random() < 0.5 ? -1 : 1);
        }
        if (agent.team == "^") {
            agent.yAcceleration = (Math.random() < (0.5 + state.teamInfluence) ? -1 : 1);
        } else {
            agent.yAcceleration = (Math.random() < 0.5 ? -1 : 1);
        }
    } else if (agent.agentType == "cpu") {
        let closestTarget = null;
        let closestDistance = 100;
        state.agents.filter(currentAgent => (currentAgent.active && currentAgent.team != "^")).forEach(potentialTarget => {
            const distance = Math.sqrt(Math.pow(agent.x - potentialTarget.x, 2) + Math.pow(agent.y - potentialTarget.y, 2));
            if (distance < closestDistance) {
                closestTarget = potentialTarget;
                closestDistance = distance; 
            }
        });
        if (closestTarget) {
            agent.xAcceleration = closestTarget.x < agent.x ? -1 : 1;
            agent.yAcceleration = closestTarget.y < agent.y ? -1 : 1;
        } else {
            agent.xAcceleration = 0;
            agent.yAcceleration = 0;
            agent.xVelocity = 0;
            agent.yVelocity = 0;
        }
    }
    agent.xVelocity += agent.xAcceleration * state.speed;
    agent.yVelocity += agent.yAcceleration * state.speed;
    if (Math.abs(agent.xVelocity) > state.divWidth) {
        agent.xVelocity = agent.xVelocity > 0 ? state.divWidth : (-1 * state.divWidth);
    }
    if (Math.abs(agent.yVelocity) > state.divHeight) {
        agent.yVelocity = agent.yVelocity > 0 ? state.divHeight : (-1 * state.divHeight);
    }
    agent.x += agent.xVelocity;
    agent.y += agent.yVelocity;
    if (agent.y < 0) {
        agent.y = 0;
        agent.yVelocity = 0;
        agent.yAcceleration = 1;
        if ((agent.agentType == "npc") && (agent.team == "^")) {
            captureAgent(agent, "CPU");
        }
    }
    else if (agent.x < 0) {
        agent.x = 0;
        agent.xVelocity = 0;
        agent.xAcceleration = 1;
        if (agent.agentType == "npc" && agent.team == "<") {
            captureAgent(agent, "P1");
        }
    }
    else if (agent.x > (100 - state.divWidth)) {
        agent.x = (100 - state.divWidth);
        agent.xVelocity = 0;
        agent.xAcceleration = -1;
        if (agent.agentType == "npc" && agent.team == ">") {
            captureAgent(agent, "P2");
        }
    }
    else if (agent.y > (100 - state.divHeight)) {
        agent.y = (100 - state.divHeight);
        agent.yVelocity = 0;
        agent.yAcceleration = -1;
    }
};

const renderAgents = function() {
    state.audioStartTime = Date.now();
    if (state.paused) {
        state.agents.forEach(agent => agent.div.style.display = "none");
        displayPauseScreen();
        return;
    } 
    if (state.banner.style.display != "none") {
        state.banner.style.display = "none";
        state.agents.forEach(agent => agent.div.style.display = "flex");
    }
    let outcomeDecided = true
    state.frame += .1;
    state.agents.forEach(agent => {
        if (agent.div.style.display != "flex") {
            agent.div.style.display = "flex";
        }
        if (agent.active) {
            if (agent.agentType == "npc" && agent.active) {
                outcomeDecided = false;
            }
            moveAgent(agent);
            agent.div.style.opacity = 0.6 + 0.4 * Math.abs(Math.sin(state.frame));
            agent.div.style.top = agent.y + "vh";
            agent.div.style.left = agent.x + "vw";
        } 
        
    });
    if (outcomeDecided && state.level >= 2) {
        calculateWinner();
        roundOver();
    }
    state.audioEndTime = Date.now();
    if (state.audioEndTime < state.audioStartTime) {
        alert(`Timing malfunction. End time: ${state.audioEndTime} Start time: ${state.audioStartTime}`);
    }
};

const setupRound = function() {
    const playerLeft = {
        agentType: "player",
        team: "<",
        div: document.createElement("div"),
        y: 80,
        x: 20 - state.divWidth,
        xAcceleration: 0,
        yAcceleration: 0,
        yVelocity: 0,
        xVelocity: 0,
        active: true
    };
    const playerRight = {
        agentType: "player",
        team: ">",
        div: document.createElement("div"),
        y: 80,
        x: 80,
        xAcceleration: 0,
        yAcceleration: 0,
        yVelocity: 0,
        xVelocity: 0,
        active: true
    };
    state.agents = [playerLeft, playerRight];
    if (state.level > 2) {
        state.agents.push({
            agentType: "cpu",
            team: "^",
            div: document.createElement("div"),
            y: 20 - state.divHeight,
            x: 50 - .5 * state.divWidth,
            xAcceleration: 0,
            yAcceleration: 0,
            yVelocity: 0,
            xVelocity: 0,
            active: true
        });
    }
    if (state.level > 1) {
        for (let i = 0; i < 7; i++) {
            state.agents.push({
                agentType: "npc",
                team: "=",
                div: document.createElement("div"),
                y: Math.random() * 50 + 25,
                x: Math.random() * 50 + 25,
                xAcceleration: 0,
                yAcceleration: 0,
                yVelocity: 0,
                xVelocity: 0,
                active: true
            });
        }
    }
    state.agents.forEach(agent => {
        agent.div.className = agent.agentType;
        agent.div.innerHTML = agent.team;
        document.body.appendChild(agent.div);
    });
    document.onkeydown = function(e) {
        try {
            state.gameKeyFunctions[e.key]();
        } catch (e) {
            console.log("You pressed the wrong key!");
        }
    };
    state.audio.play();
    state.refresher = setInterval(renderAgents, 42);
};

const cutscene = function() {
    state.story.style.display = "flex";
    let scenes = state.cutscenes[state.level - 1];
    let sceneIndex = 0;
    state.story.innerHTML = scenes[sceneIndex];
    document.onkeydown = () => {
        if (scenes[sceneIndex + 1])  {
            sceneIndex++;
            state.story.innerHTML = scenes[sceneIndex];
        } else {
            if (state.level > state.lastLevel) return;
            state.story.style.display = "none";
            setupRound();
        }
    };
};

const nextScene = function() {
    clearScreen();
    if (state.level >= 2) {
        for (const player in state.hearts) {
            state.hearts[player] = 0;
        }
    } 
    if (state.round == state.lastRound) {
        state.level++;
        for (const player in state.scores) {
            state.scores[player] = 0;
        }
        state.paused = true;
        state.round = 1;
        cutscene();
    } else {
        state.round++;
        setupRound();
    }
};

state.audio.loop = true;
nextScene();
