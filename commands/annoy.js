// const fs = require('fs');

// module.exports = {
//     name: 'test',
//     description: 'Annoy the tagged user at a random interval (WIP)',
//     cooldown: 3,
//     execute(client, config, dataFile, message, args) {
        
//             var AnnoyTarget = dataFile[config.serverID]["Annoy_Targets"];

//             if (!message.mentions.users.size) {
//                 var taggedUser = message.author;
//             }
//             else {
//                 // grab the "first" mentioned user from the message
//                 // this will return a `User` object, just like `message.author`
//                 var taggedUser = message.mentions.users.first();
//             }

//             if(AnnoyTarget.includes(taggedUser.id)){
//                 var index = AnnoyTarget.indexOf(taggedUser.id);
//                 if (index !== -1) array.splice(index, 1);
//             }else{
//                 AnnoyTarget.push(taggedUser.id);
//             }

//             dataFile[config.serverID]["Annoy_Targets"][AnnoyTarget];
            
//             fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
//                 if (err) throw err;
//             });

            
//         message.channel.send(`${taggedUser.username}' Test! ${taggedUser.id}`);
    
//     },
// };