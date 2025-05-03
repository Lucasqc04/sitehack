// Este arquivo exporta tipos e interfaces TypeScript usados na aplicação para segurança de tipos.
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
}

export type ApiResponse<T> = {
    data: T;
    message: string;
    status: number;
};