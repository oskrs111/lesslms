export function getRootUri() {
    return 'https://i2gq4kgoz2.execute-api.eu-west-1.amazonaws.com/less/'
}

export function setData(type, data) {
    sessionStorage.setItem(`lesslms-${type}`, JSON.stringify(data));
}

export function getData(type) {
    return JSON.parse(sessionStorage.getItem(`lesslms-${type}`));
}

export function getId(type) {
    let _d = new Date();
    return `${type}-${_d.getTime()}`;
}