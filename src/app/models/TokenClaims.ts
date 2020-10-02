export class TokenClaim{
    role:string;
    email: string;
    nameid:string;
    token?: string;
    nbf:string;
    exp:string;
    iat:string;

    public constructor(init?: Partial<TokenClaim>) {
        Object.assign(this, init);
    }
}