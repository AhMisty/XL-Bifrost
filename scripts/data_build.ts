import data_clean from './data_clean.js'
import data_client from './data_client.js'

export default async (watch?: boolean) => {
    await data_clean();
    return data_client(watch);
}