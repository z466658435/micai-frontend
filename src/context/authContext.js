import { createContext, useState, useEffect } from "react"
import axios from 'axios'
import CheckableTag from "antd/es/tag/CheckableTag"

export const AuthContext = createContext()

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  )

  const login = async (inputs) => {
    const res = await axios.post('/auth/login', inputs)
    console.log(res.data)
    setCurrentUser(res.data)
    const recordinputs = {
      operation: "Login 用户登录",
      resource_id: res.data.id,
      region: "江苏 南京",
      user: res.data.name,
      access: "普通用户",
      user_id: res.data.id
    }
    const res1 = await axios.post('/record', recordinputs)//日志
  }

  const logout = async (inputs) => {
    const res = await axios.post('/auth/logout')
    const recordinputs = {
      operation: "Logout 用户登出",
      resource_id: currentUser.id,
      region: "江苏 南京",
      user: currentUser.name,
      access: "普通用户",
      user_id: currentUser.id
    }
    const res1 = await axios.post('/record', recordinputs)//日志
    console.log(res1.data)
    setCurrentUser(null)
  }

  const saverefresh = async (updatedData, userid) => {
    const res = await axios.put(`/back/${userid}`, updatedData)
    const recordinputs = {
      operation: "Update 用户资料更新",
      resource_id: res.data.id,
      region: "江苏 南京",
      user: res.data.name,
      access: "普通用户",
      user_id: res.data.id
    }
    const res1 = await axios.post('/record', recordinputs)//日志
    // console.log(res1.data)
    setCurrentUser(res.data)
    return (res.data)
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
    //检查cookie是否存在 
    //由于cookie的httpOnly属性为true 返回后端拿取res.data值
    //1为cookie存在 0为不存在 不存在则清除localStorage
    const localStorage_confirm = async () => {
      const res = await axios.get('/auth/localStorage_remove')
      // console.log(345345435)
      // console.log(res.data)
      // console.log(345345435)
      if (res.data == 0) {
        localStorage.clear()
        setCurrentUser(null)
      }
    }
    localStorage_confirm()
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, saverefresh }}>
      {children}
    </AuthContext.Provider>
  )
}