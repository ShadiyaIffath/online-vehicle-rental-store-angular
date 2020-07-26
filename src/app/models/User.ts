export class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    activatedDate:string;
    drivingLicense: string|any;
    active:boolean;
    additionalIdentification: string|any;
    token?: string;
    role: string;

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}