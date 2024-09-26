import {test, expect} from '@playwright/test';
import { peopleManagementApi } from "../../../api/peopleManagementApi.ts"
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('tests/data/api/profileData.json', 'utf-8'));
const login = JSON.parse(fs.readFileSync('tests/data/loginData.json', 'utf-8'));
let tokenValueADMIN
let tokenValueUSER

test.describe('ADMIN', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        const respToken = await query.PostAuthRequest(login.AuthAdmin)
        tokenValueADMIN = respToken
    });
    
    test.describe('GET', () => {
        for (const dataProfile of data.getDataProfile) {
            test(dataProfile.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProfile.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataAdmin.pathBase, data.createUserDataAdmin);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueADMIN, dataProfile.pathId + body.profileId);
                    await query.DeleteRequest(tokenValueADMIN, data.createUserDataAdmin.pathId + body.id);
                    expect(get_status[0]).toBe(dataProfile.statusCodeAdmin);
                }
                else{
                    const status = await query.GetRequest(tokenValueADMIN ,dataProfile.path + dataProfile.id);
                    expect(status[0]).toBe(dataProfile.statusCodeAdmin);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProfile of data.putDataProfile) {
            test(dataProfile.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProfile.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataAdmin.pathBase, data.createUserDataAdmin);
                    let body = post_status[1]
                    const put_status = await query.PutRequest(tokenValueADMIN, dataProfile.pathId + body.profileId, dataProfile);
                    await query.DeleteRequest(tokenValueADMIN, data.createUserDataAdmin.pathId + body.id); 
                    expect(put_status[0]).toBe(dataProfile.statusCodeAdmin);
                }
                else{
                    const status = await query.PutRequest(tokenValueADMIN, dataProfile.path + dataProfile.id, dataProfile);
                    expect(status[0]).toBe(dataProfile.statusCodeAdmin);
                }
            }); 
        }
    }); 
})

test.describe('USER', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(login.AuthAdmin)
        tokenValueADMIN = respToken
        respToken = await query.PostAuthRequest(login.AuthUser);
        tokenValueUSER = respToken;
    });
    
    test.describe('GET', () => {
        for (const dataProfile of data.getDataProfile) {
            test(dataProfile.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProfile.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataUser.pathBase, data.createUserDataUser);
                    const body = post_status[1]
                    const get_status = await query.GetRequest(tokenValueUSER, dataProfile.pathId + body.profileId);
                    await query.DeleteRequest(tokenValueADMIN, data.createUserDataUser.pathId + body.id);
                    expect(get_status[0]).toBe(dataProfile.statusCodeUser);
                }   
                else{
                    const status = await query.GetRequest(tokenValueUSER, dataProfile.path + dataProfile.id);
                    expect(status[0]).toBe(dataProfile.statusCodeUser);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProfile of data.putDataProfile) {
            test.describe('FOR ANOTHER USER', () => {
                test(dataProfile.desc, async({request}) =>{
                    const query = new peopleManagementApi(request);
                    if(dataProfile.create == "True"){
                        const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataUser.pathBase, data.createUserDataUser);
                        let body = post_status[1]
                        const put_status = await query.PutRequest(tokenValueUSER, dataProfile.pathId + body.profileId, dataProfile);
                        await query.DeleteRequest(tokenValueADMIN, data.createUserDataUser.pathId + body.id); 
                        expect(put_status[0]).toBe(dataProfile.statusCodeUser);
                    }
                    else{
                        const status = await query.PutRequest(tokenValueUSER, dataProfile.path + dataProfile.id, dataProfile);
                        expect(status[0]).toBe(dataProfile.statusCodeUser);
                    }
                });
            });
        }
        for (const dataProfile of data.putDataProfile) {
            test.describe('FOR ACTIVE USER', () => {
                test(dataProfile.desc, async({request}) =>{
                    const query = new peopleManagementApi(request);
                    const put_status = await query.PutRequest(tokenValueUSER, dataProfile.pathId + 2, dataProfile);
                    expect(put_status[0]).toBe(dataProfile.statusCodeActiveUser);
                });
            });
        }
    }); 
});

test.describe('UNAUTHORIZED', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        const respToken = await query.PostAuthRequest(login.AuthAdmin)
        tokenValueADMIN = respToken
    });
    test.describe('GET', () => {
        for (const dataProfile of data.getDataProfile) {
            test(dataProfile.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProfile.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataUnauthorized.pathBase, data.createUserDataUnauthorized);
                    const body = post_status[1]
                    const get_status = await query.GetRequest('', dataProfile.pathId + body.id);
                    await query.DeleteRequest(tokenValueADMIN, data.createUserDataUnauthorized.pathId + body.id);
                    expect(get_status[0]).toBe(dataProfile.statusCodeUnauthorized);
                }
                else{
                    const status = await query.GetRequest('' ,dataProfile.path + dataProfile.id);
                    expect(status[0]).toBe(dataProfile.statusCodeUnauthorized);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataProfile of data.putDataProfile) {
            test(dataProfile.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataProfile.create == "True"){
                    const post_status = await query.PostRequest(tokenValueADMIN, data.createUserDataUnauthorized.pathBase, data.createUserDataUnauthorized);
                    let body = post_status[1]
                    const put_status = await query.PutRequest('', dataProfile.pathId + body.id_profile, data.createProfileData);
                    await query.DeleteRequest(tokenValueADMIN, data.createUserDataUnauthorized.pathId + body.id); 
                    expect(put_status[0]).toBe(dataProfile.statusCodeUnauthorized);
                }
                else{
                    const status = await query.PutRequest(tokenValueADMIN, dataProfile.path + dataProfile.id, dataProfile);
                    expect(status[0]).toBe(dataProfile.statusCodeUnauthorized);
                }
            }); 
        }
    }); 
})