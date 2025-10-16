import Store from 'electron-store'

export interface AppConfig {
  move_k: number
  testmode: boolean
}

const store = new Store<AppConfig>({
  name: 'settings',
  defaults: {
    move_k: 1,
    testmode: true
  }
})

export default store
