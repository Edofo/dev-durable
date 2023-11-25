const hero = document.getElementById("hero");
const bg = document.getElementById("hero-img");
const cloud = document.getElementsByClassName("hero-cloud")[0];
const heroContents = document.getElementsByClassName("hero-content");

const index = [
    {
        id: 0,
        bg: "./assets/images/bg-mountains.jpeg",
        isActive: true,
    },
    {
        id: 1,
        bg: "./assets/images/bg-mountains2.jpeg",
        isActive: false,
    },
    {
        id: 2,
        bg: "./assets/images/bg-mountains3.jpeg",
        isActive: false,
    },
    {
        id: 3,
        bg: "./assets/images/bg-mountains4.jpeg",
        isActive: false,
    },
    // {
    //     id: 4,
    //     bg: "./assets/images/finish.jpeg",
    //     isActive: false,
    // },
];

const transition = "height 2s ease-in-out, opacity 2s ease-in-out";
const minCloud = 60;
const maxCloud = 200;
const step = 800;

window.addEventListener("load", () => {
    cloud.style.transition = transition;
    hero.classList.add("animate");
    document.body.style.overflow = "hidden";
    document.body.style.height = step * index.length * 1.1 + "px";

    setTimeout(() => {
        cloud.style.transition = "";
        document.body.style.overflow = "";
    }, 2000);
});

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;

    const actualIndex = index.find((el) => el.isActive);
    if (actualIndex.isLoading) return;

    const cloudHeight = minCloud + ((scroll - actualIndex.id * step) / step) * (maxCloud - minCloud);
    cloud.style.height = `${cloudHeight}vh`;

    const opacity = 0.9 + ((scroll - actualIndex.id * step) / step) * 0.1;
    cloud.style.opacity = opacity;
    // Check if cloud height is less than 200vh before proceeding
    if (cloudHeight >= maxCloud) {
        const findIndex = index.find((el, i, arr) => {
            const nextIndex = arr[i + 1];
            return el.id * step <= scroll && (nextIndex ? scroll < nextIndex.id * step : true) && !el.isActive;
        });

        switchHero(findIndex);

        heroContents[actualIndex.id].classList.remove("display");
    }

    if (cloudHeight <= minCloud && actualIndex.id !== 0) {
        // get the previous index
        const findIndex = index.find((el) => el.id === actualIndex.id - 1);
        findIndex.isLoading = true;
        document.body.style.overflow = "hidden";

        // set 200vh to the cloud height
        cloud.style.transition = transition;
        cloud.style.height = `${maxCloud}vh`;
        cloud.style.opacity = 1;

        setTimeout(() => {
            cloud.style.transition = "";
            switchHero(findIndex);

            heroContents[actualIndex.id].classList.remove("display");
        }, 2000);
    }
});

const switchHero = (findIndex) => {
    if (findIndex) {
        index.forEach((el) => el.id !== findIndex.id && ((el.isActive = false), (el.isLoading = false)));
        findIndex.isActive = true;
        findIndex.isLoading = true;

        heroContents[findIndex.id].classList.add("display");
        // get height of hero
        const heroHeight = hero.offsetHeight;
        const percentHeight = (75 * heroHeight) / 100;
        heroContents[findIndex.id].style.top = `${percentHeight + findIndex.id * step}px`;

        // disable scroll
        document.body.style.overflow = "hidden";

        cloud.style.transition = transition;
        cloud.style.height = `${minCloud}vh`;
        cloud.style.opacity = 0.9;

        bg.src = findIndex.bg;

        setTimeout(() => {
            cloud.style.transition = "";
            findIndex.isLoading = false;
            document.body.style.overflow = "";
        }, 2000);

        // scroll to the of the section
        window.scroll(0, findIndex.id * step);
    }
};
