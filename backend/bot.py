import discord
import socketio
import atexit
import os
from dotenv import load_dotenv

client = discord.Client()
sio = socketio.AsyncClient()

load_dotenv()

@client.event
async def on_ready():
    await sio.connect('http://localhost:3006')
    print(f'{client.user} has connected to Discord!')

@sio.event
async def displayDiscord(message):
    mainChannel = await client.fetch_channel(942787626287648838)
    await mainChannel.send(message)

@client.event
async def on_message(message):
    if message.author.bot:
        return
    print(message.content)
    await sio.emit("recievedMessage", message.author.name + "#" + message.author.discriminator + ": " + message.content)

async def end():
    console.log("Shutting down...")
    await sio.disconnect()

atexit.register(end);

client.run(os.getenv("DISCORD_TOKEN"))
