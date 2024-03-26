import fsPromise from 'fs/promises'

export default async (path: string) => {
    return fsPromise.readdir(path);
}