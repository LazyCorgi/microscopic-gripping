import Store from 'electron-store'

export interface AppConfig {
  move_k: number
  testmode: boolean
  cam_x: number
  cam_y: number
}

const store = new Store<AppConfig>({
  name: 'settings',
  defaults: {
    move_k: 1,
    testmode: true,
    cam_x: 1,
    cam_y: 1
  }
})

export default store
