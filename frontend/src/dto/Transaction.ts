export interface Transaction {
    id: number;
    date_time: string;
    customer_name: string;
    final_amount: number;
    status: string;
    items?: any[];
}