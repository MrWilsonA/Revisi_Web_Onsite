export interface Transaction {
    ID: number;
    DateTime: string;
    CustomerName: string;
    FinalAmount: number;
    Status: string;
    Items?: any[];
}