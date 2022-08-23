module.exports = {
  apps: [
    {
      name: 'vue-mitting',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run preview'
    }
  ]
}
