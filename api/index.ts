import { DailyWriting } from "../types"

type PromiseCallbackFun = (value?: any) => void

const saveWritingToLocalStorage = (writing: DailyWriting) => (resolve: PromiseCallbackFun, reject: PromiseCallbackFun) => {
  try {
    const writings = localStorage.getItem('writings') || '[]'
    const prevWritings = JSON.parse(writings)
    const newWritings = [...prevWritings, writing]
    localStorage.setItem('writings', JSON.stringify(newWritings))
    resolve(writing)
  } catch (error) {
    reject(error)
  }
}

const getWritingFromLocalStorage = (id: string) => (resolve: PromiseCallbackFun, reject: PromiseCallbackFun) => {
  try {
    const writings = localStorage.getItem('writings')
    if (!writings) {
      reject('No writings found')
      return
    }
    const prevWritings: DailyWriting[] = JSON.parse(writings)
    const writing = prevWritings.find(writing => writing.id === id)

    if (!writing) {
      reject('No writing created for today')
      return
    }
    resolve(writing)
  } catch (error) {
    reject(error)
  }
}

const getWritingsFromLocalStorage = () => (resolve: PromiseCallbackFun, reject: PromiseCallbackFun) => {
  const writings: any = localStorage.getItem('writings')

  // check if there is any data in localstorage
  if (!writings) {
    // if there is none (i.e. new user), create a new array
    resolve([])
  } else if (JSON.parse(writings)) {
    // if there is (existing user), get the user's writings
    resolve(JSON.parse(writings))
  } else {
    reject({
      message: 'Something went wrong',
    })
  }
}

const updateWritingInLocalStorage = (writing: DailyWriting) => (resolve: PromiseCallbackFun, reject: PromiseCallbackFun) => {
  try {
    const writings = localStorage.getItem('writings') || '[]'
    const prevWritings: DailyWriting[] = JSON.parse(writings)
    const newWritings = prevWritings.map(prev => {
      if (prev.id === writing.id) {
        return {
          ...prev,
          ...writing
        }
      }
      return prev
    })
    localStorage.setItem('writings', JSON.stringify(newWritings))
    resolve(writing)
  } catch (error) {
    reject(error)
  }
}

export const saveState = (writings: DailyWriting[]) =>
  new Promise(resolve => {
    localStorage.setItem('writings', JSON.stringify(writings))

    resolve(JSON.parse(localStorage.getItem('writings') || '[]'))
  })

export const getWritings = () => new Promise(getWritingsFromLocalStorage())
export const postWriting = (writing: DailyWriting) => new Promise(saveWritingToLocalStorage(writing))
export const getWriting = (id: string) => new Promise(getWritingFromLocalStorage(id))
export const putWriting = (writing: DailyWriting) => new Promise(updateWritingInLocalStorage(writing))
