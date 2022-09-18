import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutestoHourString } from "./utils/convert-minutes-to-hour-string";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (request, response) => {
    const games =  await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games);
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body : any = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart), 
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })
        
    return response.status(201).json(ad);
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: { 
            id: true, 
            name: true, 
            yearsPlaying: true, 
            weekDays: true, 
            hourStart: true,
            hourEnd: true, 
            useVoiceChannel: true,
        },
        where: {
            gameId,
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad, 
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutestoHourString(ad.hourStart),
            hourEnd: convertMinutestoHourString(ad.hourEnd),
        }
    }));
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.json({
        discord: ad.discord,
    });
})

app.listen(3333);


// HTTP Methods / API RESTful 
// GET, POST, PUT, PATCH, DELETE

/*
-> Tipos de params que são enviados pelas rotas
- Query: 
    Utilizados quando precisamos persistir estados. Utilizados para dados não sensíveis. São enviados pela URL. São nomeados.
    Ex: localhost:3333/ads?page=2&sort=title
- Route: 
    Utilizados quando vamos identificar um recurso da API. São enviados pela URL. Não são nomeados.
    Ex: localhost:3333/ads?page=2&sort=title
- Body:
    Não são enviados pela URL. Utilizados para o envio de informações sensíveis. Geralmente usado para o envio de formulários.
*/