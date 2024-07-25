const generateRandomCode = () => {
    let code: number;
    code = Math.floor(100000 + Math.random() * 900000);
    return code;
}

export default generateRandomCode;