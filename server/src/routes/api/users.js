import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import fetch from "isomorphic-fetch";

const api = Router();
const prisma = new PrismaClient()

async function fetchUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = await response.json();
  return data
}

api.get("/:username", async (request, response) => {
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
  if(user.length == 0){
    const githubUser = await fetchUser(username);
    if(githubUser.message){
      response.json(
        { message : githubUser.message }
      )
    }
    else {
      await prisma.user.create({
        data: {
          username: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
          html_url: githubUser.html_url,
          bio : githubUser.bio,
          company : githubUser.company,
          blog: githubUser.blog,
          location: githubUser.location,
          email: githubUser.email,
          hireable: githubUser.hireable,
          twitter_username: githubUser.twitter_username,
          public_repos: githubUser.public_repos,
          public_gists: githubUser.public_gists,
          followers: githubUser.followers,
          following: githubUser.following,
          created_at: githubUser.created_at,
          updated_at: githubUser.updated_at
        }
      })
      const user = await prisma.user.findMany({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        }
      })
      response.json({
        user: user[0]
      })
    }
  }
  else{
    response.json({
      user : user[0]
    })
  }
});



export default api;
