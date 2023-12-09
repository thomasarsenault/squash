class ClientResponse extends Response {
    constructor(body: any, init: any) {
        super(body, init);
        this.headers.set('Access-Control-Allow-Origin', '*');
        this.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        this.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}

export default ClientResponse;