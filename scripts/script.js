window.onload = () => {
    window.scrollTo(0, 0);
};

const hero = document.querySelector("#hero");
const bg = document.querySelector("#hero-img");
const cloud = document.querySelector(".hero-cloud");
const heroContents = document.querySelectorAll(".hero-content");

let index = [
    {
        id: 0,
        bg: "./assets/images/bg.webp",
        isActive: true,
    },
    {
        id: 1,
        bg: "./assets/images/bg2.webp",
        isActive: false,
    },
    {
        id: 2,
        bg: "./assets/images/bg3.webp",
        isActive: false,
    },
    {
        id: 3,
        bg: "./assets/images/bg4.webp",
        isActive: false,
    },
];

const transition = "width 2s ease-in-out, opacity 2s ease-in-out";
const minCloud = 100;
const maxCloud = 350;
const step = 800;
const heroTransition = "top 2s ease-in-out";

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

const updateCloudStyle = (scroll, actualIndex) => {
    const cloudWidth = minCloud + ((scroll - actualIndex.id * step) / step) * (maxCloud - minCloud);
    cloud.style.width = `${cloudWidth}vw`;

    const opacity = 0.9 + ((scroll - actualIndex.id * step) / step) * 0.1;
    cloud.style.opacity = opacity;

    if (cloudWidth >= maxCloud) {
        const findIndex = index.find((el) => el.id === actualIndex.id + 1);
        switchHero(findIndex, true);
        heroContents[actualIndex.id].classList.remove("display");
    }

    if (cloudWidth <= minCloud && actualIndex.id !== 0) {
        // get the previous index
        const findIndex = index.find((el) => el.id === actualIndex.id - 1);
        findIndex.isLoading = true;
        document.body.style.overflow = "hidden";

        const heroContent = heroContents[actualIndex.id];
        heroContent.style.transition = heroTransition;

        const heroHeight = hero.offsetHeight;
        const percentHeight = (75 * heroHeight) / 100;
        heroContent.style.top = `${percentHeight + findIndex.id * step}px`;

        cloud.style.transition = transition;
        cloud.style.width = `${maxCloud}vw`;
        cloud.style.opacity = 1;

        setTimeout(() => {
            cloud.style.transition = "";
            switchHero(findIndex, false);

            heroContents[actualIndex.id].classList.remove("display");
        }, 2000);
    }
};

const switchHero = (findIndex) => {
    if (findIndex) {
        index.forEach((el) => el.id !== findIndex.id && ((el.isActive = false), (el.isLoading = false)));
        findIndex.isActive = true;
        findIndex.isLoading = true;

        const heroContent = heroContents[findIndex.id];
        heroContent.classList.add("display");
        heroContent.style.top = "0px";
        heroContent.style.transition = heroTransition;

        const heroHeight = hero.offsetHeight;
        const percentHeight = (75 * heroHeight) / 100;
        heroContent.style.top = `${percentHeight + findIndex.id * step}px`;

        document.body.style.overflow = "hidden";

        cloud.style.transition = transition;
        cloud.style.width = `${minCloud}vw`;
        cloud.style.opacity = 0.9;

        bg.src = findIndex.bg;

        setTimeout(() => {
            cloud.style.transition = "";
            findIndex.isLoading = false;
            document.body.style.overflow = "";
        }, 2000);

        window.scroll(0, findIndex.id * step);
    }
};

const handleScrollEvent = () => {
    const scroll = window.scrollY;
    const actualIndex = index.find((el) => el.isActive);
    if (actualIndex.isLoading) return;

    updateCloudStyle(scroll, actualIndex);
};

window.addEventListener("scroll", handleScrollEvent);
