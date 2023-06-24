const query = require('../../databases/connector');

class FriendModel {

  static REQUEST = 0;
  static ACCEPT = 1;
  static BANNED = 2;

  constructor() {
    this.tableName = 'friends';
    this.REQUEST = FriendModel.REQUEST;
    this.ACCEPT = FriendModel.ACCEPT;
    this.BANNED = FriendModel.BANNED;
  }

  find = async (id) => {
    const user_id = 'IF(user_id = ?, friend_id, user_id)';
    let sql = `select name, username, m.* from (SELECT ${user_id} AS friend_id, created_at FROM ${this.tableName}
      where (user_id = ? or friend_id = ?) and type = '${this.ACCEPT}' order by created_at desc limit 1) as m join users on users.id = m.friend_id group by m.friend_id`;
    return await query(sql, [id, id, id]);
  }

  search = async (auth_id, text, active = 1) => {
    text = `%${text}%`
    let sql = `select id, name, username, friends.type as status from users 
      left join friends on (users.id=user_id or users.id=friend_id) 
      where (name like ? or username like ?) and id<>? and active=? and (friends.type <> 2 or friends.type is null)
      order by name limit 30`;
    return await query(sql, [text, text, auth_id, active]);
  }

  findFriend = async (auth_id, id) => {
    const user_id = 'IF(user_id = ?, friend_id, user_id)';
    const sql = `select name, username, m.* from (SELECT ${user_id} AS friend_id, type, created_at FROM ${this.tableName}
      where (user_id = ? and friend_id = ?) or (user_id = ? and friend_id = ?) limit 1) as m join users on users.id = m.friend_id group by m.friend_id`;
    let result = (await query(sql, [auth_id, auth_id, id, id, auth_id]))[0];
    if (result?.type != undefined) {
      result.type = result.type == this.REQUEST
        ? 'Request'
        : result.type == this.ACCEPT
          ? 'Accept'
          : 'Banned';
    }
    else {
      console.table({
        auth_id: auth_id,
        id: id
      })
    }

    return result;
  }

  requestList = async (auth_id) => {
    let sql = `SELECT user_id, name, username, friends.created_at FROM ${this.tableName}
      join users on users.id = user_id
      where friend_id = ? and type = '${this.REQUEST}' order by friends.created_at`;
    return await query(sql, [auth_id]);
  }

  sendRequest = async (auth_id, id) => {
    const sql = `INSERT INTO ${this.tableName}
      (user_id, friend_id) VALUES (?,?)`;

    const result = await query(sql, [auth_id, id]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  }

  acceptRequest = async (auth_id, id) => {
    console.log(this.ACCEPT)
    const sql = `UPDATE ${this.tableName} SET type = ? WHERE user_id = ? and friend_id = ?`;
    const result = await query(sql, [this.ACCEPT, id, auth_id]);

    return result;
  }

  declineRequest = async (auth_id, id) => {
    const sql = `delete from ${this.tableName} WHERE (user_id = ? and friend_id = ?) or (user_id = ? and friend_id = ?)`;
    const result = await query(sql, [auth_id, id, id, auth_id]);

    return result;
  }

  banFriend = async (auth_id, id) => {
    const isRequest = await this.findFriend(auth_id, id)
    let result
    if (isRequest.length > 0) {
      result = await query(
        `update ${this.tableName} set type = ? WHERE (user_id = ? and friend_id = ?) or (user_id = ? and friend_id = ?)`,
        [this.BANNED, auth_id, id, id, auth_id]
      )
    }
    else {
      result = await query(
        `INSERT INTO ${this.tableName} (user_id, friend_id, type) VALUES (?,?,?)`,
        [auth_id, id, this.BANNED]
      )
    }

    return result;
  }
}

module.exports = new FriendModel;