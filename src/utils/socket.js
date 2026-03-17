const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const intilializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //Handle socket events here
   socket.on("joinChat", ({firstName,userId,targetUserId}) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(firstName + "Joined room: ", roomId);

      
    });

   socket.on("sendMessage", async ({ firstName,lastName, userId, targetUserId,text }) => {
     

      try{
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + " " + text)
        let chat = await Chat.findOne({participants:{$all:[userId,targetUserId]}});
        if(!chat){
          chat = new Chat({
            participants:[userId,targetUserId],
            messages:[]
          });
        }
        chat.messages.push({
          senderId:userId,
          text:text
        });
        await chat.save();

        io.to(roomId).emit("receivedMessage", {
        firstName,
        lastName,
        text,
      });

      }
      catch(err){
        console.log(err)
      } 
      



    });

   socket.on("disconnect", () => {
      
    });

  });
};
module.exports = intilializeSocket;
