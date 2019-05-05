export function setData_L(type, data) {
    localStorage.setItem(`lesslms-${type}`, JSON.stringify(data));
}

export function getData_L(type) {
    return JSON.parse(localStorage.getItem(`lesslms-${type}`));
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