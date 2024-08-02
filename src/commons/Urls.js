
const config = {
  local : {
    ADDR : "localhost",
    PORT : ":8000",
    use_ssl : false,
  },
  dev : {
    ADDR : "localhost",
    PORT : ":8000",
    use_ssl : false,
  },
  prod : {
    ADDR : "abstractobserver.studio",
    PORT : "",
    use_ssl : true,
  },
};


export class Urls {

  static get api_url() {
    return (
      (config[process.env.REACT_APP_ENVIRONMENT].use_ssl ? "https://" :  "http://") + 
      config[process.env.REACT_APP_ENVIRONMENT].ADDR + 
      config[process.env.REACT_APP_ENVIRONMENT].PORT
    );
  }

  static get ws_url() {
    return (
      (config[process.env.REACT_APP_ENVIRONMENT].use_ssl ? "wss://" :  "ws://") + 
      config[process.env.REACT_APP_ENVIRONMENT].ADDR + 
      config[process.env.REACT_APP_ENVIRONMENT].PORT
    );
  }
}