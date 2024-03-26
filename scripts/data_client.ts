import index_script from './index_script.js'

export default async (watch?: boolean) => {
    return index_script(`npx prisma generate ${watch?"--watch":""} --schema=./schema.prisma`).catch((error) => {
        console.error(error);
    });
}