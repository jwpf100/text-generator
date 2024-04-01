export async function initialiseDependencies(env: NodeJS.ProcessEnv){
  try {
    console.log(env.PORT)
    console.log('Initialising dependencies...')
  } catch (error: unknown) {
    console.log()
  }
}