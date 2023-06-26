import bcrypt from 'bcryptjs';

export async function encrypt(password: string) {
    const newPass = await bcrypt.hash(password, 10);
    return newPass;
}

export async function compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}