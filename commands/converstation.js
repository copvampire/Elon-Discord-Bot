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
                "It's time to order some doughnuts of debate from the Chat Café, on Conversation Street.",
                "Now it is time to drop the car keys of chat, down the drain of debate, on conversation street.",
                "It is time to brim the tank of chat from the petrol station of debate, on the corner of conversation street.",
                "It is time for us to scrump an apple of chat from the orchard of intercourse which is on conversation street.",
                "It is time for us to splash in some puddles of chat left by the drizzle of debate that falls on conversation street.",
                "But now its time to hello to the old lady of debate who sits in the bus shelter of chat on conversation street.",
                "It is time to buy a four pack of chat from the off license of debate on conversation street.",
                "Now it is time to bite into a cake of debate from the cafe of chat on the corner of conversation street.",
                "We must move on because now it is time us to score a bag of chat from the dealer of debate on conversation street.",
                "Now it is time for us to deploy the plastic bag of chat to scoop up some dog eggs of debate from the pavements of conversation street."
                ];




                var trollMessage = trollMessages[Math.floor(Math.random() * trollMessages.length)];

                client.channels.find("name", "the-handpump-pub").setTopic(trollMessage);
                client.channels.find("name", "the-handpump-pub").send(trollMessage);
        }else{
            message.channel.send('You need more permissions to do this command!');
        }
    },
};