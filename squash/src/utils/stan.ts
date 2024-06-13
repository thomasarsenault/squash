// class Stan {
//     // private headers: Record<string, string>;
//     // private apiUrl: string;

//     // constructor() {
//     //     this.headers = Stan._getHeaders();
//     //     this.apiUrl = import.meta.env.STAN_API_URL || '';
//     // }

//     private static _getHeaders() {
//         const token = localStorage.getItem('accessToken');
//         return {
//             'Authorization': `Bearer ${token}`
//         }
//     }

//     // // Method to update headers
//     // updateHeaders(newHeaders) {
//     //     this.headers = { ...this.headers, ...newHeaders };
//     // }

//     //make network request
//     static async fetch(url: string, params?: Record<string, any>) {
//         const apiUrl = import.meta.env.STAN_API_URL || '';

//         return fetch(`${apiUrl}${url}`, {...this._getHeaders, ...params})
//             .then(response => response.json())
//     } 
// }

import router from '@/router';

const _getHeaders = (method: string | undefined) => {
    const token = localStorage.getItem('accessToken');

    const headers: any = {
        'Authorization': `Bearer ${token}`,
    }

    return headers;
}

    // // Method to update headers
    // updateHeaders(newHeaders) {
    //     this.headers = { ...this.headers, ...newHeaders };
    // }

    //make network request
const Stan = async (url: string, params: Record<string, any> = {}): Promise<any> => {
    const apiUrl = import.meta.env.STAN_API_URL || '';

    return fetch(`${apiUrl}/api/${url}`, { ...params, headers: {..._getHeaders(params.method), ...params?.headers }})
        .then(async (response: any) => {
            if(response.status === 401) {
                console.log('redirecting to login page')
                router.push('/login')
            }
            
            return response.json();            
        })
} 

export default Stan;