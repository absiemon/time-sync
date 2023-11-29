export const generateId = (name)=> {
    const length = 10;
    let randomNumberString = '';

    for (let i = 0; i < length; i++) {
        const randomDigit = Math.floor(Math.random() * 10);
        randomNumberString += randomDigit.toString();
    }

    return name + randomNumberString;
}
