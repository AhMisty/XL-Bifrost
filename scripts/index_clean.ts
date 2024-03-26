import { rimraf } from 'rimraf'

export default async (path: string) => {
    return rimraf.rimraf(path);
}