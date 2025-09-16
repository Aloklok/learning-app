import { contextBridge, ipcRenderer } from 'electron'

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

function createLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: square-spin;
  animation-duration: 3s;
  background-color: #409eff;
  height: 50px;
  width: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = createLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  if (ev.data.payload === 'removeLoading') {
    removeLoading()
  }
}

// Expose API to the renderer process
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('db', {
  getInitialWords: () => ipcRenderer.invoke('db:getInitialWords'),
  updateMasteryLevel: (wordId: number, newLevel: number) => ipcRenderer.invoke('db:updateMasteryLevel', wordId, newLevel),
  getTodaysReviewCards: () => ipcRenderer.invoke('db:getTodaysReviewCards'),
  getAllBooks: () => ipcRenderer.invoke('db:getAllBooks'),
  getLessonsByBookId: (bookId: number) => ipcRenderer.invoke('db:getLessonsByBookId', bookId),
  
  // --- 新增的函数暴露 ---
  getLessonById: (lessonId: number) => ipcRenderer.invoke('db:getLessonById', lessonId),
  markLessonAsComplete: (lessonId: number) => ipcRenderer.invoke('db:markLessonAsComplete', lessonId),
  unmarkLessonAsComplete: (lessonId: number) => ipcRenderer.invoke('db:unmarkLessonAsComplete', lessonId), // 【新增】暴露取消完成的接口

  getTextsByLessonId: (lessonId: number) => ipcRenderer.invoke('db:getTextsByLessonId', lessonId),
  getVocabularyByLessonId: (lessonId: number) => ipcRenderer.invoke('db:getVocabularyByLessonId', lessonId),
  getGrammarByLessonId: (lessonId: number) => ipcRenderer.invoke('db:getGrammarByLessonId', lessonId),
  getArticlesByLessonId: (lessonId: number) => ipcRenderer.invoke('db:getArticlesByLessonId', lessonId),
  importBook: (bookData: unknown) => ipcRenderer.invoke('importer:importBook', bookData),
  updateGrammarMasteryLevel: (grammarId: number, newLevel: number) => ipcRenderer.invoke('db:updateGrammarMasteryLevel', grammarId, newLevel),
  getTodaysReviewGrammar: () => ipcRenderer.invoke('db:getTodaysReviewGrammar'), // 假设您有这个函数
  getCompletedLessons: () => ipcRenderer.invoke('db:getCompletedLessons'),
  unlockNextLesson: (currentLessonId: number) => ipcRenderer.invoke('db:unlockNextLesson', currentLessonId),
  getDashboardStats: () => ipcRenderer.invoke('db:getDashboardStats'),
  getNeighborLessons: (lessonId: number) => ipcRenderer.invoke('db:getNeighborLessons', lessonId),
  getCurrentLearningState: () => ipcRenderer.invoke('db:getCurrentLearningState'),

  // --- 为 ReviewPage 添加的别名暴露 ---
  getDueVocabulary: () => ipcRenderer.invoke('db:getDueVocabulary'),
  getDueGrammar: () => ipcRenderer.invoke('db:getDueGrammar'),

  // --- 在这里添加新方法 ---
  getLessonAndBookInfo: (lessonId: number) => ipcRenderer.invoke('db:getLessonAndBookInfo', lessonId),
  batchUpdateReviewItems: (items: any[]) => ipcRenderer.invoke('db:batchUpdateReviewItems', items),
});

contextBridge.exposeInMainWorld('ai', {
  ask: (prompt: string) => ipcRenderer.invoke('ai:ask', prompt),
})

contextBridge.exposeInMainWorld('electronAPI', {
  // startRecognition: (language: string) => ipcRenderer.send('start-recognition', language),
  // stopRecognition: () => ipcRenderer.send('stop-recognition'),
  // onRecognitionStarted: (callback) => ipcRenderer.on('recognition-started', () => callback()),
  // onRecognitionStopped: (callback) => ipcRenderer.on('recognition-stopped', () => callback()),
  // onSpeechResult: (callback) => ipcRenderer.on('speech-result', (_event, value) => callback(value)),
  // onSpeechError: (callback) => ipcRenderer.on('speech-error', (_event, value) => callback(value)),
  // requestAuthorization: () => ipcRenderer.invoke('speech:requestAuthorization'), // 新增权限请求方法
  recognize: (options: { language: string }) => ipcRenderer.invoke('speech:recognize', options),
  cancelRecognition: () => ipcRenderer.send('speech:cancel'),
  requestAuthorization: () => ipcRenderer.invoke('speech:requestAuthorization'),
});