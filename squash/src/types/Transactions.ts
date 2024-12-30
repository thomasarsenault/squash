// TODO: type categories
export interface Transaction {
	id: number;
	date: string;
	name: string;
	amount: number;
	category: string; 
	subcategory: string;
	created_at: string;
	notes?: string;
	pending: boolean;
	tags?: string[];
}

export interface CategoryDropdownItem {
    label: string,
    value: string,
    items: {
        label: string,
        value: string,
        parentCategory: string
    }[]
}