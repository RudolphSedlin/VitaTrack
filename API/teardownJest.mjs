import clean from "./tasks/clean.js";

const teardown = async () => {
    await clean();
}

export default teardown;
