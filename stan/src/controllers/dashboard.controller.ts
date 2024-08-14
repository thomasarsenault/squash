import ClientResponse from '@middleware/clientResponse';
import dashboardService from '@services/dashboard.service';

const getDashboard = async (req: Request) => {
    const weather: any[] = await dashboardService.getWeather();

    return new ClientResponse(JSON.stringify(weather), { status: 200 });
}


export default {
    getDashboard
};