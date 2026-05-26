export function getRandomElement<T>(list: T[]): T {
    const randomIndex: number = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}