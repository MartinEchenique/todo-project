import { events } from "./pubSub.js";

const storage = (() => {

    const storeProjects = (projectList) => {
        projectList.forEach((project, i) => {
            localStorage.setItem(`project${i}`, JSON.stringify(project))
        });
        if (localStorage.length > projectList.length) {
            for (let i = projectList.length; i < localStorage.length; i++) {
                localStorage.removeItem(`project${i}`)
            }

        }
    }

    const storageEvents = (() => {
        events.on("projectsChanged", storeProjects)
    })()


})()
export { storage }