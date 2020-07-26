export class TokenClaim{
    role:string;
    email: string;
    nameId:string;
    token?: string;
    nbf:string;
    exp:string;
    iat:string;

    public constructor(init?: Partial<TokenClaim>) {
        Object.assign(this, init);
    }
}