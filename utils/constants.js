module.exports.db_tables = {
  fed_cred: "dbo.federated_credentials",
  users: "dbo.users",
};

module.exports.db_procedures = {
  federated_login: "dbo.verify_or_insert_federated_login",
};
