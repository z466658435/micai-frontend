// WebSocketContext.js
import { createContext, useContext, useEffect, useState } from 'react'

export const WebSocketContext = createContext()

export const useWebSocket = () => {
  return useContext(WebSocketContext)
}

export const WebSocketProvider = ({ children }) => {
  const [clientCount, setClientCount] = useState(1)
  let socket = null

  const initiateWebSocket = () => {
    // 创建新的 WebSocket 实例
    socket = new WebSocket('ws://localhost:8183')

    // 监听连接建立事件
    socket.addEventListener('open', () => {
      console.log('WebSocket 连接已建立')
    })

    // 监听消息事件
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'count') {
        console.log("发消息啦！！！！！！！！！！！")
        console.log(data)
        setClientCount(data.count)
      }
    })

    // 监听连接错误事件
    socket.addEventListener('error', (event) => {
      console.error('WebSocket 连接错误:', event)
      socket.close()
      setTimeout(() => {
        console.log('尝试重新连接WebSocket...')
        initiateWebSocket() // 在发生错误时尝试重新连接
      }, 1000)
    })

    // 监听连接关闭事件
    socket.addEventListener('close', () => {
      console.log('WebSocket 连接已关闭')
    })
    return socket
  }

  useEffect(() => {
    if (window.location.href.split('/')[1] === '/back') {
      // 如果当前路由是 /back，则不连接 WebSocket
      return
    }
    const init_socket = initiateWebSocket()
    console.log(33333)
    // 在组件卸载时关闭 WebSocket 连接
    return () => {
      if (init_socket && init_socket.readyState === WebSocket.OPEN) {
        init_socket.close()
        console.log("socket卸载啦！")
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ socket, clientCount }}>
      {children}
    </WebSocketContext.Provider>
  )
}
