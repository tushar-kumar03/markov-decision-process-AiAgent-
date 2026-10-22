let currentStep = 0;
let animationRunning = false;
let timer = null;


/* =========================================================
   ROBOT FUNCTIONS
   ========================================================= */

function clearRobot() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("robot-active", "visited");

        const robot = cell.querySelector(".robot-icon");

        if (robot) {
            robot.remove();
        }
    });
}


function updateProgress(step) {
    const lastStep = robotPath.length - 1;

    let percentage = 0;

    if (lastStep > 0) {
        percentage = Math.round((step / lastStep) * 100);
    }

    document.getElementById("progress-bar").style.width =
        percentage + "%";

    document.getElementById("progress-text").innerText =
        percentage + "%";
}


function showRobot(step) {

    const position = robotPath[step];

    const row = position[0];
    const col = position[1];


    /* Remove current robot */

    document.querySelectorAll(".cell").forEach(cell => {

        cell.classList.remove("robot-active");

        const robot = cell.querySelector(".robot-icon");

        if (robot) {
            robot.remove();
        }
    });


    /* Mark previous cells as visited */

    for (let i = 0; i < step; i++) {

        const oldPosition = robotPath[i];

        const oldRow = oldPosition[0];
        const oldCol = oldPosition[1];

        const oldCell = document.querySelector(
            `.cell[data-row="${oldRow}"][data-col="${oldCol}"]`
        );

        if (oldCell) {
            oldCell.classList.add("visited");
        }
    }


    /* Current robot cell */

    const currentCell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );


    if (currentCell) {

        currentCell.classList.add("robot-active");

        const robot = document.createElement("span");

        robot.className = "robot-icon";

        robot.innerText = "🤖";

        currentCell.appendChild(robot);
    }


    /* Update position */

    document.getElementById("robot-position").innerText =
        `(${row}, ${col})`;

    document.getElementById("robot-step").innerText =
        step;


    updateProgress(step);
}


/* =========================================================
   RUN ROBOT
   ========================================================= */

function runRobot() {

    if (animationRunning) {
        return;
    }

    clearTimeout(timer);

    clearRobot();

    currentStep = 0;

    animationRunning = true;


    const button = document.getElementById("runButton");

    button.disabled = true;

    button.innerText = "🤖 ROBOT RUNNING...";


    document.getElementById("status").innerText =
        "ROBOT IS MOVING";

    document.getElementById("status-description").innerText =
        "Following the optimal policy.";


    animateRobot();
}


function animateRobot() {

    showRobot(currentStep);


    /* Goal reached */

    if (currentStep >= robotPath.length - 1) {

        animationRunning = false;


        document.getElementById("status").innerText =
            "🎯 GOAL REACHED";

        document.getElementById("status-description").innerText =
            "Robot successfully completed the optimal path.";

        document.getElementById("robot-face").innerText =
            "🏆";


        const button =
            document.getElementById("runButton");

        button.disabled = false;

        button.innerText =
            "✓ RUN AGAIN";

        return;
    }


    currentStep++;

    timer = setTimeout(
        animateRobot,
        700
    );
}


/* =========================================================
   RESET ROBOT
   ========================================================= */

function resetRobot() {

    clearTimeout(timer);

    animationRunning = false;

    currentStep = 0;

    clearRobot();

    showRobot(0);


    document.getElementById("status").innerText =
        "READY TO NAVIGATE";

    document.getElementById("status-description").innerText =
        "Press Run Robot to start the simulation.";

    document.getElementById("robot-face").innerText =
        "🤖";


    const button =
        document.getElementById("runButton");

    button.disabled = false;

    button.innerText =
        "▶ RUN ROBOT";
}


/* =========================================================
   LIGHT / DARK THEME
   ========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");


function updateThemeButton() {

    const isLight =
        document.body.classList.contains("light-mode");


    if (isLight) {

        themeIcon.innerText = "🌙";

        themeText.innerText = "Dark";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to dark mode"
        );

    } else {

        themeIcon.innerText = "☀️";

        themeText.innerText = "Light";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to light mode"
        );
    }
}


function setTheme(theme) {

    if (theme === "light") {

        document.body.classList.add("light-mode");

        document.documentElement.classList.add("light-mode");

        localStorage.setItem(
            "mdp-theme",
            "light"
        );

    } else {

        document.body.classList.remove("light-mode");

        document.documentElement.classList.remove("light-mode");

        localStorage.setItem(
            "mdp-theme",
            "dark"
        );
    }


    updateThemeButton();
}


function toggleTheme() {

    const isLight =
        document.body.classList.contains("light-mode");


    if (isLight) {
        setTheme("dark");
    } else {
        setTheme("light");
    }
}


/* =========================================================
   INITIALIZE THEME
   ========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem("mdp-theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        document.documentElement.classList.add("light-mode");

    } else {

        document.body.classList.remove("light-mode");

        document.documentElement.classList.remove("light-mode");
    }


    updateThemeButton();
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Theme */

        initializeTheme();


        /* Total reward */

        document.getElementById(
            "total-reward"
        ).innerText = totalReward;


        /* Initial robot position */

        showRobot(0);


        /* Theme button */

        if (themeToggle) {

            themeToggle.addEventListener(
                "click",
                toggleTheme
            );
        }
    }
);