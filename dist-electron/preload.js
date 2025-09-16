"use strict";
const electron = require("electron");
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function createLoading() {
  const className = `loaders-css__square-spin`;
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
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = createLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  if (ev.data.payload === "removeLoading") {
    removeLoading();
  }
};
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("db", {
  getInitialWords: () => electron.ipcRenderer.invoke("db:getInitialWords"),
  updateMasteryLevel: (wordId, newLevel) => electron.ipcRenderer.invoke("db:updateMasteryLevel", wordId, newLevel),
  getTodaysReviewCards: () => electron.ipcRenderer.invoke("db:getTodaysReviewCards"),
  getAllBooks: () => electron.ipcRenderer.invoke("db:getAllBooks"),
  getLessonsByBookId: (bookId) => electron.ipcRenderer.invoke("db:getLessonsByBookId", bookId),
  // --- 新增的函数暴露 ---
  getLessonById: (lessonId) => electron.ipcRenderer.invoke("db:getLessonById", lessonId),
  markLessonAsComplete: (lessonId) => electron.ipcRenderer.invoke("db:markLessonAsComplete", lessonId),
  getTextsByLessonId: (lessonId) => electron.ipcRenderer.invoke("db:getTextsByLessonId", lessonId),
  getVocabularyByLessonId: (lessonId) => electron.ipcRenderer.invoke("db:getVocabularyByLessonId", lessonId),
  getGrammarByLessonId: (lessonId) => electron.ipcRenderer.invoke("db:getGrammarByLessonId", lessonId),
  getArticlesByLessonId: (lessonId) => electron.ipcRenderer.invoke("db:getArticlesByLessonId", lessonId),
  importBook: (bookData) => electron.ipcRenderer.invoke("importer:importBook", bookData),
  updateGrammarMasteryLevel: (grammarId, newLevel) => electron.ipcRenderer.invoke("db:updateGrammarMasteryLevel", grammarId, newLevel),
  getTodaysReviewGrammar: () => electron.ipcRenderer.invoke("db:getTodaysReviewGrammar"),
  // 假设您有这个函数
  getCompletedLessons: () => electron.ipcRenderer.invoke("db:getCompletedLessons"),
  unlockNextLesson: (currentLessonId) => electron.ipcRenderer.invoke("db:unlockNextLesson", currentLessonId),
  getDashboardStats: () => electron.ipcRenderer.invoke("db:getDashboardStats"),
  getNeighborLessons: (lessonId) => electron.ipcRenderer.invoke("db:getNeighborLessons", lessonId),
  getCurrentLearningState: () => electron.ipcRenderer.invoke("db:getCurrentLearningState"),
  // --- 为 ReviewPage 添加的别名暴露 ---
  getDueVocabulary: () => electron.ipcRenderer.invoke("db:getDueVocabulary"),
  getDueGrammar: () => electron.ipcRenderer.invoke("db:getDueGrammar"),
  // --- 在这里添加新方法 ---
  getLessonAndBookInfo: (lessonId) => electron.ipcRenderer.invoke("db:getLessonAndBookInfo", lessonId)
});
electron.contextBridge.exposeInMainWorld("ai", {
  ask: (prompt) => electron.ipcRenderer.invoke("ai:ask", prompt)
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  startRecognition: (language) => electron.ipcRenderer.send("start-recognition", language),
  // <-- 添加 language 参数
  stopRecognition: () => electron.ipcRenderer.send("stop-recognition"),
  onRecognitionStarted: (callback) => electron.ipcRenderer.on("recognition-started", () => callback()),
  onRecognitionStopped: (callback) => electron.ipcRenderer.on("recognition-stopped", () => callback()),
  onSpeechResult: (callback) => electron.ipcRenderer.on("speech-result", (_event, value) => callback(value)),
  onSpeechError: (callback) => electron.ipcRenderer.on("speech-error", (_event, value) => callback(value))
});
