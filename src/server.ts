import { buildApp } from "./app" 

async function main(){
  const app = await buildApp({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  });
  
  app.listen({port: 8000}, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

main()