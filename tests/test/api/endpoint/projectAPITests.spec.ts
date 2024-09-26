import {test, expect} from '@playwright/test';
import { peopleManagementApi } from "../../../api/peopleManagementApi.ts"
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('tests/data/api/projectData.json', 'utf-8'));
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
        for (const dataProject of data.postDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, dataProject);
                const body = status[1]
                await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                expect(status[0]).toBe(dataProject.statusCodeAdmin);
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataProject of data.getDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueADMIN, dataProject.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(get_status[0]).toBe(dataProject.statusCodeAdmin);
                }
                else{
                    const status = await query.GetRequest(tokenValueADMIN, dataProject.path + dataProject.id);
                    expect(status[0]).toBe(dataProject.statusCodeAdmin);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProject of data.putDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const put_status = await query.PutRequest(tokenValueADMIN, dataProject.pathId + body.id, dataProject);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(put_status[0]).toBe(dataProject.statusCodeAdmin);
                }
                else{
                    const status = await query.PutRequest(tokenValueADMIN, dataProject.path + dataProject.id, dataProject);
                    expect(status[0]).toBe(dataProject.statusCodeAdmin);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataProject of data.deleteDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(delete_status[0]).toBe(dataProject.statusCodeAdmin);
                }
                else{
                    const delete_status = await query.DeleteRequest(tokenValueADMIN, dataProject.path + dataProject.id); 
                    expect(delete_status[0]).toBe(dataProject.statusCodeAdmin);
                }
            });
        };
    });
})

test.describe('USER', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(loginAdmin.AuthAdmin);
        tokenValueADMIN = respToken;
        respToken = await query.PostAuthRequest(loginAdmin.AuthUser);
        tokenValueUSER = respToken;
    });

    test.describe('POST', () => {
        for (const dataProject of data.postDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest(tokenValueUSER, dataProject.pathBase, dataProject);
                expect(status[0]).toBe(dataProject.statusCodeUser);
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataProject of data.getDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueUSER, dataProject.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(get_status[0]).toBe(dataProject.statusCodeUser);
                }
                else{
                    const status = await query.GetRequest(tokenValueUSER, dataProject.path + dataProject.id);
                    expect(status[0]).toBe(dataProject.statusCodeUser);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProject of data.putDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const put_status = await query.PutRequest(tokenValueUSER, dataProject.pathId + body.id, dataProject);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(put_status[0]).toBe(dataProject.statusCodeUser);
                }
                else{
                    const status = await query.PutRequest(tokenValueUSER, dataProject.path + dataProject.id, dataProject);
                    expect(status[0]).toBe(dataProject.statusCodeUser);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataProject of data.deleteDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const delete_status_user = await query.DeleteRequest(tokenValueUSER, dataProject.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(delete_status_user[0]).toBe(dataProject.statusCodeUser);
                }
                else{
                    const delete_status = await query.DeleteRequest(tokenValueADMIN, dataProject.path + dataProject.id); 
                    expect(delete_status[0]).toBe(dataProject.statusCodeUser);
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
        for (const dataProject of data.postDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                const status = await query.PostRequest('', dataProject.pathBase, dataProject);
                const body = status[1]
                await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                expect(status[0]).toBe(dataProject.statusCodeUnauthorized);
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataProject of data.getDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const get_status = await query.GetRequest('', dataProject.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(get_status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
                else{
                    const status = await query.GetRequest('', dataProject.path + dataProject.id);
                    expect(status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProject of data.putDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const put_status = await query.PutRequest('', dataProject.pathId + body.id, dataProject);
                    await query.DeleteRequest(tokenValueADMIN, dataProject.pathId + body.id); 
                    expect(put_status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
                else{
                    const status = await query.PutRequest('', dataProject.path + dataProject.id, dataProject);
                    expect(status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataProject of data.deleteDataProject) {
            test(dataProject.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProject.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, dataProject.pathBase, data.createProjectData);
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest('', dataProject.pathId + body.id); 
                    expect(delete_status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
                else{
                    const delete_status = await query.DeleteRequest('', dataProject.path + dataProject.id); 
                    expect(delete_status[0]).toBe(dataProject.statusCodeUnauthorized);
                }
            });
        };
    });
})
