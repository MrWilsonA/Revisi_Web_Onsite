export interface IceCream {
    ID: number;
    Name: string;
    PictureUrl: string;
    Price: number;
    Description: string;
    Flavour: string;
}

export interface NavContent {
    nav1: string;
    nav2: string;
    nav3: string;
}

export interface Carousel {
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    img5: string;
}

export interface CreateIceCreamResponse {
    message: string;
}