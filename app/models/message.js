const query = require('../../databases/connector');
const { multipleColumnSet } = require('../../utils/common');

class MessageModel {
  constructor() {
    this.tableName = 'messages';
  }

  find = async (id) => {
    let sql = `select users.id as user_id, name, \`text\`, messages.created_at from users 
      join ${this.tableName} on (from_id=users.id or to_id=users.id) 
      where users.id <> ? and messages.id in (
        select max(id) as id from messages where (from_id=? and to_id=users.id) or (from_id=users.id and to_id=?)
      ) group by users.id order by messages.created_at desc`;
    return await query(sql, [id, id, id]);
  }

  findChat = async (auth_id, user_id, page = 0) => {
    const ipp = 10; // item per page
    if (page <= 0) page = 0; else page--;
    const sql = `FROM ${this.tableName} WHERE (from_id=? and to_id=?) or (from_id=? and to_id=?)`;
    const sqlMessages = `SELECT * ${sql} order by created_at desc limit ${page}, ${ipp}`;
    const sqlTotalPages = `select count(id) as total ${sql}`;
    const params = [auth_id, user_id, user_id, auth_id]
    const result = {
      data: await query(sqlMessages, params),
      page: page + 1,
      total_pages: Math.ceil((await query(sqlTotalPages, params))[0].total / ipp)
    };

    return result
  }

  send = async (auth_id, params) => {
    const sql = `INSERT INTO ${this.tableName}
      (from_id, to_id, text) VALUES (?,?,?)`;

    const result = await query(sql, [auth_id, params.to_id, params.message]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  }

  readed = async (id) => {
    const sql = `UPDATE ${this.tableName} SET readed='1' WHERE id = ?`;
    const result = await query(sql, [id]);

    return result;
  }
}

module.exports = new MessageModel;