const message = "some message from myModule.js"

const name = "ahmed"

const location = "Ismailia"

const getGreating = (name) => {
    return `Hello ${name}`
}

export { message, name, getGreating, location as default }