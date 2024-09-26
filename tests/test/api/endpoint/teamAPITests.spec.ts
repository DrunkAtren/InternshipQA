import {test, expect} from '@playwright/test';
import { peopleManagementApi } from "../../../api/peopleManagementApi.ts"
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('tests/data/api/teamData.json', 'utf-8'));
const login = JSON.parse(fs.readFileSync('tests/data/loginData.json', 'utf-8'));
let tokenValueADMIN
let tokenValueUSER

test.describe('USER', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(login.AuthAdmin);
        tokenValueADMIN = respToken;
        respToken = await query.PostAuthRequest(login.AuthUser);
        tokenValueUSER = respToken; 
    });

    test.describe('POST', () => {
        for (const dataTeam of data.postDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                        data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueUSER, dataTeam.pathBase, 
                        {
                            "name" : dataTeam.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    await query.DeleteRequest(tokenValueADMIN,  data.createProjectData.pathId + body_project.id);
                    expect(post_status_team[0]).toBe(dataTeam.statusCodeUser);
                }
                else{
                    const post_status = await query.PostRequest(tokenValueUSER, dataTeam.path, dataTeam);
                    expect(post_status[0]).toBe(dataTeam.statusCodeUser);
                }
            }); 
        };

        for (const dataTeam of data.postDataAssignUserIntoTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_user = await query.PostRequest(tokenValueADMIN, data.createUserData.pathBase,
                        data.createUserData);
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                            data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, data.createTeamData.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_user = post_status_user[1];
                    let body_team = post_status_team[1];
                    const post_status_AssignUserIntoTeam = await query.PostRequest(tokenValueUSER, dataTeam.path, 
                        {
                                "userId" : body_user.id,
                                "teamId" : body_team.id
                        });
                        await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                        await query.DeleteRequest(tokenValueADMIN, data.createTeamData.pathId + body_team.id);  
                        await query.DeleteRequest(tokenValueADMIN, data.createUserData.pathId + body_user.id); 
                    expect(post_status_AssignUserIntoTeam[0]).toBe(dataTeam.statusCodeUser);
                }
                else{
                    const status = await query.PostRequest(tokenValueUSER, dataTeam.path, dataTeam);
                    expect(status[0]).toBe(dataTeam.statusCodeUser);
                }
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataTeam of data.getDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const get_status_team = await  query.GetRequest(tokenValueUSER, dataTeam.pathId + body_team.id)
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                    expect(get_status_team[0]).toBe(dataTeam.statusCodeUser);
                }
                else{
                    const status = await query.GetRequest(tokenValueUSER, dataTeam.path + dataTeam.id);
                    expect(status[0]).toBe(dataTeam.statusCodeUser);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataTeam of data.putDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest(tokenValueUSER, dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: body_project.id
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeUser);
                }
                else{
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest(tokenValueUSER, dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: dataTeam.projectId
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeUser);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataTeam of data.deleteDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_project[1]
                    const post_status = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, {
                        "name" : data.createTeamData.name,
                        "projectId" : body_project.id
                    });
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest(tokenValueUSER, dataTeam.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);
                    expect(delete_status[0]).toBe(dataTeam.statusCodeUser);
                }
                else{
                    const status = await query.DeleteRequest(tokenValueUSER, dataTeam.path + dataTeam.id); 
                    expect(status[0]).toBe(dataTeam.statusCodeUser);
                }
            });
        };
    });
});

test.describe('ADMIN', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(login.AuthAdmin);
        tokenValueADMIN = respToken;
    });

    test.describe('POST', () => {
        for (const dataTeam of data.postDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                        data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : dataTeam.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    await query.DeleteRequest(tokenValueADMIN,  data.createProjectData.pathId + body_project.id);
                    expect(post_status_team[0]).toBe(dataTeam.statusCodeAdmin);
                }
                else{
                    const post_status = await query.PostRequest(tokenValueADMIN, dataTeam.path, dataTeam);
                    expect(post_status[0]).toBe(dataTeam.statusCodeAdmin);
                }
            }); 
        };

        for (const dataTeam of data.postDataAssignUserIntoTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_user = await query.PostRequest(tokenValueADMIN, data.createUserData.pathBase,
                        data.createUserData);
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                            data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, data.createTeamData.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_user = post_status_user[1];
                    let body_team = post_status_team[1];
                    const post_status_AssignUserIntoTeam = await query.PostRequest(tokenValueADMIN, dataTeam.path, 
                        {
                                "userId" : body_user.id,
                                "teamId" : body_team.id
                        });
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                    await query.DeleteRequest(tokenValueADMIN, data.createTeamData.pathId + body_team.id);  
                    await query.DeleteRequest(tokenValueADMIN, data.createUserData.pathId + body_user.id);    
                    
                    expect(post_status_AssignUserIntoTeam[0]).toBe(dataTeam.statusCodeAdmin);
                }
                else{
                    const status = await query.PostRequest(tokenValueUSER, dataTeam.path, dataTeam);
                    expect(status[0]).toBe(dataTeam.statusCodeAdmin);
                }
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataTeam of data.getDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const get_status_team = await  query.GetRequest(tokenValueADMIN, dataTeam.pathId + body_team.id)
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                    expect(get_status_team[0]).toBe(dataTeam.statusCodeAdmin);
                }
                else{
                    const status = await query.GetRequest(tokenValueADMIN, dataTeam.path + dataTeam.id);
                    expect(status[0]).toBe(dataTeam.statusCodeAdmin);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataTeam of data.putDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest(tokenValueADMIN, dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: body_project.id
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeAdmin);
                }
                else{
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest(tokenValueADMIN, dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: dataTeam.projectId
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeAdmin);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataTeam of data.deleteDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_project[1]
                    const post_status = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, {
                        "name" : data.createTeamData.name,
                        "projectId" : body_project.id
                    });
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);
                    expect(delete_status[0]).toBe(dataTeam.statusCodeAdmin);
                }
                else{
                    const status = await query.DeleteRequest(tokenValueADMIN, dataTeam.path + dataTeam.id); 
                    expect(status[0]).toBe(dataTeam.statusCodeAdmin);
                }
            });
        };
    });
});

test.describe('UNAUTHORIZED', () => {
    test.beforeEach("Token Auth", async ({ request }) => {
        const query = new peopleManagementApi(request);
        let respToken = await query.PostAuthRequest(login.AuthAdmin);
        tokenValueADMIN = respToken;
    });

    test.describe('POST', () => {
        for (const dataTeam of data.postDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                        data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest('', dataTeam.pathBase, 
                        {
                            "name" : dataTeam.name,
                            "projectId" : body_project.id
                        });
                    await query.DeleteRequest(tokenValueADMIN,  data.createProjectData.pathId + body_project.id);
                    expect(post_status_team[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
                else{
                    const post_status = await query.PostRequest('', dataTeam.path, dataTeam);
                    expect(post_status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
            }); 
        };

        for (const dataTeam of data.postDataAssignUserIntoTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_user = await query.PostRequest(tokenValueADMIN, data.createUserData.pathBase,
                        data.createUserData);
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase,
                            data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, data.createTeamData.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_user = post_status_user[1];
                    let body_team = post_status_team[1];
                    const post_status_AssignUserIntoTeam = await query.PostRequest('', dataTeam.path, 
                        {
                                "userId" : body_user.id,
                                "teamId" : body_team.id
                        });
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                    await query.DeleteRequest(tokenValueADMIN, data.createTeamData.pathId + body_team.id);  
                    await query.DeleteRequest(tokenValueADMIN, data.createUserData.pathId + body_user.id);    
                    
                    expect(post_status_AssignUserIntoTeam[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
                else{
                    const status = await query.PostRequest(tokenValueUSER, dataTeam.path, dataTeam);
                    expect(status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
            }); 
        };
    });

    test.describe('GET', () => {
        for (const dataTeam of data.getDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.path, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const get_status_team = await  query.GetRequest('', dataTeam.pathId + body_team.id)
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);  
                    expect(get_status_team[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
                else{
                    const status = await query.GetRequest('', dataTeam.path + dataTeam.id);
                    expect(status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
            }); 
        };
    });

    test.describe('PUT', () => {
        for (const dataTeam of data.putDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest('', dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: body_project.id
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
                else{
                    const post_status_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_status_project[1]
                    const post_status_team = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, 
                        {
                            "name" : data.createTeamData.name,
                            "projectId" : body_project.id
                        });
                    let body_team = post_status_team[1]
                    const put_status = await query.PutRequest('', dataTeam.pathId + body_team.id, {
                        data: dataTeam,
                        projectId: dataTeam.projectId
                    });
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body_team.id);     
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id); 
                    expect(put_status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
            }); 
        }
    }); 

    test.describe('DELETE', () => {
        for (const dataTeam of data.deleteDataTeam) {
            test(dataTeam.desc, async({request}) =>{
                const query = new peopleManagementApi(request);
                if(dataTeam.create == "True"){
                    const post_project = await query.PostRequest(tokenValueADMIN, data.createProjectData.pathBase, data.createProjectData);
                    let body_project = post_project[1]
                    const post_status = await query.PostRequest(tokenValueADMIN, dataTeam.pathBase, {
                        "name" : data.createTeamData.name,
                        "projectId" : body_project.id
                    });
                    const body = post_status[1]
                    const delete_status = await query.DeleteRequest('', dataTeam.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, dataTeam.pathId + body.id); 
                    await query.DeleteRequest(tokenValueADMIN, data.createProjectData.pathId + body_project.id);
                    expect(delete_status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
                else{
                    const status = await query.DeleteRequest('', dataTeam.path + dataTeam.id); 
                    expect(status[0]).toBe(dataTeam.statusCodeUnauthorized);
                }
            });
        };
    });
});

