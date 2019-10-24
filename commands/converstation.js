module.exports = {
    name: 'newconversation',
    description: 'Randomly selects a new conversation intro',
    guildOnly: true,
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);
        if (message.member.roles.has(Role.id)) {
                // grab the "first" mentioned user from the message
                // this will return a `User` object, just like `message.author`

                var trollMessages = ["It's time for us to take a gentle stroll down Conversation Street.",
                "It's time for us to check our mirrors and make a smooth left into Conversation Street.",
                "It's time for us to make a gentle left into Conversation Street.",
                "It is now time for us to engage reverse and park neatly in a marked space on Conversation Street.",
                "It's time to drop it a cog and hook a left into Conversation Street.",
                "Let's do that by popping some loose change in the ticket machine so we can park awhile on Conversation Street.",
                "It's time now for us to enjoy a gentle stroll along the sunlit sidewalks of Conversation Street.",
                "It's time now for us to take a gentle cruise down the velvety smoothness of Conversation Street.",
                "It is time to set the satnav for destination chat, as we head down Conversation Street.",
                "It is now time for us to visit the headquarters of Chat & Co, who are, of course, based on Conversation Street.",
                "It's time for us to take a stroll down the smooth sidewalks of Conversation Street.",
                "It is time for us to lean on the lamppost of chat, in Conversation Street.",
                "It is now time for us to peer down a manhole of chat on Conversation Street.",
                "It's time for us to plant a sapling of chat on Conversation Street.",
                "It is time for us to pop into the post office of chat on Conversation Street.",
                "It's time to slide across an icy puddle of chat on Conversation Street.",
                "It is now time for us to plant some daffodils of opinion on the roundabout of chat at the end of Conversation Street.",
                "It is time to ring the doorbell of debate on the house of chat, located on Conversation Street.",
                "It's time to order some doughnuts of debate from the Chat Café, on Conversation Street."
                ];

                var trollMessage = trollMessages[Math.floor(Math.random() * trollMessages.length)];

                client.channels.find("name", "the-handpump-pub").setTopic(trollMessage);
                client.channels.find("name", "the-handpump-pub").send(trollMessage);
        }else{
            message.channel.send('You need more permissions to do this command!');
        }
    },
};