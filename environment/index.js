import developmentConfig from "./environment.dev";
import productionConfig from "./environment.prod";

const environment = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

export default environment;
