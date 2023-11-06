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

function Daily_record() {
  const [totalnum, setTotalnum] = useState(0)
  const [recordinfo, setRecordinfo] = useState([])

  const data = recordinfo.map((item, index) => ({
    key: index.toString(),
    operation: item.operation,
    resource_id: item.resource_id,
    IP_address: item.IP_address,
    region: item.region,
    user: item.user,
    access: item.access,
    user_id: item.user_id,
    operation_time: new Date(item.operation_time).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai', // 例如，使用中国上海时区
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }))

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}>
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })
  const columns = [
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '20%',
      ...getColumnSearchProps('operation'),
    },
    {
      title: '操作资源ID',
      dataIndex: 'resource_id',
      key: 'resource_id',
      ...getColumnSearchProps('resource_id'),
    },
    {
      title: 'IP地址',
      dataIndex: 'IP_address',
      key: 'IP_address',
      ...getColumnSearchProps('IP_address'),
      sorter: (a, b) => a.IP_address.length - b.IP_address.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      ...getColumnSearchProps('region'),
      sorter: (a, b) => a.region.length - b.region.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '操作人',
      dataIndex: 'user',
      key: 'user',
      ...getColumnSearchProps('user'),
      sorter: (a, b) => a.user.length - b.user.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '权限',
      dataIndex: 'access',
      key: 'access',
      ...getColumnSearchProps('access'),
      sorter: (a, b) => a.access.length - b.access.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '操作人ID',
      dataIndex: 'user_id',
      key: 'user_id',
      ...getColumnSearchProps('user_id'),
      sorter: (a, b) => a.user_id.length - b.user_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '操作时间',
      dataIndex: 'operation_time',
      key: 'operation_time',
      width: '20%',
      ...getColumnSearchProps('operation_time'),
      sorter: (a, b) => a.operation_time.length - b.operation_time.length,
      sortDirections: ['descend', 'ascend'],
    },
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(1111)
        const res = await axios.get(`/back/rocordinfo/${1}`)
        // console.log(2222)
        console.log(res.data)
        const sortedData = res.data.sort((a, b) => {
          const timeA = new Date(a.operation_time)
          const timeB = new Date(b.operation_time)

          return timeB - timeA
        })
        setRecordinfo(sortedData)
        setTotalnum(sortedData.length)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="containerrecord">
      <div className="recordbox">
        <div className="recordheader">
          <span className="num">总共查找到{totalnum}条记录</span>
          <span className="prompt">只可查看,不可对日志做出修改</span>
        </div>
        <div className="tablebox">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="table"
          />
        </div>
      </div>
    </div>
  )
}

export default Daily_record