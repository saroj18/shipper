import fs from "fs";

const envVariables = Object.keys(process.env)
    .map(key => `${key}=${process.env[key]}`)
    .join('\n');

fs.writeFileSync(`/home/app/${process.env.DIST_DIR}/.env`, envVariables);