export class Contact {
    id: number;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;

    constructor(data?: any) {
        if (data && data.hasOwnProperty('id')) {
            Object.assign(this, data);
        }
    }
}