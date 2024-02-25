export function formatCash(str: string) {
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
    })
}

export function formatDateTime(time: string): string {
    const objectDate = new Date(time)
    let day = objectDate.getDate();

    let month = objectDate.getMonth() + 1;

    let year = objectDate.getFullYear();

    return day + "/" + month + "/" + year
}

export function convertTime(time: number) {
    const totalMinutes = Math.floor(time / 60);

    const seconds = time % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const strHours = hours < 10 ? `0${hours}` : `${hours}`
    const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const strSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`


    return `${strHours}:${strMinutes}:${strSeconds}`;
}