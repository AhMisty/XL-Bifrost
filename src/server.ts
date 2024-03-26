import uws from '#uWebSockets'
import router from './router/index.js'

const server = uws.App({
});
router(server);
server.listen("0.0.0.0", 3721, (socket)=>{
  if (socket) {
    console.log("listening to port http://127.0.0.1:3721");
  }
});
//import db from '@tools/data/index.js'
//db.init().then(() => { 
  //return db.connect();
//}).then(() => {
//  return db.create();
//}).catch((error)=>{
  //console.log(error);
//});
 /*
import db from '@tools/data/index.js'
//import log from '@/src/logger/index.js'

//log.error("123");
//log.warn("123");
//log.info("123");
//log.http("123");
//log.verbose("123");
//log.debug("123");
//log.silly("123");
//log.link("123", "https://AhMisty.cn");
//console.trace()

//console.log(db.init());
db.init().then(() => { 
  //return db.connect();
}).then(() => {
  return db.create();
}).catch((error)=>{
  //console.log(error);
});

 */