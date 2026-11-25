export interface User {

    id: string;
    email: string;
    password_hash: string;
    name: string;
    last_name: string;
    role: "CUSTOMER" | "ADMIN";
    status: "ACTIVE" | "INACTIVE";
}