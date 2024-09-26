import { APIRequestContext, expect} from '@playwright/test';


const baseUrl = "http://localhost:8080/"; //This should be in another file and ignore by git

export class peopleManagementApi{
    constructor(private request: APIRequestContext){};

    async GetRequest(token, getRequest)
    {
        const response =  await this.request.get(baseUrl+getRequest,
        {
            headers: {'Authorization': `Bearer ${token}`}
        });
        
        return await this.Response(response);
    };

    async PostAuthRequest(postAuthData){
        const response = await this.request.post(baseUrl+"auth/login", 
        {
            data: postAuthData
        });
        let body   
        try {
            body = await response.json();
        } catch (e) {
            body = await response.text();
        }
        return body.accessToken
    };
    
    async PostRequest(token, postRequest, postData){
        const response = await this.request.post(baseUrl+postRequest, 
        {
            headers: {'Authorization': `Bearer ${token}`},
            data: postData
        });
        return await this.Response(response);
    };

    async PutRequest(token, putRequest, putData){
        const response = await this.request.put(baseUrl+putRequest, 
        {
            headers: {'Authorization': `Bearer ${token}`},
            data: putData
        });
        return await this.Response(response);
    };

    async DeleteRequest(token, deleteRequest){
        const response = await this.request.delete(baseUrl+deleteRequest, 
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
        );
        return await this.Response(response);
    };

    async Response(res)
    {   
        const status_code = await res.status();  

        let body;
        try {
            body = await res.json();
            console.log(body)
        } catch (e) {
            body = await res.text();
            console.log(body)
        }
        return [status_code, body];
    
    };

}