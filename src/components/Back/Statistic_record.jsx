import React, { useRef, useContext, useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  MailOutlined,
  LikeOutlined,
  MessageOutlined,
  EditFilled,
  DeleteFilled,
} from '@ant-design/icons'
import moment from 'moment'
import micaiLogo from '../../static/img/micai.ico'
import { UploadOutlined, SearchOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/authContext'
import {
  Image,
  Button,
  Input,
  DatePicker,
  Space,
  Table,
  message,
  Menu,
  Upload,
  Modal,
  Alert,
  Radio,
  ConfigProvider,
  Avatar,
  List,
  Typography,
} from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ImgCrop from 'antd-img-crop'
import avatar0 from '../../static/img/0.jpg'
import Highlighter from 'react-highlight-words'
import ReactQuill from 'react-quill' //富文本编辑器
import 'react-quill/dist/quill.snow.css' //富文本编辑器

const { Paragraph } = Typography
const { Search } = Input
const { Column } = Table

function Statistic_record() {
  const { currentUser } = useContext(AuthContext)
  const [refresh, setRefresh] = useState(true)
  const [IPlist, setIPlist] = useState([])
  const [banlist, setBanlist] = useState([])
  const [initIPlist, setInitIPlist] = useState([])
  const [initbanlist, setInitbanlist] = useState([])
  const [totalcount, setTotalcount] = useState(0)
  const [totalnum, setTotalnum] = useState(0)
  const [totalban, setTotalban] = useState(0)

  const handleRadioChange = (e) => {
    const value = e.target.value
    // const IPlist1 = [
    //   {
    //     id: 2,
    //     IP_address: '::ffff:192.168.0.1',
    //     count: 10,
    //     record_time: '2023-09-21T10:15:22.000Z',
    //   },
    //   {
    //     id: 3,
    //     IP_address: '::ffff:10.0.0.1',
    //     count: 5,
    //     record_time: '2023-05-22T11:30:45.000Z',
    //   },
    //   {
    //     id: 4,
    //     IP_address: '::ffff:172.16.0.1',
    //     count: 22,
    //     record_time: '2023-09-20T14:55:18.000Z',
    //   },
    //   {
    //     id: 5,
    //     IP_address: '::ffff:192.168.1.1',
    //     count: 8,
    //     record_time: '2023-09-20T16:10:37.000Z',
    //   },
    // ]
    const modifiedIP = initIPlist
      .map((item) => {
        const currentDate = new Date()
        const record_time = new Date(item.record_time)
        const timeDifference = currentDate.getTime() - record_time.getTime()
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))
        // console.log(8888888888)
        // console.log(daysDifference)
        // console.log(8888888888)
        if (daysDifference == 1 && value == 'a') {
          return item
        } else if (daysDifference == 0 && value == 'b') {
          return item
        } else if (daysDifference < 8 && value == 'c') {
          return item
        } else if (daysDifference < 31 && value == 'd') {
          return item
        } else if (value == 'e') {
          return item
        }
      })
      .filter((item) => {
        return item !== undefined
      })
    const modifiedBan = initbanlist
      .map((item) => {
        const currentDate = new Date()
        const ban_time = new Date(item.ban_time)
        const timeDifference = currentDate.getTime() - ban_time.getTime()
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))
        // console.log(8888888888)
        // console.log(daysDifference)
        // console.log(8888888888)
        if (daysDifference == 1 && value == 'a') {
          return item
        } else if (daysDifference == 0 && value == 'b') {
          return item
        } else if (daysDifference < 8 && value == 'c') {
          return item
        } else if (daysDifference < 31 && value == 'd') {
          return item
        } else if (value == 'e') {
          return item
        }
      })
      .filter((item) => {
        return item !== undefined
      })
    modifiedIP.sort((a, b) => b.count - a.count)
    const topTenIPs = modifiedIP.slice(0, 10)
    setIPlist(topTenIPs)
    setBanlist(modifiedBan)
    // console.log(modifiedBan)
    // console.log(modifiedIP)
  }

  const banIP = async (IP) => {
    try {
      const res = await axios.post(`/back/banIP/${IP}`)
      // console.log(res.data)
      setRefresh(true)
      const recordinputs = {
        operation: 'Ban IP黑名单',
        resource_id: IP,
        region: '江苏 南京',
        user: currentUser.name,
        access: '管理员',
        user_id: currentUser.id,
      }
      const res1 = await axios.post('/record', recordinputs) //日志
    } catch (err) {
      console.log(err)
    }
  }

  const unbanIP = async (IP_id) => {
    try {
      const res = await axios.delete(`/back/unbanIP/${IP_id}`)
      // console.log(res.data)
      setRefresh(true)
      const recordinputs = {
        operation: 'Unban IP解封',
        resource_id: IP_id,
        region: '江苏 南京',
        user: currentUser.name,
        access: '管理员',
        user_id: currentUser.id,
      }
      const res1 = await axios.post('/record', recordinputs) //日志
      console.log(res1.data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res0 = await axios.get(`/back/statistic/${1}`)
        const totalcount0 = res0.data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.count
        }, 0)
        // console.log(res0.data)
        res0.data.sort((a, b) => b.count - a.count)
        const topTenIPs = res0.data.slice(0, 10)
        setInitIPlist(res0.data)
        setIPlist(topTenIPs)
        setTotalcount(totalcount0)
        setTotalnum(res0.data.length)

        const res = await axios.get(`/back/banlist/${1}`)
        // console.log(res.data)
        setInitbanlist(res.data)
        setBanlist(res.data)
        setTotalban(res.data.length)
      } catch (err) {
        console.log(err)
      }
    }
    if (refresh) {
      fetchDATA()
      setRefresh(false)
    }
  }, [refresh])

  return (
    <div className="containerstatistic">
      <div className="statisticbox">
        <div className="boxheader">
          <div className="btngroup">
            <Radio.Group
              defaultValue="e"
              onChange={handleRadioChange}
              buttonStyle="solid">
              <Radio.Button value="a">昨天</Radio.Button>
              <Radio.Button value="b">今天</Radio.Button>
              <Radio.Button value="c">最近7天</Radio.Button>
              <Radio.Button value="d">最近30天</Radio.Button>
              <Radio.Button value="e">全部</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className="boxcontent">
          <div className="box1">
            <div className="box1header">
              <span className="statisticheader">统计总况</span>
            </div>
            <div className="box11">
              <span className="boxtext0">{totalcount}</span>
              <span className="boxtext">访问人次</span>
            </div>
            <div className="box12">
              <span className="boxtext0">{totalnum}</span>
              <span className="boxtext">访问IP量</span>
            </div>
            <div className="box13">
              <span className="boxtext0">{totalban}</span>
              <span className="boxtext">拉黑IP个数</span>
            </div>
          </div>
          <div className="box2">
            <div className="box2header">
              <span className="statisticheader">IP访问量（TOP10）</span>
            </div>
            <div className="box2main">
              <Table dataSource={IPlist} pagination={false}>
                <Column
                  title="IP"
                  dataIndex="IP_address"
                  key="IP_address"
                  width="50%"
                  className="custom-column"
                />
                <Column
                  title="次数"
                  dataIndex="count"
                  key="count"
                  width="25%"
                  className="custom-column"
                />
                <Column
                  title="操作"
                  key="ban"
                  width="25%"
                  cellPaddingBlock="2px"
                  className="custom-column"
                  render={(_, record) => (
                    <Space size="middle">
                      <Button onClick={() => banIP(record.IP_address)}>
                        拉黑
                      </Button>
                    </Space>
                  )}
                />
              </Table>
            </div>
          </div>
          <div className="box3">
            <div className="box3header">
              <span className="statisticheader">IP黑名单</span>
            </div>
            <div className="box3main">
              <ConfigProvider
                theme={{
                  components: {
                    Table: {},
                  },
                }}>
                <Table dataSource={banlist} pagination={false}>
                  <Column
                    title="IP"
                    dataIndex="IP_address"
                    key="IP_address"
                    width="50%"
                    className="custom-column"
                  />
                  <Column
                    title="操作"
                    key="recover"
                    width="25%"
                    cellPaddingBlock="2px"
                    className="custom-column"
                    render={(_, record) => (
                      <Space size="middle">
                        <Button onClick={() => unbanIP(record.id)}>解封</Button>
                      </Space>
                    )}
                  />
                </Table>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Statistic_record