const {pool} = require('../config')

const roomServices = require('./room.services')

exports.createPlayer = async (player_name) =>{
    try{
        const player_id = await pool.query("INSERT INTO player (player_name) VALUES($1) RETURNING player_id",[
            player_name
        ])
        return player_id.rows[0].player_id
    }
    catch(err){
        console.log(err)
        throw err
    }
}




exports.insertConnection = async (player_id , socket_id) =>{  //creates an instance of player_socket , each player can have only one socket connection at a time ......

    try{
        const res = await pool.query("INSERT INTO player_socket (player_id,socket_id) VALUES($1,$2) ON CONFLICT (player_id) DO UPDATE SET socket_id = $2 RETURNING player_id",[
            player_id,socket_id
        ])

        return res ? res.rows[0].player_id : null
    }

    catch(err){
        console.log(err)
        throw err
    }
    
}

exports.disconnectPlayer = async (socket_id) =>{
    try{
       const playerid = (await pool.query("DELETE FROM player_socket WHERE socket_id = $1 RETURNING player_id",[socket_id]).rows[0].player_id)
       const room_code = await roomServices.disconnect(playerid.rows[0].player_id)
         return {room_code:room_code , player_id :playerid}
    }

    catch(err){
        console.log(err)
    }
}