import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import fetch from "isomorphic-fetch";
import users from "./users";

const api = Router();
const prisma = new PrismaClient()

async function fetchUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await response.json();
    return data
}

api.get("/:username/repos", async (request, response) => {
    const { username } = request.params;
    response.set('Access-Control-Allow-Origin', '*');
    const user = await prisma.user.findMany({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      }
    })
    if(user.length !== 0){
      const repos = await prisma.repos.findMany({
        where: {
          authorId: {
            equals: user[0].id
          }
        }
      })
      if(repos.length == 0){
        const githubUserRepos = await fetchUserRepos(username);
        if(githubUserRepos.message){
          response.json(
            { message : githubUserRepos.message }
          )
        }
        else {
          githubUserRepos.forEach(async repo => {
            await prisma.repos.create({
              data: {
                name: repo.name,
                language: repo.language,
                description: repo.description,
                updated_at: repo.updated_at,
                visibility: repo.visibility,
                authorId: user[0].id
              }
            })
          });
          
          const repos = await prisma.repos.findMany({
            where: {
              authorId: {
                equals: user[0].id
              }
            }
          })
          response.json({
            repos: repos
          })
        }
      }
      else{
        response.json({
          repos : repos
        })
      }
    }
    else{
      response.json({
        message : "user not exist in our database, request this user at /:username first"
      })
    }
  });
  
  
  
  export default api;
  