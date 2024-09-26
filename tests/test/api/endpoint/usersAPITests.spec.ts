import {test, expect} from '@playwright/test';
import { peopleManagementApi } from "../../../api/peopleManagementApi.ts"
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('tests/data/api/userData.json', 'utf-8'));
const loginAdmin = JSON.parse(fs.readFileSync('tests/data/loginData.json', 'utf-8'));
let tokenValueADMIN
let tokenValueUSER

test.describe('ADMIN', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        const respToken = await query.PostAuthRequest(loginAdmin.AuthAdmin)
        tokenValueADMIN = respToken
    });

    test.describe('POST', () => {
        for (const dataUser of data.postDataUser) {
            test(dataUser.desc, async({request}) =>{
                console.log(dataUser)
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase, dataUser);
                const body = status[1]
                await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                expect(status[0]).toBe(dataUser.statusCodeAdmin);
            }); 
        };

        test(data.getAllData.desc, async({request}) =>{
            const query = new peopleManagementApi(request);
            const status = await query.PostRequest(tokenValueADMIN, data.getAllData.path, data.getAllData.body);
            expect(status[0]).toBe(data.getAllData.statusCodeAdmin);
        }); 
    });

    test.describe('GET', () => {
        for (const dataUser of data.getDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase, data.createUserDataAdmin);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueADMIN, dataUser.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(get_status[0]).toBe(dataUser.statusCodeAdmin);
                }
                else{
                    const status = await query.GetRequest(tokenValueADMIN, dataUser.path + dataUser.id);
                    expect(status[0]).toBe(dataUser.statusCodeAdmin);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataUser of data.putDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataAdmin);
                    const body = post_status[1]
                    const put_status = await query.PutRequest(tokenValueADMIN, dataUser.pathId + body.id, dataUser);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(put_status[0]).toBe(dataUser.statusCodeAdmin);
                }
                else{
                    const status = await query.PutRequest(tokenValueADMIN, dataUser.pathId + dataUser.id, dataUser);
                    expect(status[0]).toBe(dataUser.statusCodeAdmin);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataUser of data.deleteDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataAdmin);
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(delete_status[0]).toBe(dataUser.statusCodeAdmin);
                }
                else{
                    const status = await query.DeleteRequest(tokenValueADMIN, dataUser.path + dataUser.id); 
                    console.log(status[0])
                    expect(status[0]).toBe(dataUser.statusCodeAdmin);
                }
            });
        };
    });
});

test.describe('USER', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(loginAdmin.AuthAdmin)
        tokenValueADMIN = respToken
        respToken = await query.PostAuthRequest(loginAdmin.AuthUser)
        tokenValueUSER = respToken
    });

    test.describe('POST', () => {
        for (const dataUser of data.postDataUser) {
            test(dataUser.desc, async({request}) =>{
                console.log(dataUser)
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest(tokenValueUSER, dataUser.pathBase, dataUser);
                const body = status[1]
                await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                expect(status[0]).toBe(dataUser.statusCodeUser);
            }); 
        };

        test(data.getAllData.desc, async({request}) =>{
            const query = new peopleManagementApi(request);
            const status = await query.PostRequest(tokenValueUSER, data.getAllData.path, data.getAllData.body);
            expect(status[0]).toBe(data.getAllData.statusCodeUser);
        }); 
    });

    test.describe('GET', () => {
        for (const dataUser of data.getDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase, data.createUserDataUser);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueUSER, dataUser.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(get_status[0]).toBe(dataUser.statusCodeUser);
                }
                else{
                    const status = await query.GetRequest(tokenValueUSER, dataUser.path + dataUser.id);
                    expect(status[0]).toBe(dataUser.statusCodeUser);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataUser of data.putDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataUser);
                    const body = post_status[1]
                    const put_status = await query.PutRequest(tokenValueUSER, dataUser.pathId + body.id, dataUser);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(put_status[0]).toBe(dataUser.statusCodeUser);
                }
                else{
                    const status = await query.PutRequest(tokenValueUSER, dataUser.pathId + dataUser.id, dataUser);
                    expect(status[0]).toBe(dataUser.statusCodeUser);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataUser of data.deleteDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataUser);
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest(tokenValueUSER, dataUser.pathId + body.id); 
                    expect(delete_status[0]).toBe(dataUser.statusCodeUser);
                }
                else{
                    const status = await query.DeleteRequest(tokenValueUSER, dataUser.path + dataUser.id); 
                    expect(status[0]).toBe(dataUser.statusCodeUser);
                }
            });
        };
    });
})

test.describe('UNAUTHORIZED', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        const respToken = await query.PostAuthRequest(loginAdmin.AuthAdmin)
        tokenValueADMIN = respToken
    });

    test.describe('POST', () => {
        for (const dataUser of data.postDataUser) {
            test(dataUser.desc, async({request}) =>{
                console.log(dataUser)
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest('', dataUser.pathBase, dataUser);
                const body = status[1]
                await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                expect(status[0]).toBe(dataUser.statusCodeUnauthorized);
            }); 
        };

        test(data.getAllData.desc, async({request}) =>{
            const query = new peopleManagementApi(request);
            const status = await query.PostRequest('', data.getAllData.path, data.getAllData.body);
            expect(status[0]).toBe(data.getAllData.statusCodeUnauthorized);
        }); 
    });

    test.describe('GET', () => {
        for (const dataUser of data.getDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase, data.createUserDataUnauthorized);
                    const body = post_status[1]
                    const get_status = await query.GetRequest('', dataUser.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(get_status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
                else{
                    const status = await query.GetRequest('', dataUser.path + dataUser.id);
                    expect(status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataUser of data.putDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataUnauthorized);
                    const body = post_status[1]
                    const put_status = await query.PutRequest('', dataUser.pathId + body.id, dataUser);
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(put_status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
                else{
                    const status = await query.PutRequest('', dataUser.pathId + dataUser.id, dataUser);
                    expect(status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataUser of data.deleteDataUser) {
            test(dataUser.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataUser.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataUser.pathBase,  data.createUserDataUnauthorized);
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest('', dataUser.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, dataUser.pathId + body.id); 
                    expect(delete_status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
                else{
                    const status = await query.DeleteRequest('', dataUser.path + dataUser.id); 
                    await query.DeleteRequest(tokenValueADMIN, dataUser.path + dataUser.id); 
                    expect(status[0]).toBe(dataUser.statusCodeUnauthorized);
                }
            });
        };
    });
});
