export interface IceCream {
    ID: number;
    Name: string;
    PictureUrl: string;
    Price: number;
    Description: string;
    Flavour: string;
}

export interface CreateIceCreamResponse {
    message: string;
}