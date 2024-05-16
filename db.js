var levelRocksdb, makeDb, parseJson, parseJsonArray, cut, initDomainDb, modifyKey;
levelRocksdb = require('level-rocksdb');
makeDb = function(config){
  if (makeDb.db != null) {
    return makeDb.db;
  }
  makeDb.db = levelRocksdb(config.storage.db);
  return makeDb.db;
};
parseJson = function(data, cb){
  var errorContext, err;
  errorContext = "parse-json";
  try {
    return cb(null, JSON.parse(data.toString('utf8')));
  } catch (e$) {
    err = e$;
    return cb(errorContext + " > " + err);
  }
};
parseJsonArray = function(data, cb){
  var errorContext, err;
  errorContext = "parse-json-array";
  try {
    return cb(null, data.map(function(it){
      if (it != null) {
        return JSON.parse(it);
      }
    }));
  } catch (e$) {
    err = e$;
    if (err != null) {
      console.log('data', data);
    }
    return cb(errorContext + " > " + err);
  }
};
cut = function(value){
  if (value == null) {
    return "";
  }
  if (value.length < 50) {
    return value;
  }
  return value.substr(0, 50) + "...";
};
initDomainDb = function(config, cb){
  var domain, db, del, getMany, get, list, put, batch;
  domain = config.domain;
  db = makeDb(config);
  del = function(name, cb){
    return db.del(domain + "/" + name, cb);
  };
  getMany = function(keys, cb){
    var errorContext;
    errorContext = "get-many";
    return db.getMany(keys.map(function(it){
      return domain + "/" + it;
    }), function(err, value){
      if (err != null) {
        return cb(errorContext + " > " + err);
      }
      return parseJsonArray(value, function(err, model){
        if (err != null) {
          return cb(errorContext + " > " + err);
        }
        return cb(null, model);
      });
    });
  };
  get = function(name, cb){
    var errorContext;
    errorContext = "get";
    return db.get(domain + "/" + name, function(err, value){
      if ((err != null ? err.notFound : void 8) === true) {
        return cb(err);
      }
      if (err != null) {
        return cb(errorContext + " > " + err);
      }
      return parseJson(value, function(err, model){
        if (err != null) {
          return cb(errorContext + " > " + err);
        }
        return cb(null, model);
      });
    });
  };
  list = function(part, cb){
    return db.createReadStream().on('data', function(data){
      if ((data.key + data.value).indexOf(part) > -1) {
        return console.log(data.key, '=', cut(data.value));
      }
    }).on('error', function(err){
      return console.log('Oh my!', err);
    }).on('close', function(){
      return console.log('Stream closed');
    }).on('end', function(){
      return console.log('Stream ended');
    });
  };
  put = function(name, value, cb){
    var str;
    if (value == null) {
      return cb("cannot put null value in " + domain + "/" + name);
    }
    str = JSON.stringify(value);
    return db.put(domain + "/" + name, str, cb);
  };
  batch = function(opts, cb){
    return db.batch(opts.map(modifyKey(domain)), cb);
  };
  return {
    batch: batch,
    get: get,
    put: put,
    del: del,
    getMany: getMany,
    name: 'disk',
    list: list
  };
};
modifyKey = function(domain){
  return function(item){
    var key, value;
    key = domain + "/" + item.key;
    value = JSON.stringify(item.value);
    return {
      type: item.type,
      key: key,
      value: value
    };
  };
};
module.exports = initDomainDb;