import transactionsController from "@controllers/transactions.controller";
import ClientResponse from "@middleware/clientResponse";

const handleTransactionsRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  if(url.pathname === '/transactions') {
    if(req.method === 'GET') {
      return transactionsController.getTransactions(req);
    } else if(req.method === 'POST') {
      return transactionsController.createTransaction(req);
    } else if(req.method === 'DELETE') {
      return transactionsController.deleteTransaction(req);
    } else if(req.method === 'PUT') {
      return transactionsController.updateTransaction(req);
    }
  }

  if(url.pathname === '/expenses') {
    if(req.method === 'GET') {
      return transactionsController.getExpenses(req);
    } else if(req.method === 'POST') {
      return transactionsController.createExpense(req);
    } else if(req.method === 'DELETE') {
      return transactionsController.deleteExpense(req);
    } else if(req.method === 'PUT') {
      return transactionsController.updateExpense(req);
    }
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleTransactionsRoute;